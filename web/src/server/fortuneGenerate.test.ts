import { describe, it, expect } from 'vitest';
import { handleFortune } from './fortuneGenerate';
import type { Fortune } from './fortunePrompt';

const okFortune: Fortune = {
  overall: { stars: 4, summary: '오늘은 망설임이 무기가 되는 날' },
  aspects: {
    emotion: { stars: 5, comment: '억눌린 분노가 터진다' },
    delivery: { stars: 3, comment: '호흡이 짧아질 수 있음' },
    focus: { stars: 4, comment: '긴장이 몰입으로' },
    rapport: { stars: 3, comment: '리액션을 늦게 받아라' },
  },
  lucky: { emotion: '체념 뒤의 분노', warmup: '복식호흡 10번', mood: '차가운 블루' },
  line: { quote: '사느냐 죽느냐, 그것이 문제로다', note: '묻는 채로 둬라' },
  mission: '독백 첫 문장만 3가지 감정으로',
  caution: '잘하려는 마음이 앞서면 대사가 빨라진다',
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
      { apiKey: 'key', generate: okGenerate },
    );
    expect(result.status).toBe(200);
    expect((result.body as { fortune: Fortune }).fortune.overall.stars).toBe(4);
  });
});
