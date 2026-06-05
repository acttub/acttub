// playdle 채점 — 규칙 기반(작품 메타 비교). LLM 미사용 → 빠르고 결정적·설명가능.
// 추측작 vs 정답작의 속성 5칸을 비교해 워들식 그리드(hit/near/miss)와 꼬맨틀식 근접도%를 낸다.

import { PLAY_WORKS, type PlayWork } from './playData';

export const MAX_GUESSES = 6;

export type AttrState = 'hit' | 'near' | 'miss';

export type GridCell = {
  key: string;
  label: string;
  state: AttrState;
  value: string; // 추측작의 해당 속성 값(표시용)
};

export type Score = {
  correct: boolean;
  proximity: number; // 0~100
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

const ERA_ORDER: Record<string, number> = { 고전: 0, 근대: 1, 현대: 2 };
// 국가 권역 — 같은 권역이면 near. 영미권 / 대륙유럽 / 아시아.
const COUNTRY_REGION: Record<string, string> = {
  영국: 'anglo', 미국: 'anglo', 아일랜드: 'anglo',
  프랑스: 'euro', 독일: 'euro', 러시아: 'euro', 노르웨이: 'euro', 그리스: 'euro', 오스트리아: 'euro',
  한국: 'asia',
};

function exactState(a: string, b: string): AttrState {
  return a === b ? 'hit' : 'miss';
}

function eraState(a: string, b: string): AttrState {
  const da = ERA_ORDER[a];
  const db = ERA_ORDER[b];
  if (da === undefined || db === undefined) return exactState(a, b);
  const dist = Math.abs(da - db);
  if (dist === 0) return 'hit';
  if (dist === 1) return 'near';
  return 'miss';
}

function countryState(guess: string, answer: string): AttrState {
  if (guess === answer) return 'hit';
  const rg = COUNTRY_REGION[guess];
  const ra = COUNTRY_REGION[answer];
  return rg && ra && rg === ra ? 'near' : 'miss';
}

const STATE_WEIGHT: Record<AttrState, number> = { hit: 1, near: 0.5, miss: 0 };

export function scoreGuess(guess: PlayWork, answer: PlayWork): Score {
  const grid: GridCell[] = [
    { key: 'form', label: '형식', state: exactState(guess.form, answer.form), value: guess.form },
    { key: 'genre', label: '장르', state: exactState(guess.genre, answer.genre), value: guess.genre },
    { key: 'era', label: '시대', state: eraState(guess.era, answer.era), value: guess.era },
    { key: 'country', label: '국가', state: countryState(guess.country, answer.country), value: guess.country },
    { key: 'tone', label: '정서', state: exactState(guess.tone, answer.tone), value: guess.tone },
  ];
  const sum = grid.reduce((acc, cell) => acc + STATE_WEIGHT[cell.state], 0);
  const proximity = Math.round((sum / grid.length) * 100);
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
