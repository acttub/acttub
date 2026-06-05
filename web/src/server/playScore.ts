// playdle 채점 — 규칙 기반(작품 메타 비교). LLM 미사용 → 빠르고 결정적·설명가능.
// 추측작 vs 정답작의 속성 5칸을 일치 여부(hit/miss)로만 비교한다. 중간(near) 판정 없음.

import { PLAY_WORKS, type PlayWork } from './playData';

export const MAX_GUESSES = 6;

export type AttrState = 'hit' | 'miss';

export type GridCell = {
  key: string;
  label: string;
  state: AttrState;
  value: string; // 추측작의 해당 속성 값(표시용)
};

export type Score = {
  correct: boolean;
  proximity: number; // 0~100 (일치한 칸 수 / 전체 칸 수)
  grid: GridCell[];
};

// 제목 정규화: 공백·괄호·구두점 제거 + 소문자. "레 미제라블"="레미제라블", "〈햄릿〉"="햄릿".
export function normalizeTitle(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\s〈〉《》「」『』<>()[\]{}.,!?·:;'"’‘”“&-]/g, '');
}

// 추측 입력을 풀의 작품으로 매칭(title + aliases). 없으면 null.
export function findWork(input: string): PlayWork | null {
  const key = normalizeTitle(input);
  if (!key) return null;
  return (
    PLAY_WORKS.find((work) =>
      [work.title, ...work.aliases].some((name) => normalizeTitle(name) === key),
    ) ?? null
  );
}

function exactState(a: string, b: string): AttrState {
  return a === b ? 'hit' : 'miss';
}

export function scoreGuess(guess: PlayWork, answer: PlayWork): Score {
  const grid: GridCell[] = [
    { key: 'form', label: '형식', state: exactState(guess.form, answer.form), value: guess.form },
    { key: 'genre', label: '장르', state: exactState(guess.genre, answer.genre), value: guess.genre },
    { key: 'era', label: '시대', state: exactState(guess.era, answer.era), value: guess.era },
    { key: 'country', label: '국가', state: exactState(guess.country, answer.country), value: guess.country },
    { key: 'tone', label: '정서', state: exactState(guess.tone, answer.tone), value: guess.tone },
  ];
  const hits = grid.filter((cell) => cell.state === 'hit').length;
  const proximity = Math.round((hits / grid.length) * 100);
  return { correct: guess.id === answer.id, proximity, grid };
}

// 같은 날 모두 같은 정답(결정적 순환). 기준일로부터 경과 일수를 풀 길이로 나눈 나머지.
const EPOCH_UTC = Date.UTC(2026, 0, 1);

export function puzzleNumberForDate(dateISO: string): number {
  const [y, m, d] = dateISO.split('-').map(Number);
  return Math.floor((Date.UTC(y, m - 1, d) - EPOCH_UTC) / 86_400_000);
}

export function answerForDate(dateISO: string): PlayWork {
  const n = puzzleNumberForDate(dateISO);
  const len = PLAY_WORKS.length;
  return PLAY_WORKS[((n % len) + len) % len];
}

// 서버 기준 '오늘'(KST) 날짜 문자열. 테스트는 now를 주입.
export function todayKstISO(now: Date = new Date()): string {
  return new Date(now.getTime() + 9 * 3_600_000).toISOString().slice(0, 10);
}
