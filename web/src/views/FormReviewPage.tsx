'use client';

/**
 * FormReviewPage — 알파 테스트 사용 후 리뷰 폼(acttub.com/form/review).
 *
 * 검증 신호의 정본. 멘토 피드백(폼이 너무 길다)으로 핵심 5문항으로 축소:
 * 만족도·실행 가능성·재사용 의향 + 한 줄 리뷰. 1분 안에 끝나는 게 목표.
 * 정확성·고민 적중·최고 도움 부분·톤·기존 대비는 인터뷰에서 묻는다.
 * 전화번호로 신청과 매칭해 쿠폰을 발송한다.
 * 제출 시 /api/form/review 로 POST → 구글시트 적재(kind='tester-review').
 * 스타일은 FormPage.css 의 .form* 클래스를 그대로 재사용한다.
 */

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

const RATINGS = [1, 2, 3, 4, 5] as const;

/** 쿠폰 어뷰징 1차 필터: 서술형 최소 길이(서버 zod와 동일). */
const GOOD_MIN = 30;

/** 서버(zod phoneSchema)와 같은 기준 — 숫자만 남겨 01로 시작하는 10~11자리. */
function isPhone(value: string): boolean {
  return /^01\d{8,9}$/.test(value.replace(/\D/g, ''));
}

function chipClass(on: boolean): string {
  return ['form__chip', on && 'form__chip--on'].filter(Boolean).join(' ');
}

export default function FormReviewPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [actionable, setActionable] = useState<number | null>(null);
  const [reuse, setReuse] = useState<boolean | null>(null);
  const [good, setGood] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const ready =
    name.trim().length > 0 &&
    isPhone(phone) &&
    rating !== null &&
    actionable !== null &&
    reuse !== null &&
    good.trim().length >= GOOD_MIN &&
    consent;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ready || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/form/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          rating,
          actionable,
          reuse,
          good: good.trim(),
          consent,
          website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (res.ok && data.ok) {
        setDone(true);
      } else {
        setError(data.error ?? '리뷰를 접수하지 못했어요. 잠시 후 다시 시도해 주세요.');
      }
    } catch {
      setError('네트워크 오류로 접수하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="form form--done container">
        <header className="form__topbar">
          <Link href="/" className="form__brand" aria-label="acttub 홈">
            act<span>tub</span>
          </Link>
          <span className="form__badge">리뷰</span>
        </header>

        <section className="form__card form__card--done">
          <div className="form__done-mark" aria-hidden="true">☕</div>
          <h1 className="form__title">리뷰 접수 완료!</h1>
          <p className="form__lead">
            소중한 리뷰 고마워요. 확인 후 적어주신 번호로 커피 기프티콘을 순차적으로 보내드릴게요.
          </p>
          <Link href="/" className="form__home">
            acttub 둘러보기
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="form container">
      <header className="form__topbar">
        <Link href="/" className="form__brand" aria-label="acttub 홈">
          act<span>tub</span>
        </Link>
        <span className="form__badge">리뷰</span>
      </header>

      <form className="form__card" onSubmit={handleSubmit}>
        <div className="form__intro">
          <span className="form__kicker">AI 연기 피드백 · 알파 테스트</span>
          <h1 className="form__title">사용 후 리뷰</h1>
          <p className="form__lead">
            딱 네 가지만 여쭤볼게요. 1분이면 충분해요.
            성의 있게 남겨주시면 확인 후 적어주신 번호로 <strong>커피 기프티콘</strong>을 보내드려요.
          </p>
        </div>

        <label className="form__field">
          <span className="form__label">성함</span>
          <input
            className="form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            autoComplete="name"
            required
          />
        </label>

        <label className="form__field">
          <span className="form__label">전화번호 (쿠폰 받으실 번호)</span>
          <input
            className="form__input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            maxLength={20}
            autoComplete="tel"
            required
          />
        </label>

        <fieldset className="form__field">
          <legend className="form__label">전체 만족도 (1 아쉬움 ~ 5 최고)</legend>
          <div className="form__choices">
            {RATINGS.map((r) => (
              <button
                type="button"
                key={r}
                className={chipClass(rating === r)}
                aria-pressed={rating === r}
                onClick={() => setRating(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="form__field">
          <legend className="form__label">
            연기 성장에 도움이 될 것 같다 느꼈나요? (1 전혀 ~ 5 매우)
          </legend>
          <div className="form__choices">
            {RATINGS.map((r) => (
              <button
                type="button"
                key={r}
                className={chipClass(actionable === r)}
                aria-pressed={actionable === r}
                onClick={() => setActionable(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="form__field">
          <legend className="form__label">다음 연습 때도 다시 쓸 의향이 있나요?</legend>
          <div className="form__choices">
            <button
              type="button"
              className={chipClass(reuse === true)}
              aria-pressed={reuse === true}
              onClick={() => setReuse(true)}
            >
              예
            </button>
            <button
              type="button"
              className={chipClass(reuse === false)}
              aria-pressed={reuse === false}
              onClick={() => setReuse(false)}
            >
              아니오
            </button>
          </div>
        </fieldset>

        <label className="form__field">
          <span className="form__label">
            한 줄 리뷰 — 좋았던 점, 아쉬웠던 점 무엇이든 좋아요 (최소 {GOOD_MIN}자)
          </span>
          <textarea
            className="form__input form__input--area"
            value={good}
            onChange={(e) => setGood(e.target.value)}
            placeholder="예: 고칠 점을 하나만 딱 짚어줘서 좋았어요. 대사 타이밍도 봐주면 좋겠어요"
            maxLength={1000}
            rows={3}
            required
          />
          <span className="form__hint" aria-live="polite">
            {good.trim().length < GOOD_MIN
              ? `${GOOD_MIN - good.trim().length}자 더 — 어떤 점이 좋았는지/아쉬웠는지 한 가지만 적어주면 충분해요`
              : '좋아요, 충분해요 ☕'}
          </span>
        </label>

        <label className="form__consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
          <span>
            <strong>개인정보 수집·이용 동의 (필수)</strong> — 성함·전화번호는 신청 확인과
            쿠폰 발송에만 사용하고, 지급 완료 후 파기합니다.
          </span>
        </label>

        {/* honeypot: 사람 눈에 안 보이는 봇 트랩 */}
        <input
          className="form__hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        {error ? (
          <p className="form__error" role="alert">
            {error}
          </p>
        ) : null}

        <button className="form__submit" type="submit" disabled={!ready || submitting}>
          {submitting ? '접수 중…' : '리뷰 보내기'}
        </button>
      </form>
    </main>
  );
}
