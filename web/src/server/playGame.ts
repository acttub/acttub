// playdle API 핸들러 — stateless 채점.
// GET: 오늘 퍼즐 메타 + 자동완성용 작품 제목 목록(정답은 노출하지 않는다).
// POST: 추측 1건 채점. 정답을 맞히거나 최대 시도를 소진했을 때만 정답을 공개(치팅 방지).

import { z } from 'zod';
import type { ApiRequestInput, ApiResult } from './apiCore';
import { PLAY_WORKS } from './playData';
import {
  MAX_GUESSES,
  answerForDate,
  findWork,
  scoreGuess,
  todayKstISO,
  puzzleNumberForDate,
} from './playScore';

export type PlayOptions = { today?: string }; // 테스트용 '오늘' 주입

const guessSchema = z.object({
  guess: z.string().trim().min(1).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  attempt: z.number().int().min(1).max(50).optional(),
});

const ATTRIBUTES = [
  { key: 'form', label: '형식' },
  { key: 'genre', label: '장르' },
  { key: 'era', label: '시대' },
  { key: 'country', label: '국가' },
  { key: 'tone', label: '정서' },
];

function resolveDate(requested: string | undefined, options: PlayOptions): string {
  return requested ?? options.today ?? todayKstISO();
}

function meta(date: string) {
  return {
    date,
    puzzleNumber: puzzleNumberForDate(date),
    maxGuesses: MAX_GUESSES,
    attributes: ATTRIBUTES,
  };
}

function handleGet(date: string): ApiResult {
  return {
    status: 200,
    body: {
      ...meta(date),
      // 자동완성용 제목 목록. 순서를 섞지 않아도 어떤 게 정답인지 알 수 없다.
      works: PLAY_WORKS.map((work) => ({ title: work.title })),
    },
  };
}

function handlePost(input: ApiRequestInput, options: PlayOptions): ApiResult {
  const parsed = guessSchema.safeParse(input.body);
  if (!parsed.success) {
    return { status: 400, body: { error: parsed.error.issues } };
  }

  const date = resolveDate(parsed.data.date, options);
  const answer = answerForDate(date);
  const work = findWork(parsed.data.guess);

  if (!work) {
    // 시도로 치지 않는다 — 목록에 없는 입력일 뿐.
    return {
      status: 200,
      body: { found: false, message: '목록에 없는 작품이에요. 자동완성에서 골라 주세요.' },
    };
  }

  const score = scoreGuess(work, answer);
  const attempt = parsed.data.attempt ?? 1;
  const reveal = score.correct || attempt >= MAX_GUESSES;

  return {
    status: 200,
    body: {
      found: true,
      guess: { id: work.id, title: work.title },
      result: score,
      ...(reveal ? { answer: { id: answer.id, title: answer.title } } : {}),
    },
  };
}

export async function handlePlay(input: ApiRequestInput, options: PlayOptions = {}): Promise<ApiResult> {
  const method = input.method.toUpperCase();

  if (method === 'GET') {
    const url = new URL(input.url, 'http://localhost');
    const requested = url.searchParams.get('date') ?? undefined;
    const date = resolveDate(/^\d{4}-\d{2}-\d{2}$/.test(requested ?? '') ? requested : undefined, options);
    return handleGet(date);
  }

  if (method === 'POST') {
    return handlePost(input, options);
  }

  return { status: 405, body: { error: 'method not allowed' } };
}
