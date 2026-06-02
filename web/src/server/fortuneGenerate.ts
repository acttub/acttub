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
  now?: () => Date;
};

const FAILURE_MESSAGE = '운세를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';

async function defaultGenerate(input: FortuneGenerateInput): Promise<Fortune> {
  const ai = new GoogleGenAI({ apiKey: input.apiKey });
  const result = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL ?? 'gemini-3.5-flash',
    contents: buildFortunePrompt(input),
  });
  return parseFortune(result.text ?? '');
}

function todayString(now: () => Date): string {
  const date = now();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
    const fortune = await generate({
      ...parsed.data,
      today: todayString(options.now ?? (() => new Date())),
      apiKey,
    });
    return { status: 200, body: { fortune } };
  } catch (error) {
    console.error('Fortune generate failed', error);
    const detail = error instanceof Error ? error.message : String(error);
    return { status: 500, body: { error: `${FAILURE_MESSAGE} [debug: ${detail}]` } };
  }
}
