import { describe, it, expect } from 'vitest';
import { handleFortune } from './fortuneGenerate';
import type { Fortune } from './fortunePrompt';

const okFortune: Fortune = {
  oneLiner: '오늘은 망설임이 무기가 되는 날',
  emotion: '설렘',
  condition: { stars: 4, comment: '대사가 입에 붙는 날' },
  line: '사느냐 죽느냐, 그것이 문제로다',
  mission: '독백 첫 문장만 3가지 감정으로',
};

const okGenerate = async () => okFortune;

const validBody = { birth: '1999-03-12', role: '햄릿', work: '햄릿' };

describe('handleFortune', () => {
  it('returns 405 for non-POST', async () => {
    const result = await handleFortune({ method: 'GET', url: 'http://x/api/fortune' });
    expect(result.status).toBe(405);
  });

  it('returns 400 for invalid body', async () => {
    const result = await handleFortune(
      { method: 'POST', url: 'http://x/api/fortune', body: { role: '햄릿' } },
      { apiKey: 'key', generate: okGenerate },
    );
    expect(result.status).toBe(400);
  });

  it('returns 500 when api key is missing', async () => {
    const result = await handleFortune(
      { method: 'POST', url: 'http://x/api/fortune', body: validBody },
      { apiKey: '', generate: okGenerate },
    );
    expect(result.status).toBe(500);
  });

  it('returns 200 with a fortune for valid input', async () => {
    const result = await handleFortune(
      { method: 'POST', url: 'http://x/api/fortune', body: validBody },
      { apiKey: 'key', generate: okGenerate, now: () => new Date('2026-06-02T00:00:00Z') },
    );
    expect(result.status).toBe(200);
    expect((result.body as { fortune: Fortune }).fortune.condition.stars).toBe(4);
  });
});
