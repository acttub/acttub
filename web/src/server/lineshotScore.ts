import { createPartFromBase64, createUserContent, GoogleGenAI } from '@google/genai';
import type { ApiResult } from './apiCore';
import { buildLineshotPrompt, parseLineshot, type Lineshot } from './lineshotPrompt';

type LineshotScoreInput = {
  audio: File;
  mimeType: string;
  line: string;
  apiKey: string;
};

export type LineshotScoreOptions = {
  apiKey?: string;
  score?: (input: LineshotScoreInput) => Promise<Lineshot>;
};

const FAILURE_MESSAGE = '채점에 실패했습니다. 잠시 후 다시 시도해 주세요.';
const RETRYABLE = /\b(429|500|503|UNAVAILABLE|RESOURCE_EXHAUSTED|overloaded|high demand)\b/i;

// ~10초 음성이라 작다. coach처럼 files.upload + ACTIVE 폴링하지 않고 inline base64 1콜로 끝낸다(심플·빠름).
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

async function defaultScore(input: LineshotScoreInput): Promise<Lineshot> {
  const ai = new GoogleGenAI({ apiKey: input.apiKey });
  const base64 = Buffer.from(await input.audio.arrayBuffer()).toString('base64');
  const audioPart = createPartFromBase64(base64, input.mimeType || 'audio/webm');
  const result = await generateContentWithRetry(ai, {
    model: process.env.GEMINI_MODEL ?? 'gemini-3.5-flash',
    contents: createUserContent([audioPart, buildLineshotPrompt(input.line)]),
    // 매 녹음이 다르므로 약간의 위트 변주를 허용(0.5). thinking은 꺼서 예산을 JSON 본문에만 쓴다.
    config: {
      temperature: 0.5,
      maxOutputTokens: 700,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });
  return parseLineshot(result.text ?? '');
}

export async function handleLineshotScore(request: Request, options: LineshotScoreOptions = {}): Promise<ApiResult> {
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

    const line = textFromForm(formData.get('line')).slice(0, 200);

    const result = await (options.score ?? defaultScore)({
      audio,
      mimeType: audio.type,
      line,
      apiKey,
    });
    return { status: 200, body: { result } };
  } catch (error) {
    console.error('Lineshot score failed', error);
    return jsonError(500, FAILURE_MESSAGE);
  }
}
