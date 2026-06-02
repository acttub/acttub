'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Share2, ArrowRight, Loader2, RotateCcw } from 'lucide-react';
import PrimaryButton from '../components/PrimaryButton';

type Fortune = {
  oneLiner: string;
  emotion: string;
  condition: { stars: number; comment: string };
  line: string;
  mission: string;
};

export default function FortunePage() {
  const [birth, setBirth] = useState('');
  const [role, setRole] = useState('');
  const [work, setWork] = useState('');
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const now = new Date();
  const dateLabel = `${now.getMonth() + 1}/${now.getDate()}`;

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
    const text = `🎭 오늘의 연기 운세\n${work} · ${role}\n${fortune.oneLiner}\n오늘의 명대사: "${fortune.line}"\n\nacttub.com/fortune`;
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

  const stars = fortune
    ? '★'.repeat(fortune.condition.stars) + '☆'.repeat(Math.max(0, 5 - fortune.condition.stars))
    : '';

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
            <div className="fortune__card-date">🎭 오늘의 연기 운세 · {dateLabel}</div>
            <div className="fortune__card-meta">{work} · {role}</div>
            <p className="fortune__oneliner">{fortune.oneLiner}</p>

            <div className="fortune__row">
              <span>오늘의 감정</span>
              <strong>{fortune.emotion}</strong>
            </div>
            <div className="fortune__row">
              <span>연기 컨디션</span>
              <span className="fortune__stars" aria-label={`${fortune.condition.stars}점`}>{stars}</span>
            </div>
            {fortune.condition.comment ? <p className="fortune__cond">{fortune.condition.comment}</p> : null}

            <blockquote className="fortune__line">{fortune.line}</blockquote>

            <div className="fortune__mission">
              <span>오늘의 미션</span>
              <p>{fortune.mission}</p>
            </div>
          </article>

          <div className="fortune__actions">
            <PrimaryButton variant="weak" onClick={shareResult}>
              <Share2 size={18} />
              공유
            </PrimaryButton>
            <PrimaryButton as="a" href="/coach?utm_source=fortune&utm_medium=cta">
              AI한테 확인받기
              <ArrowRight size={18} />
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
