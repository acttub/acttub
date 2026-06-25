'use client';

/**
 * WaitlistPage — 비공개 테스터 사전 등록(acttub.com/waitlist).
 *
 * 정식 오픈 전 인스타 프로필 링크로 쓰는 단일 화면 랜딩 + 수집 폼. 이메일(필수) +
 * 선택 2문항(현재 상황·도움받고 싶은 부분) + 개인정보 동의를 받아 /api/waitlist 로
 * POST → 구글시트 적재. 성공하면 완료 화면으로 교체한다.
 * 톤은 acttub 인스타 홍보물(웜그레이/아이보리 배경 + 오렌지 포인트 + 미니멀).
 * 인스타 인앱 브라우저(모바일) 1컬럼 기준. CSS 는 src/app/globals.css 의 @import 로 로드.
 */

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

const ACTOR_STATUSES = [
  '연기 입시 준비 중',
  '연극영화과 재학 중',
  '배우 지망생',
  '현역 배우',
  '취미로 연기 연습 중',
  '기타',
] as const;

const HELP_TOPICS = [
  '대본 분석',
  '인물의 목적 찾기',
  '이전 상황 감정 정리',
  '현재 감정선 정리',
  '서브텍스트 정리',
  '기타',
] as const;

type ActorStatus = (typeof ACTOR_STATUSES)[number];
type HelpTopic = (typeof HELP_TOPICS)[number];

/** 서버(zod .email())와 같은 눈높이의 가벼운 클라이언트 검증 — ResultEmailForm 과 동일 패턴. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Message = { text: string; kind: 'error' | 'notice' };

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [actorStatus, setActorStatus] = useState<ActorStatus | ''>('');
  const [helpTopic, setHelpTopic] = useState<HelpTopic | ''>('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const emailValid = EMAIL_RE.test(email.trim());
  const ready = emailValid && consent;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ready || submitting) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          actorStatus: actorStatus || undefined,
          helpTopic: helpTopic || undefined,
          consent,
          website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        duplicate?: boolean;
        error?: string;
      };
      if (res.ok && data.ok) {
        setDone(true);
      } else if (data.duplicate) {
        setMessage({ text: data.error ?? '이미 신청된 이메일입니다.', kind: 'notice' });
      } else {
        setMessage({
          text: data.error ?? '신청을 접수하지 못했어요. 잠시 후 다시 시도해 주세요.',
          kind: 'error',
        });
      }
    } catch {
      setMessage({
        text: '네트워크 오류로 접수하지 못했어요. 잠시 후 다시 시도해 주세요.',
        kind: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="waitlist waitlist--done container">
        <header className="waitlist__topbar">
          <Link href="/" className="waitlist__brand" aria-label="acttub 홈">
            act<span>tub</span>
          </Link>
          <span className="waitlist__badge">사전 등록</span>
        </header>

        <section className="waitlist__card waitlist__card--done">
          <div className="waitlist__done-mark" aria-hidden="true">🎭</div>
          <h1 className="waitlist__title">신청이 완료되었습니다</h1>
          <p className="waitlist__lead">테스트 오픈 시 가장 먼저 안내드릴게요.</p>
          <Link href="/" className="waitlist__home">
            acttub 둘러보기
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="waitlist container">
      <header className="waitlist__topbar">
        <Link href="/" className="waitlist__brand" aria-label="acttub 홈">
          act<span>tub</span>
        </Link>
        <span className="waitlist__badge">사전 등록</span>
      </header>

      <section className="waitlist__hero">
        <span className="waitlist__kicker">정식 오픈 전 · 비공개 테스트</span>
        <h1 className="waitlist__headline">대사 밑에 숨은 마음을, AI 질문으로 찾아보세요</h1>
        <p className="waitlist__sub">
          Acttub는 AI가 질문을 던지며 인물의 목적, 감정, 관계, 서브텍스트를 함께 정리해가는 연기
          준비 도구입니다.
        </p>
      </section>

      <form className="waitlist__card" onSubmit={handleSubmit}>
        <label className="waitlist__field">
          <span className="waitlist__label">이메일 (필수)</span>
          <input
            className="waitlist__input"
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            maxLength={255}
            autoComplete="email"
            required
          />
        </label>

        <fieldset className="waitlist__field">
          <legend className="waitlist__label">
            현재 어떤 상황이세요? <span className="waitlist__optional">(선택)</span>
          </legend>
          <div className="waitlist__choices">
            {ACTOR_STATUSES.map((s) => (
              <button
                type="button"
                key={s}
                className={['waitlist__chip', actorStatus === s && 'waitlist__chip--on']
                  .filter(Boolean)
                  .join(' ')}
                aria-pressed={actorStatus === s}
                onClick={() => setActorStatus((prev) => (prev === s ? '' : s))}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="waitlist__field">
          <legend className="waitlist__label">
            어떤 점에서 도움받고 싶으세요? <span className="waitlist__optional">(선택)</span>
          </legend>
          <div className="waitlist__choices">
            {HELP_TOPICS.map((t) => (
              <button
                type="button"
                key={t}
                className={['waitlist__chip', helpTopic === t && 'waitlist__chip--on']
                  .filter(Boolean)
                  .join(' ')}
                aria-pressed={helpTopic === t}
                onClick={() => setHelpTopic((prev) => (prev === t ? '' : t))}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="waitlist__consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
          <span>
            테스트 안내 메일 발송을 위해 이메일을 수집하며, 테스트 모집 목적 외에는 사용하지
            않습니다. <strong>(필수)</strong>
          </span>
        </label>

        {/* honeypot: 사람 눈에 안 보이는 봇 트랩 */}
        <input
          className="waitlist__hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        {message ? (
          <p
            className={`waitlist__message waitlist__message--${message.kind}`}
            role={message.kind === 'error' ? 'alert' : 'status'}
          >
            {message.text}
          </p>
        ) : null}

        <button className="waitlist__submit" type="submit" disabled={!ready || submitting}>
          {submitting ? '접수 중…' : '테스트 오픈 알림 받기'}
        </button>

        <p className="waitlist__note">
          아직 정식 오픈 전이에요. 이메일을 남겨주시면 테스트 오픈 시 가장 먼저 안내드릴게요.
        </p>
      </form>
    </main>
  );
}
