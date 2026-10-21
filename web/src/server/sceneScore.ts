import { createPartFromBase64, createUserContent, GoogleGenAI } from '@google/genai';
import type { ApiResult } from './apiCore';
import { buildScenePrompt, buildSilentFallback, parseScene, type SceneResult } from './scenePrompt';
import { cueLineOf, getSceneById, scriptTextOf, userLineOf, type SceneScript } from './sceneData';

type SceneScoreInput = {
  audio: File;
  mimeType: string;
  scene: SceneScript;
  apiKey: string;
};

export type SceneScoreOptions = {
  apiKey?: string;
  score?: (input: SceneScoreInput) => Promise<SceneResult>;
};

const FAILURE_MESSAGE = '채점에 실패했습니다. 잠시 후 다시 시도해 주세요.';
const RETRYABLE = /\b(429|500|503|UNAVAILABLE|RESOURCE_EXHAUSTED|overloaded|high demand)\b/i;

// 사용자 턴 1턴(~10초)이라 작다. coach처럼 files.upload+폴링하지 않고 inline base64 1콜로 끝낸다(심플·빠름).
const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

type FormValue = string | File;

type GenerateParams = {
  model: string;
  contents: ReturnType<typeof createUserContent>;
  config?: {
    temperature: number;
    maxOutputTokens: number;
    thinkingConfig?: { thinkingBudget: number };
  };
};

function isUploadedFile(value: FormValue | null): value is File {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<File>;
  return (
    typeof record.arrayBuffer === 'function'
    && typeof record.size === 'number'
    && typeof record.type === 'string'
  );
}

function textFromForm(value: FormValue | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

function methodNotAllowed(): ApiResult {
  return { status: 405, body: { error: 'method not allowed' } };
}

function jsonError(status: number, error: string): ApiResult {
  return { status, body: { error } };
}

async function generateContentWithRetry(ai: GoogleGenAI, params: GenerateParams, attempts = 3) {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await ai.models.generateContent(params);
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      if (attempt === attempts - 1 || !RETRYABLE.test(message)) throw error;
      await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
    }
  }
  throw lastError;
}

async function defaultScore(input: SceneScoreInput): Promise<SceneResult> {
  const ai = new GoogleGenAI({ apiKey: input.apiKey });
  const base64 = Buffer.from(await input.audio.arrayBuffer()).toString('base64');
  const audioPart = createPartFromBase64(base64, input.mimeType || 'audio/webm');
  const prompt = buildScenePrompt({
    situation: input.scene.situation,
    scriptText: scriptTextOf(input.scene),
    userLine: userLineOf(input.scene),
    cueLine: cueLineOf(input.scene),
  });
  const result = await generateContentWithRetry(ai, {
    model: process.env.GEMINI_MODEL ?? 'gemini-3.5-flash',
    contents: createUserContent([audioPart, prompt]),
    // 매 녹음이 다르므로 약간의 위트 변주를 허용(0.5). thinking은 꺼서(0) 예산을 JSON 본문에만 쓴다.
    // (lineshot 교훈: thinkingBudget을 키우면 긴 음성에서 JSON이 잘려 500이 난다 → 0 유지.)
    // 한국어 카드(총평·4축 코멘트·강점·팁·명장면)가 길어 본문 잘림을 막으려 출력은 1024로 잡는다.
    config: {
      temperature: 0.5,
      maxOutputTokens: 1024,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });
  return parseScene(result.text ?? '');
}

export async function handleSceneScore(request: Request, options: SceneScoreOptions = {}): Promise<ApiResult> {
  if (request.method.toUpperCase() !== 'POST') return methodNotAllowed();

  const apiKey = options.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonError(500, 'AI 환경변수(GEMINI_API_KEY)가 설정되어 있지 않습니다.');
  }

  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
      return jsonError(400, '녹음 파일이 필요합니다.');
    }

    const formData = await request.formData();

    // 어떤 장면을 연기했는지. 대본은 서버 소스(sceneData)가 정본이라 sceneId만 받고 서버에서 조회한다.
    const sceneId = textFromForm(formData.get('sceneId'));
    const scene = getSceneById(sceneId);
    if (!scene) {
      return jsonError(400, '알 수 없는 장면입니다.');
    }

    const audio = formData.get('audio');
    if (!isUploadedFile(audio)) {
      return jsonError(400, '녹음 파일이 필요합니다.');
    }
    if (audio.size <= 0) {
      return jsonError(400, '비어 있는 녹음은 채점할 수 없습니다.');
    }
    if (audio.size > MAX_AUDIO_BYTES) {
      return jsonError(400, '녹음이 너무 깁니다. 10초 내외로 다시 녹음해 주세요.');
    }

    // 무음/빈 녹음 가드. 압축된 webm은 서버에서 디코드가 비싸므로, 클라이언트가 Web Audio로 측정한
    // 진폭(level, 0~1)을 신뢰한다. level이 임계 이하면 Gemini를 부르지 않고 위트 폴백 카드를 돌려준다.
    // (Gemini가 무음에 funFallback=false로 호평을 지어내는 문제를 결정적으로 차단 — lineshot 교훈 계승.)
    const rawLevel = formData.get('level');
    const level = typeof rawLevel === 'string' ? Number(rawLevel) : Number.NaN;
    const SILENCE_LEVEL = 0.01;
    if (Number.isFinite(level) && level < SILENCE_LEVEL) {
      return { status: 200, body: { result: buildSilentFallback() } };
    }

    const result = await (options.score ?? defaultScore)({
      audio,
      mimeType: audio.type,
      scene,
      apiKey,
    });
    return { status: 200, body: { result } };
  } catch (error) {
    console.error('Scene score failed', error);
    return jsonError(500, FAILURE_MESSAGE);
  }
}
