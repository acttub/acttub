import { describe, it, expect } from 'vitest';
import {
  normalizeTitle,
  findWork,
  scoreGuess,
  answerForDate,
  puzzleNumberForDate,
} from './playScore';
import { PLAY_WORKS } from './playData';

const byId = (id: string) => PLAY_WORKS.find((w) => w.id === id)!;

describe('정답 풀 무결성', () => {
  it('id가 유일하고 60개 규모', () => {
    const ids = PLAY_WORKS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(PLAY_WORKS.length).toBeGreaterThanOrEqual(55);
  });

  it('모든 작품은 5속성을 채운다', () => {
    for (const w of PLAY_WORKS) {
      expect(w.form && w.genre && w.era && w.country && w.tone).toBeTruthy();
    }
  });
});

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
  it('정답을 맞히면 correct + 근접도 100 + 5칸 모두 hit', () => {
    const answer = byId('hamlet');
    const score = scoreGuess(answer, answer);
    expect(score.correct).toBe(true);
    expect(score.proximity).toBe(100);
    expect(score.grid).toHaveLength(5);
    expect(score.grid.every((c) => c.state === 'hit')).toBe(true);
  });

  it('그리드 키는 형식·장르·시대·국가·정서 5칸', () => {
    const score = scoreGuess(byId('hamlet'), byId('romeo'));
    expect(score.grid.map((c) => c.key)).toEqual(['form', 'genre', 'era', 'country', 'tone']);
  });

  it('속성은 일치(hit)/불일치(miss)만, near 없음', () => {
    const states = new Set(scoreGuess(byId('streetcar'), byId('hamlet')).grid.map((c) => c.state));
    for (const s of states) expect(['hit', 'miss']).toContain(s);
  });

  it('일부만 일치하면 근접도가 칸 비율을 따른다', () => {
    // 햄릿(연극·비극·고전·영국·비장) vs 로미오(연극·비극·고전·영국·서정): 정서만 불일치 → 4/5 = 80
    const score = scoreGuess(byId('romeo'), byId('hamlet'));
    expect(score.correct).toBe(false);
    expect(score.proximity).toBe(80);
  });

  it('완전히 다른 작품은 근접도 0', () => {
    // 햄릿(연극·비극·고전·영국·비장) vs 위키드(뮤지컬·판타지·현대·미국·유쾌)
    const score = scoreGuess(byId('wicked'), byId('hamlet'));
    expect(score.proximity).toBe(0);
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
