import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';
import type { ApiRequestInput, ApiResult } from './apiCore';
import { buildFortunePrompt, parseFortune, type Fortune, type FortuneSeed } from './fortunePrompt';

const fortuneInputSchema = z.object({
  birth: z.string().trim().min(1).max(40),
  role: z.string().trim().min(1).max(100),
  work: z.string().trim().min(1).max(100),
});

type FortuneGenerateInput = FortuneSeed & { apiKey: string };

export type FortuneOptions = {
  apiKey?: string;
  generate?: (input: FortuneGenerateInput) => Promise<Fortune>;
};

const FAILURE_MESSAGE = '운세를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
const RETRYABLE = /\b(429|500|503|UNAVAILABLE|RESOURCE_EXHAUSTED|overloaded|high demand)\b/i;

// 같은 입력 → 같은 seed → 같은 운세 (결정성). 날짜는 시드에 넣지 않는다.
function seedFrom(input: FortuneSeed): number {
  const text = `${input.birth}|${input.role}|${input.work}`;
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (Math.imul(hash, 31) + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

type GenParams = {
  model: string;
  contents: string;
  config?: { temperature: number; seed: number; maxOutputTokens: number };
};

async function generateContentWithRetry(ai: GoogleGenAI, params: GenParams, attempts = 3) {
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

async function defaultGenerate(input: FortuneGenerateInput): Promise<Fortune> {
  const ai = new GoogleGenAI({ apiKey: input.apiKey });
  const result = await generateContentWithRetry(ai, {
    model: process.env.GEMINI_MODEL ?? 'gemini-3.5-flash',
    contents: buildFortunePrompt(input),
    // temperature 0 + 입력 기반 seed → 같은 입력엔 같은 답. maxOutputTokens 제한으로 응답 단축(속도).
    config: { temperature: 0, seed: seedFrom(input), maxOutputTokens: 512 },
  });
  return parseFortune(result.text ?? '');
}

export async function handleFortune(input: ApiRequestInput, options: FortuneOptions = {}): Promise<ApiResult> {
  if (input.method.toUpperCase() !== 'POST') {
    return { status: 405, body: { error: 'method not allowed' } };
  }

  const parsed = fortuneInputSchema.safeParse(input.body);
  if (!parsed.success) {
    return { status: 400, body: { error: parsed.error.issues } };
  }

  const apiKey = options.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { status: 500, body: { error: 'AI 환경변수(GEMINI_API_KEY)가 설정되어 있지 않습니다.' } };
  }

  try {
    const generate = options.generate ?? defaultGenerate;
    const fortune = await generate({ ...parsed.data, apiKey });
    return { status: 200, body: { fortune } };
  } catch (error) {
    console.error('Fortune generate failed', error);
    return { status: 500, body: { error: FAILURE_MESSAGE } };
  }
}
