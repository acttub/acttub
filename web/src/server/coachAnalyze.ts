import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createPartFromUri, createUserContent, GoogleGenAI } from '@google/genai';
import { buildEvaluationPrompt, parseGeminiFeedback, type CoachFeedback } from '../coach/evaluation.js';
import type { ApiResult } from './apiCore.js';

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
};

type FormValue = string | File;

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
      if (!uploadedFile.name) throw new Error('Gemini 파일 이름을 확인하지 못했습니다.');

      await sleep(5000);
      uploadedFile = await ai.files.get({ name: uploadedFile.name }) as GeminiFileState;
    }

    if (fileStateName(uploadedFile.state) !== 'ACTIVE') {
      throw new Error('Gemini가 영상 처리를 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    }

    if (!uploadedFile.uri || !uploadedFile.mimeType) {
      throw new Error('Gemini 업로드 파일 URI 또는 MIME 타입을 확인하지 못했습니다.');
    }

    const prompt = buildEvaluationPrompt({
      fileName: input.fileName,
      category: input.category,
      intent: input.intent,
      startTime: input.startTime,
      endTime: input.endTime,
    });

    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL ?? 'gemini-3.5-flash',
      contents: createUserContent([createPartFromUri(uploadedFile.uri, uploadedFile.mimeType), prompt]),
    });

    return parseGeminiFeedback(result.text ?? '');
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

export async function handleCoachAnalyze(request: Request, options: CoachAnalyzeOptions = {}): Promise<ApiResult> {
  if (request.method.toUpperCase() !== 'POST') return methodNotAllowed();

  const apiKey = options.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonError(500, 'GEMINI_API_KEY가 설정되어 있지 않습니다. Vercel 또는 로컬 환경변수를 확인해 주세요.');
  }

  try {
    const contentType = request.headers.get('content-type') ?? '';
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

    if (!category) {
      return jsonError(400, '연기 영상 분류를 선택해 주세요.');
    }

    if (!intent) {
      return jsonError(400, '이번 연습의 의도나 목표를 입력해 주세요.');
    }

    if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || startTime < 0 || endTime <= startTime) {
      return jsonError(400, '분석 시작/끝 시간이 올바르지 않습니다.');
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
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return jsonError(500, `분석 요청에 실패했습니다. ${message}`);
  }
}
