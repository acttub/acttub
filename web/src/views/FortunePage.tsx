'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Share2, Loader2, RotateCcw } from 'lucide-react';
import PrimaryButton from '../components/PrimaryButton';

type FortuneAspect = { stars: number; comment: string };

type Fortune = {
  overall: { stars: number; summary: string };
  aspects: {
    emotion: FortuneAspect;
    delivery: FortuneAspect;
    focus: FortuneAspect;
    rapport: FortuneAspect;
  };
  lucky: { emotion: string; warmup: string; mood: string };
  line: { quote: string; note: string };
  mission: string;
  caution: string;
};

const ASPECTS: { key: keyof Fortune['aspects']; emoji: string; label: string }[] = [
  { key: 'emotion', emoji: '😤', label: '감정 연기운' },
  { key: 'delivery', emoji: '🗣️', label: '대사·발성운' },
  { key: 'focus', emoji: '🎬', label: '현장·집중운' },
  { key: 'rapport', emoji: '🤝', label: '호흡·관계운' },
];

function stars(count: number): string {
  return '★'.repeat(count) + '☆'.repeat(Math.max(0, 5 - count));
}

export default function FortunePage() {
  const [birth, setBirth] = useState('');
  const [role, setRole] = useState('');
  const [work, setWork] = useState('');
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function seeFortune() {
    if (!birth || !role.trim() || !work.trim()) {
      setError('생일·배역·작품을 모두 입력해 주세요.');
      return;
    }
    setLoading(true);
    setError('');
    setFortune(null);
    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ birth, role: role.trim(), work: work.trim() }),
      });
      const payload = (await response.json()) as { fortune?: Fortune; error?: unknown };
      if (!response.ok || !payload.fortune) {
        throw new Error(typeof payload.error === 'string' ? payload.error : '운세를 불러오지 못했습니다.');
      }
      setFortune(payload.fortune);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '운세를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function shareResult() {
    if (!fortune) return;
    const text = `🎭 오늘의 연기 운세 — ${work} · ${role}\n${fortune.overall.summary}\n오늘의 명대사: "${fortune.line.quote}"\n\nacttub.com/fortune`;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: '오늘의 연기 운세', text });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        window.alert('결과를 복사했어요!');
      }
    } catch {
      // 사용자가 공유를 취소한 경우 등 — 무시
    }
  }

  return (
    <div className="fortune container">
      <header className="fortune__header">
        <Link href="/" className="fortune__brand" aria-label="acttub 홈">
          act<span>tub</span>
        </Link>
        <span className="fortune__badge">fortune</span>
      </header>

      {!fortune ? (
        <section className="fortune__intro">
          <h1 className="fortune__title">오늘의 연기 운세</h1>
          <p className="fortune__sub">생일·배역·작품을 넣으면 오늘의 연기 운세를 봐드려요. 30초면 끝!</p>

          <div className="fortune__form">
            <label className="fortune__field">
              <span className="fortune__label">생일</span>
              <input
                className="fortune__input"
                type="date"
                value={birth}
                onChange={(event) => setBirth(event.target.value)}
              />
            </label>
            <label className="fortune__field">
              <span className="fortune__label">배역</span>
              <input
                className="fortune__input"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="예: 햄릿"
                maxLength={100}
              />
            </label>
            <label className="fortune__field">
              <span className="fortune__label">작품</span>
              <input
                className="fortune__input"
                value={work}
                onChange={(event) => setWork(event.target.value)}
                placeholder="예: 〈햄릿〉"
                maxLength={100}
              />
            </label>

            {error ? <p className="fortune__error">{error}</p> : null}

            <PrimaryButton onClick={seeFortune} disabled={loading} size="xl">
              {loading ? <Loader2 size={18} className="fortune__spin" /> : <Sparkles size={18} />}
              {loading ? '운세 보는 중' : '오늘의 운세 보기'}
            </PrimaryButton>
          </div>
        </section>
      ) : (
        <section className="fortune__result">
          <article className="fortune__card">
            <div className="fortune__card-head">
              <span className="fortune__card-date">🎭 오늘의 연기 운세</span>
              <span className="fortune__card-meta">{work} · {role}</span>
            </div>

            <div className="fortune__overall">
              <div className="fortune__overall-top">
                <span className="fortune__overall-label">오늘의 총운</span>
                <span
                  className="fortune__stars fortune__stars--lg"
                  aria-label={`${fortune.overall.stars}점`}
                >
                  {stars(fortune.overall.stars)}
                </span>
              </div>
              <p className="fortune__summary">{fortune.overall.summary}</p>
            </div>

            <div className="fortune__section">
              <h2 className="fortune__section-title">세부 운세</h2>
              <ul className="fortune__aspects">
                {ASPECTS.map(({ key, emoji, label }) => {
                  const aspect = fortune.aspects[key];
                  return (
                    <li key={key} className="fortune__aspect">
                      <div className="fortune__aspect-head">
                        <span className="fortune__aspect-name">
                          <span aria-hidden>{emoji}</span> {label}
                        </span>
                        <span
                          className="fortune__stars fortune__stars--sm"
                          aria-label={`${aspect.stars}점`}
                        >
                          {stars(aspect.stars)}
                        </span>
                      </div>
                      {aspect.comment ? (
                        <p className="fortune__aspect-comment">{aspect.comment}</p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="fortune__section">
              <h2 className="fortune__section-title">오늘의 행운</h2>
              <dl className="fortune__lucky">
                {fortune.lucky.emotion ? (
                  <div className="fortune__lucky-row">
                    <dt>행운의 감정</dt>
                    <dd>{fortune.lucky.emotion}</dd>
                  </div>
                ) : null}
                {fortune.lucky.warmup ? (
                  <div className="fortune__lucky-row">
                    <dt>행운의 워밍업</dt>
                    <dd>{fortune.lucky.warmup}</dd>
                  </div>
                ) : null}
                {fortune.lucky.mood ? (
                  <div className="fortune__lucky-row">
                    <dt>행운의 무드</dt>
                    <dd>{fortune.lucky.mood}</dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <div className="fortune__section">
              <h2 className="fortune__section-title">오늘의 명대사</h2>
              <blockquote className="fortune__line">{fortune.line.quote}</blockquote>
              {fortune.line.note ? <p className="fortune__line-note">→ {fortune.line.note}</p> : null}
            </div>

            <div className="fortune__mission">
              <span>🎯 오늘의 미션</span>
              <p>{fortune.mission}</p>
            </div>

            {fortune.caution ? (
              <p className="fortune__caution">⚠️ {fortune.caution}</p>
            ) : null}
          </article>

          <div className="fortune__actions">
            <PrimaryButton onClick={shareResult}>
              <Share2 size={18} />
              결과 공유하기
            </PrimaryButton>
          </div>

          <button type="button" className="fortune__retry" onClick={() => setFortune(null)}>
            <RotateCcw size={14} />
            다시 보기
          </button>
        </section>
      )}
    </div>
  );
}
