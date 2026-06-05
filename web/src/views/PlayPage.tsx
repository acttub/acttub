'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Send, Share2, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import PrimaryButton from '../components/PrimaryButton';

type AttrState = 'hit' | 'near' | 'miss';
type GridCell = { key: string; label: string; state: AttrState; value: string };
type Guess = { title: string; correct: boolean; proximity: number; grid: GridCell[] };

type Meta = {
  date: string;
  puzzleNumber: number;
  maxGuesses: number;
  attributes: { key: string; label: string }[];
  works: { title: string }[];
};

type Answer = { title: string };

type PostBody = {
  found: boolean;
  message?: string;
  guess?: { title: string };
  result?: { correct: boolean; proximity: number; grid: GridCell[] };
  answer?: Answer;
};

const STATE_EMOJI: Record<AttrState, string> = { hit: '🟩', near: '🟨', miss: '⬜' };

function gridLine(grid: GridCell[]): string {
  return grid.map((cell) => STATE_EMOJI[cell.state]).join('');
}

export default function PlayPage() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await fetch('/api/play');
        const payload = (await response.json()) as Meta;
        if (active) setMeta(payload);
      } catch {
        if (active) setError('오늘의 퍼즐을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const isWin = guesses.some((g) => g.correct);
  const done = answer !== null;
  const remaining = meta ? meta.maxGuesses - guesses.length : 0;

  async function submitGuess() {
    if (!meta || done || loading) return;
    const title = input.trim();
    if (!title) {
      setError('작품 제목을 입력해 주세요.');
      return;
    }
    if (guesses.some((g) => g.title === title)) {
      setError('이미 추측한 작품이에요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/play', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ guess: title, date: meta.date, attempt: guesses.length + 1 }),
      });
      const payload = (await response.json()) as PostBody;
      if (!response.ok || !payload.found || !payload.result || !payload.guess) {
        setError(payload.message ?? '목록에 없는 작품이에요. 자동완성에서 골라 주세요.');
        return;
      }
      setGuesses((prev) => [
        ...prev,
        {
          title: payload.guess!.title,
          correct: payload.result!.correct,
          proximity: payload.result!.proximity,
          grid: payload.result!.grid,
        },
      ]);
      setInput('');
      if (payload.answer) setAnswer(payload.answer);
    } catch {
      setError('채점에 실패했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  }

  async function shareResult() {
    if (!meta || !done) return;
    const head = `🎭 오늘의 연극 #${meta.puzzleNumber} ${isWin ? `${guesses.length}/${meta.maxGuesses}` : `X/${meta.maxGuesses}`}`;
    const body = guesses.map((g) => gridLine(g.grid)).join('\n');
    const text = `${head}\n${body}\nacttub.com/play`;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: '오늘의 연극 맞추기', text });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        window.alert('결과를 복사했어요!');
      }
    } catch {
      // 공유 취소 등 — 무시
    }
  }

  return (
    <div className="play container">
      <header className="play__header">
        <Link href="/" className="play__brand" aria-label="acttub 홈">
          act<span>tub</span>
        </Link>
        <span className="play__badge">play</span>
      </header>

      <section className="play__intro">
        <h1 className="play__title">오늘의 연극 맞추기</h1>
        <p className="play__sub">
          {meta ? `#${meta.puzzleNumber} · ${meta.date}` : '오늘의 퍼즐 불러오는 중…'}
        </p>
        <p className="play__rule">작품을 추측하면 정답과의 근접도와 속성 일치를 알려줘요. {meta?.maxGuesses ?? 6}번 안에 맞혀보세요.</p>
      </section>

      {/* 추측 히스토리 */}
      {guesses.length > 0 ? (
        <ul className="play__guesses">
          {guesses.map((guess, index) => (
            <li key={`${guess.title}-${index}`} className="play__guess">
              <div className="play__guess-head">
                <span className="play__guess-title">{guess.title}</span>
                <span className={`play__proximity${guess.correct ? ' play__proximity--win' : ''}`}>
                  {guess.correct ? '정답!' : `근접도 ${guess.proximity}%`}
                </span>
              </div>
              <div className="play__grid">
                {guess.grid.map((cell) => (
                  <span key={cell.key} className={`play__cell play__cell--${cell.state}`}>
                    <span className="play__cell-label">{cell.label}</span>
                    <span className="play__cell-value">{cell.value}</span>
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {/* 입력 또는 결과 */}
      {!done ? (
        <section className="play__form">
          <input
            className="play__input"
            list="play-works"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitGuess();
            }}
            placeholder="작품 제목을 입력하세요"
            maxLength={100}
            disabled={!meta || loading}
          />
          <datalist id="play-works">
            {meta?.works.map((work) => <option key={work.title} value={work.title} />)}
          </datalist>

          {error ? <p className="play__error">{error}</p> : null}

          <div className="play__form-foot">
            <span className="play__remaining">남은 기회 {remaining}</span>
            <PrimaryButton onClick={submitGuess} disabled={!meta || loading} fullWidth={false}>
              {loading ? <Loader2 size={18} className="play__spin" /> : <Send size={18} />}
              추측
            </PrimaryButton>
          </div>
        </section>
      ) : (
        <section className="play__result">
          <article className={`play__answer${isWin ? ' play__answer--win' : ''}`}>
            <span className="play__answer-label">
              {isWin ? `🎉 ${guesses.length}번 만에 정답!` : '아쉽! 오늘의 정답은'}
            </span>
            <h2 className="play__answer-title">{answer.title}</h2>
          </article>

          <div className="play__bridge">
            <p className="play__bridge-copy">
              「{answer.title}」의 한 장면, 연기해보고 AI한테 점수받아 볼까요?
            </p>
            <PrimaryButton as="a" href="/coach">
              <Sparkles size={18} />
              내 연기 AI 점수받기
            </PrimaryButton>
          </div>

          <div className="play__actions">
            <PrimaryButton onClick={shareResult} variant="weak">
              <Share2 size={18} />
              결과 공유하기
            </PrimaryButton>
          </div>

          <p className="play__tomorrow">
            <RotateCcw size={14} />
            내일 또 새로운 연극이 찾아와요.
          </p>
        </section>
      )}
    </div>
  );
}
