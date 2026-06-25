import type { GoogleGenAI } from '@google/genai';

// Gemini 일시 오류(503 과부하·429 쿼터 등)에 대응한다.
// 1) 같은 모델로 백오프 재시도 → 2) 그래도 안 풀리면 대체 모델로 폴백.
// coach 영상 분석은 한 모델이 통째로 503이면 분석 전체가 실패하므로, 끊기지 않게 다른 모델로 넘긴다.
const RETRYABLE = /\b(429|500|503|UNAVAILABLE|RESOURCE_EXHAUSTED|overloaded|high demand)\b/i;

type GenerateParams = Parameters<GoogleGenAI['models']['generateContent']>[0];
type GenerateResponse = Awaited<ReturnType<GoogleGenAI['models']['generateContent']>>;

export type FallbackOptions = {
  attemptsPerModel?: number;
  backoffMs?: number;
  fallbackModels?: string[];
};

// 1차 모델(보통 gemini-3.5-flash)이 포화일 때 순서대로 시도할 대체 모델.
// 운영 중 env GEMINI_FALLBACK_MODELS(콤마 구분)로 덮어쓸 수 있다.
function defaultFallbackModels(): string[] {
  const env = process.env.GEMINI_FALLBACK_MODELS;
  if (env) return env.split(',').map((model) => model.trim()).filter(Boolean);
  return ['gemini-3-flash-preview', 'gemini-2.5-flash'];
}

export async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: GenerateParams,
  options: FallbackOptions = {},
): Promise<GenerateResponse> {
  const attemptsPerModel = options.attemptsPerModel ?? 3;
  const backoffMs = options.backoffMs ?? 800;
  const fallbacks = options.fallbackModels ?? defaultFallbackModels();
  const models = [params.model, ...fallbacks.filter((model) => model !== params.model)];

  let lastError: unknown;
  for (const model of models) {
    for (let attempt = 0; attempt < attemptsPerModel; attempt += 1) {
      try {
        return await ai.models.generateContent({ ...params, model });
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message : String(error);
        // 재시도 불가 오류(잘못된 요청 등)는 모델을 바꿔도 똑같으므로 즉시 전파.
        if (!RETRYABLE.test(message)) throw error;
        // 같은 모델에서 시도 여유가 남으면 백오프 후 재시도, 마지막이면 다음 모델로.
        if (attempt < attemptsPerModel - 1) {
          await new Promise((resolve) => setTimeout(resolve, backoffMs * (attempt + 1)));
        }
      }
    }
  }
  throw lastError;
}
