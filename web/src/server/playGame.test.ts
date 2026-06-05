import { describe, it, expect } from 'vitest';
import { handlePlay } from './playGame';
import { answerForDate } from './playScore';

const FIXED = '2026-06-05';
const opts = { today: FIXED };
const answerTitle = answerForDate(FIXED).title;

describe('handlePlay GET', () => {
  it('메타 + 자동완성 목록을 주되 정답은 노출하지 않는다', async () => {
    const result = await handlePlay({ method: 'GET', url: `http://x/api/play?date=${FIXED}` }, opts);
    expect(result.status).toBe(200);
    const body = result.body as { puzzleNumber: number; works: { title: string }[]; answer?: unknown };
    expect(typeof body.puzzleNumber).toBe('number');
    expect(body.works.length).toBeGreaterThan(0);
    expect('answer' in body).toBe(false); // 정답 키가 아예 없어야 한다
  });
});

describe('handlePlay POST', () => {
  it('비-GET/POST는 405', async () => {
    const result = await handlePlay({ method: 'PUT', url: 'http://x/api/play' }, opts);
    expect(result.status).toBe(405);
  });

  it('잘못된 body는 400', async () => {
    const result = await handlePlay({ method: 'POST', url: 'http://x/api/play', body: {} }, opts);
    expect(result.status).toBe(400);
  });

  it('목록에 없는 작품은 found:false, 정답 비공개', async () => {
    const result = await handlePlay(
      { method: 'POST', url: 'http://x/api/play', body: { guess: '없는작품xyz', date: FIXED } },
      opts,
    );
    expect(result.status).toBe(200);
    const body = result.body as { found: boolean; answer?: unknown };
    expect(body.found).toBe(false);
    expect(body.answer).toBeUndefined();
  });

  it('오답(초기 시도)은 채점만 주고 정답을 숨긴다', async () => {
    // 정답이 아닌 작품을 고른다.
    const wrong = answerTitle === '햄릿' ? '위키드' : '햄릿';
    const result = await handlePlay(
      { method: 'POST', url: 'http://x/api/play', body: { guess: wrong, date: FIXED, attempt: 1 } },
      opts,
    );
    const body = result.body as { found: boolean; result: { correct: boolean }; answer?: unknown };
    expect(body.found).toBe(true);
    expect(body.result.correct).toBe(false);
    expect(body.answer).toBeUndefined();
  });

  it('정답을 맞히면 correct + 정답 공개', async () => {
    const result = await handlePlay(
      { method: 'POST', url: 'http://x/api/play', body: { guess: answerTitle, date: FIXED, attempt: 1 } },
      opts,
    );
    const body = result.body as { result: { correct: boolean; proximity: number }; answer?: { title: string } };
    expect(body.result.correct).toBe(true);
    expect(body.result.proximity).toBe(100);
    expect(body.answer?.title).toBe(answerTitle);
  });

  it('최대 시도 소진 시 오답이어도 정답 공개', async () => {
    const wrong = answerTitle === '햄릿' ? '위키드' : '햄릿';
    const result = await handlePlay(
      { method: 'POST', url: 'http://x/api/play', body: { guess: wrong, date: FIXED, attempt: 6 } },
      opts,
    );
    const body = result.body as { answer?: { title: string } };
    expect(body.answer?.title).toBe(answerTitle);
  });
});
