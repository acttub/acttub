import { describe, expect, it, vi } from 'vitest';
import type { GoogleGenAI } from '@google/genai';
import { generateContentWithFallback } from './geminiGenerate';

// generateContent 만 호출하는 최소 mock — 모델별 호출을 추적한다.
function fakeAi(impl: (params: { model?: string }) => Promise<{ text: string }>) {
  const generateContent = vi.fn(impl);
  const ai = { models: { generateContent } } as unknown as GoogleGenAI;
  return { ai, generateContent };
}

// 테스트는 대기 없이(backoffMs 0) 고정된 대체 모델로 돌린다.
const opts = { backoffMs: 0, fallbackModels: ['fallback-a', 'fallback-b'] };

describe('generateContentWithFallback', () => {
  it('첫 성공이면 즉시 반환한다', async () => {
    const { ai, generateContent } = fakeAi(async () => ({ text: 'ok' }));
    const res = await generateContentWithFallback(ai, { model: 'primary', contents: 'x' }, opts);
    expect(res.text).toBe('ok');
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  it('같은 모델 503 후 재시도로 성공한다', async () => {
    let n = 0;
    const { ai, generateContent } = fakeAi(async () => {
      n += 1;
      if (n === 1) throw new Error('503 UNAVAILABLE');
      return { text: 'ok' };
    });
    const res = await generateContentWithFallback(ai, { model: 'primary', contents: 'x' }, opts);
    expect(res.text).toBe('ok');
    expect(generateContent).toHaveBeenCalledTimes(2);
  });

  it('1차 모델이 계속 포화면 대체 모델로 폴백한다', async () => {
    const { ai, generateContent } = fakeAi(async ({ model }) => {
      if (model === 'primary') throw new Error('503 high demand');
      return { text: `via ${model}` };
    });
    const res = await generateContentWithFallback(
      ai,
      { model: 'primary', contents: 'x' },
      { ...opts, attemptsPerModel: 2 },
    );
    expect(res.text).toBe('via fallback-a');
    expect(generateContent).toHaveBeenCalledTimes(3); // primary 2 + fallback-a 1
  });

  it('재시도 불가 오류는 재시도·폴백 없이 즉시 던진다', async () => {
    const { ai, generateContent } = fakeAi(async () => {
      throw new Error('400 INVALID_ARGUMENT');
    });
    await expect(
      generateContentWithFallback(ai, { model: 'primary', contents: 'x' }, opts),
    ).rejects.toThrow('400');
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  it('모든 모델이 소진되면 마지막 오류를 던진다', async () => {
    const { ai, generateContent } = fakeAi(async () => {
      throw new Error('503 overloaded');
    });
    await expect(
      generateContentWithFallback(ai, { model: 'primary', contents: 'x' }, { ...opts, attemptsPerModel: 1 }),
    ).rejects.toThrow('503');
    expect(generateContent).toHaveBeenCalledTimes(3); // primary + fallback-a + fallback-b 각 1
  });
});
