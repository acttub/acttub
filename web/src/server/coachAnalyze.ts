import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createPartFromUri, createUserContent, GoogleGenAI } from '@google/genai';
import { del } from '@vercel/blob';
import { buildSynthesisPrompt, formatTime, parseGeminiFeedback, type CoachFeedback } from '../coach/evaluation';
import { buildObserverPrompt, buildPersonaPrompt, PERSONAS } from '../coach/personas';
import type { ApiResult } from './apiCore';

type GeminiFileState = {
  name?: string;
  uri?: string;
  mimeType?: string;
  state?: unknown;
};

type CoachAnalyzeInput = {
  video: File;
  fileName: string;
  category: string;
  intent: string;
  startTime: number;
  endTime: number;
  apiKey: string;
};

type CoachAnalyzeOptions = {
  apiKey?: string;
  analyze?: (input: CoachAnalyzeInput) => Promise<CoachFeedback>;
  fetch?: typeof fetch;
};

type FormValue = string | File;

const ANALYZE_FAILURE_MESSAGE = '분석 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.';

function numberFromForm(value: FormValue | null) {
  if (typeof value !== 'string') return Number.NaN;
  return Number(value);
}

function textFromForm(value: FormValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

function fileExtension(file: File) {
  if (file.name.includes('.')) return path.extname(file.name);
  if (file.type === 'video/webm') return '.webm';
  if (file.type === 'video/quicktime') return '.mov';
  return '.mp4';
}

function fileStateName(state: unknown) {
  return String(state ?? '').toUpperCase();
}

function isUploadedFile(value: FormValue | null): value is File {
  if (!value || typeof value !== 'object') return false;

  const record = value as Partial<File>;
  return (
    typeof record.arrayBuffer === 'function'
    && typeof record.size === 'number'
    && typeof record.type === 'string'
  );
}

function methodNotAllowed(): ApiResult {
  return { status: 405, body: { error: 'method not allowed' } };
}

function jsonError(status: number, error: string): ApiResult {
  return { status, body: { error } };
}

function jsonString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function jsonNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  return Number.NaN;
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function defaultAnalyze(input: CoachAnalyzeInput): Promise<CoachFeedback> {
  let tempPath = '';
  let geminiFileName = '';

  try {
    const bytes = Buffer.from(await input.video.arrayBuffer());
    const uploadDir = path.join(tmpdir(), 'acttub-coach');
    await mkdir(uploadDir, { recursive: true });
    tempPath = path.join(uploadDir, `${randomUUID()}${fileExtension(input.video)}`);
    await writeFile(tempPath, bytes);

    const ai = new GoogleGenAI({ apiKey: input.apiKey });
    let uploadedFile = await ai.files.upload({
      file: tempPath,
      config: {
        displayName: input.fileName,
        mimeType: input.video.type || 'video/mp4',
      },
    }) as GeminiFileState;

    geminiFileName = uploadedFile.name ?? '';

    for (let attempt = 0; attempt < 12; attempt += 1) {
      if (fileStateName(uploadedFile.state) === 'ACTIVE') break;
      if (!uploadedFile.name) throw new Error('업로드 파일 이름을 확인하지 못했습니다.');

      await sleep(5000);
      uploadedFile = await ai.files.get({ name: uploadedFile.name }) as GeminiFileState;
    }

    if (fileStateName(uploadedFile.state) !== 'ACTIVE') {
      throw new Error('AI 분석 서비스가 영상 처리를 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    }

    if (!uploadedFile.uri || !uploadedFile.mimeType) {
      throw new Error('업로드 파일 URI 또는 MIME 타입을 확인하지 못했습니다.');
    }

    const model = process.env.GEMINI_MODEL ?? 'gemini-3.5-flash';
    const videoPart = createPartFromUri(uploadedFile.uri, uploadedFile.mimeType);
    const generate = (prompt: string, parts: ReturnType<typeof createPartFromUri>[] = []) =>
      ai.models
        .generateContent({ model, contents: createUserContent([...parts, prompt]) })
        .then((response) => response.text ?? '');

    // L0: 영상을 직접 보는 유일한 단계 — 타임코드별 중립 관찰을 뽑는다.
    const observations = await generate(
      buildObserverPrompt({
        category: input.category,
        start: formatTime(input.startTime),
        end: formatTime(input.endTime),
      }),
      [videoPart],
    );

    // L1: 페르소나 4명이 같은 관찰 위에서 텍스트로 병렬 분석.
    const signals = await Promise.all(
      PERSONAS.map((persona) =>
        generate(buildPersonaPrompt(persona, {
          category: input.category,
          intent: input.intent,
          observations,
        })).then((text) => ({ persona: persona.key, signals: text })),
      ),
    );

    // L2: 신호를 하나의 피드백으로 종합.
    const synthesis = await generate(
      buildSynthesisPrompt({
        category: input.category,
        intent: input.intent,
        signals: JSON.stringify(signals),
      }),
    );

    return parseGeminiFeedback(synthesis);
  } finally {
    if (tempPath) {
      await unlink(tempPath).catch(() => undefined);
    }

    if (geminiFileName) {
      const ai = new GoogleGenAI({ apiKey: input.apiKey });
      await ai.files.delete({ name: geminiFileName }).catch(() => undefined);
    }
  }
}

async function fileFromBlobUrl(input: {
  fetcher: typeof fetch;
  videoUrl: string;
  fileName: string;
  mimeType: string;
}) {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(input.videoUrl);
  } catch {
    throw new Error('invalid video url');
  }

  if (parsedUrl.protocol !== 'https:') {
    throw new Error('invalid video url');
  }

  const response = await input.fetcher(parsedUrl);
  if (!response.ok) {
    throw new Error('video download failed');
  }

  const blob = await response.blob();
  const mimeType = input.mimeType || response.headers.get('content-type') || blob.type || 'video/mp4';
  return new File([blob], input.fileName, { type: mimeType });
}

function validateAnalyzeFields(fields: {
  category: string;
  intent: string;
  startTime: number;
  endTime: number;
}) {
  if (!fields.category) {
    return '연기 영상 분류를 선택해 주세요.';
  }

  if (!fields.intent) {
    return '이번 연습의 의도나 목표를 입력해 주세요.';
  }

  if (!Number.isFinite(fields.startTime) || !Number.isFinite(fields.endTime) || fields.startTime < 0 || fields.endTime <= fields.startTime) {
    return '분석 시작/끝 시간이 올바르지 않습니다.';
  }

  return '';
}

export async function handleCoachAnalyze(request: Request, options: CoachAnalyzeOptions = {}): Promise<ApiResult> {
  if (request.method.toUpperCase() !== 'POST') return methodNotAllowed();

  const apiKey = options.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonError(500, 'AI 분석 환경변수가 설정되어 있지 않습니다. Vercel 또는 로컬 환경변수를 확인해 주세요.');
  }

  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const payload = await request.json().catch(() => undefined) as Record<string, unknown> | undefined;
      const videoUrl = jsonString(payload?.videoUrl);
      const fileName = jsonString(payload?.fileName) || '연기 연습 영상';
      const mimeType = jsonString(payload?.mimeType);
      const category = jsonString(payload?.category);
      const intent = jsonString(payload?.intent);
      const startTime = jsonNumber(payload?.startTime);
      const endTime = jsonNumber(payload?.endTime);

      if (!videoUrl) {
        return jsonError(400, '분석할 영상 파일이 필요합니다.');
      }

      const validationError = validateAnalyzeFields({ category, intent, startTime, endTime });
      if (validationError) {
        return jsonError(400, validationError);
      }

      let video: File | null = null;
      try {
        video = await fileFromBlobUrl({
          fetcher: options.fetch ?? fetch,
          videoUrl,
          fileName,
          mimeType,
        });

        if (video.size <= 0) {
          return jsonError(400, '비어 있는 영상 파일은 분석할 수 없습니다.');
        }

        const feedback = await (options.analyze ?? defaultAnalyze)({
          video,
          fileName,
          category,
          intent,
          startTime,
          endTime,
          apiKey,
        });

        return { status: 200, body: { feedback } };
      } finally {
        await del(videoUrl).catch(() => undefined);
      }
    }

    if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
      return jsonError(400, '분석할 영상 파일이 필요합니다.');
    }

    const formData = await request.formData();
    const video = formData.get('video');

    if (!isUploadedFile(video)) {
      return jsonError(400, '분석할 영상 파일이 필요합니다.');
    }

    if (video.size <= 0) {
      return jsonError(400, '비어 있는 영상 파일은 분석할 수 없습니다.');
    }

    const fileName = textFromForm(formData.get('fileName')) || video.name || '연기 연습 영상';
    const category = textFromForm(formData.get('category'));
    const intent = textFromForm(formData.get('intent'));
    const startTime = numberFromForm(formData.get('startTime'));
    const endTime = numberFromForm(formData.get('endTime'));

    const validationError = validateAnalyzeFields({ category, intent, startTime, endTime });
    if (validationError) {
      return jsonError(400, validationError);
    }

    const feedback = await (options.analyze ?? defaultAnalyze)({
      video,
      fileName,
      category,
      intent,
      startTime,
      endTime,
      apiKey,
    });

    return { status: 200, body: { feedback } };
  } catch (error) {
    console.error('Coach analyze failed', error);
    return jsonError(500, ANALYZE_FAILURE_MESSAGE);
  }
}
