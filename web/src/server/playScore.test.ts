import { describe, it, expect } from 'vitest';
import {
  normalizeTitle,
  findWork,
  scoreGuess,
  answerForDate,
  puzzleNumberForDate,
  stagedHint,
} from './playScore';
import { PLAY_WORKS } from './playData';

const byId = (id: string) => PLAY_WORKS.find((w) => w.id === id)!;

describe('normalizeTitle / findWork', () => {
  it('정규화는 공백·괄호·구두점을 무시한다', () => {
    expect(normalizeTitle('〈햄릿〉')).toBe(normalizeTitle('햄릿'));
    expect(normalizeTitle('레 미제라블')).toBe(normalizeTitle('레미제라블'));
  });

  it('title·alias 어느 표기로도 매칭된다', () => {
    expect(findWork('햄릿')?.id).toBe('hamlet');
    expect(findWork('Hamlet')?.id).toBe('hamlet');
    expect(findWork('레미제라블')?.id).toBe('lesmis');
    expect(findWork('les mis')?.id).toBe('lesmis');
  });

  it('목록에 없으면 null', () => {
    expect(findWork('존재하지않는작품')).toBeNull();
    expect(findWork('')).toBeNull();
  });
});

describe('scoreGuess', () => {
  it('정답을 맞히면 correct + 근접도 100 + 모든 칸 hit', () => {
    const answer = byId('hamlet');
    const score = scoreGuess(answer, answer);
    expect(score.correct).toBe(true);
    expect(score.proximity).toBe(100);
    expect(score.grid.every((c) => c.state === 'hit')).toBe(true);
  });

  it('속성이 부분 일치하면 near/hit가 섞이고 근접도가 중간', () => {
    // 햄릿(비극·고전·영국·연극·비장·앙상블) vs 맥베스(동일 — 단 같은 작품 아님)
    const score = scoreGuess(byId('macbeth'), byId('hamlet'));
    expect(score.correct).toBe(false);
    expect(score.proximity).toBeGreaterThan(80); // 거의 모든 속성 일치
  });

  it('시대는 한 칸 차이면 near, 두 칸이면 miss', () => {
    const era = (g: string, a: string) => scoreGuess(byId(g), byId(a)).grid.find((c) => c.key === 'era')!.state;
    expect(era('hamlet', 'hamlet')).toBe('hit'); // 고전-고전
    expect(era('seagull', 'hamlet')).toBe('near'); // 근대-고전
    expect(era('godot', 'hamlet')).toBe('miss'); // 현대-고전
  });

  it('국가는 같은 권역이면 near', () => {
    const country = (g: string, a: string) =>
      scoreGuess(byId(g), byId(a)).grid.find((c) => c.key === 'country')!.state;
    expect(country('streetcar', 'hamlet')).toBe('near'); // 미국-영국(영미권)
    expect(country('bbalrae', 'hamlet')).toBe('miss'); // 한국-영국
  });

  it('완전히 다른 작품은 근접도가 낮다', () => {
    const score = scoreGuess(byId('wicked'), byId('hamlet'));
    expect(score.proximity).toBeLessThan(40);
  });
});

describe('answerForDate (결정성)', () => {
  it('같은 날짜는 항상 같은 정답', () => {
    expect(answerForDate('2026-06-05').id).toBe(answerForDate('2026-06-05').id);
  });

  it('하루 차이는 풀에서 다음 작품', () => {
    const len = PLAY_WORKS.length;
    const n0 = puzzleNumberForDate('2026-06-05');
    const n1 = puzzleNumberForDate('2026-06-06');
    expect(n1 - n0).toBe(1);
    expect(answerForDate('2026-06-06').id).toBe(PLAY_WORKS[((n1 % len) + len) % len].id);
  });
});

describe('stagedHint', () => {
  it('시도가 쌓일수록 단계적으로 공개', () => {
    const w = byId('hamlet');
    expect(stagedHint(w, 1)).toEqual({});
    expect(stagedHint(w, 2).quote).toBeTruthy();
    expect(stagedHint(w, 2).role).toBeUndefined();
    expect(stagedHint(w, 3).role).toBeTruthy();
    expect(stagedHint(w, 4).synopsis).toBeTruthy();
  });
});
