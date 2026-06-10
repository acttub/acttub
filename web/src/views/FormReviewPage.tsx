'use client';

/**
 * FormReviewPage — 알파 테스트 사용 후 리뷰 폼(acttub.com/form/review).
 *
 * 검증 신호의 정본. 인터뷰 대신 구조화 문항으로 Gate 1(포맷·코칭 가치)을 측정한다:
 * 만족도·정확성·고민 적중·실행 가능성(코칭 가치), 최고 도움 부분·톤(카드 포맷),
 * 기존 피드백 대비·재사용 의향(대안 대비 가치), 좋았던 점·아쉬운 점(주관식).
 * 전화번호로 신청과 매칭해 쿠폰을 발송한다.
 * 제출 시 /api/form/review 로 POST → 구글시트 적재(kind='tester-review').
 * 스타일은 FormPage.css 의 .form* 클래스를 그대로 재사용한다.
 */

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

const RATINGS = [1, 2, 3, 4, 5] as const;
const CONCERN_HITS = ['예', '부분적으로', '아니오'] as const;
const BEST_PARTS = ['잘된 점', '딱 하나 고칠 점', '다음 한 걸음', '없음'] as const;
const TONES = [
  '딱 좋았다',
  '더 직설적이어도 된다',
  '더 부드러웠으면 한다',
  '기계적으로 느껴졌다',
] as const;
const COMPARES = [
  '기존 피드백보다 낫다',
  '비슷하다',
  '기존 피드백이 더 낫다',
  '비교할 기존 피드백이 없다',
] as const;

type ConcernHit = (typeof CONCERN_HITS)[number];
type BestPart = (typeof BEST_PARTS)[number];
type Tone = (typeof TONES)[number];
type Compare = (typeof COMPARES)[number];

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
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [concernHit, setConcernHit] = useState<ConcernHit | ''>('');
  const [bestPart, setBestPart] = useState<BestPart | ''>('');
  const [actionable, setActionable] = useState<number | null>(null);
  const [tone, setTone] = useState<Tone | ''>('');
  const [compare, setCompare] = useState<Compare | ''>('');
  const [reuse, setReuse] = useState<boolean | null>(null);
  const [good, setGood] = useState('');
  const [improve, setImprove] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const ready =
    name.trim().length > 0 &&
    isPhone(phone) &&
    rating !== null &&
    accuracy !== null &&
    concernHit !== '' &&
    bestPart !== '' &&
    actionable !== null &&
    tone !== '' &&
    compare !== '' &&
    reuse !== null &&
    good.trim().length > 0 &&
    improve.trim().length > 0 &&
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
          accuracy,
          concernHit,
          bestPart,
          actionable,
          tone,
          compare,
          reuse,
          good: good.trim(),
          improve: improve.trim(),
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
          <span className="form__badge">알파 테스트 리뷰</span>
        </header>

        <section className="form__card form__card--done">
          <div className="form__done-mark" aria-hidden="true">☕</div>
          <h1 className="form__title">리뷰 접수 완료!</h1>
          <p className="form__lead">
            소중한 리뷰 고마워요. 적어주신 번호로 커피 기프티콘을 보내드릴게요.
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
        <span className="form__badge">알파 테스트 리뷰</span>
      </header>

      <form className="form__card" onSubmit={handleSubmit}>
        <div className="form__intro">
          <span className="form__kicker">AI 연기 피드백 · 알파 테스트</span>
          <h1 className="form__title">사용 후 리뷰</h1>
          <p className="form__lead">
            피드백이 실제로 도움이 됐는지 솔직하게 들려주세요. 2~3분이면 충분해요.
            작성을 마치면 적어주신 번호로 <strong>커피 기프티콘</strong>을 보내드립니다.
          </p>
        </div>

        <label className="form__field">
          <span className="form__label">성함 (신청 때와 동일하게)</span>
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
            "영상 속 내 연기를 제대로 봤다"고 느꼈나요? (1 전혀 ~ 5 정확했다)
          </legend>
          <div className="form__choices">
            {RATINGS.map((r) => (
              <button
                type="button"
                key={r}
                className={chipClass(accuracy === r)}
                aria-pressed={accuracy === r}
                onClick={() => setAccuracy(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="form__field">
          <legend className="form__label">
            피드백이 본인이 고민하던 부분을 짚어줬나요?
          </legend>
          <div className="form__choices">
            {CONCERN_HITS.map((h) => (
              <button
                type="button"
                key={h}
                className={chipClass(concernHit === h)}
                aria-pressed={concernHit === h}
                onClick={() => setConcernHit(h)}
              >
                {h}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="form__field">
          <legend className="form__label">
            카드 세 부분 중 가장 도움이 된 곳은 어디였나요?
          </legend>
          <div className="form__choices">
            {BEST_PARTS.map((p) => (
              <button
                type="button"
                key={p}
                className={chipClass(bestPart === p)}
                aria-pressed={bestPart === p}
                onClick={() => setBestPart(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="form__field">
          <legend className="form__label">
            "다음 한 걸음대로 바로 연습해볼 수 있겠다"고 느꼈나요? (1 막막함 ~ 5 바로 가능)
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
          <legend className="form__label">말투·표현(톤)은 어땠나요?</legend>
          <div className="form__choices">
            {TONES.map((t) => (
              <button
                type="button"
                key={t}
                className={chipClass(tone === t)}
                aria-pressed={tone === t}
                onClick={() => setTone(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="form__field">
          <legend className="form__label">
            평소 받던 연기 피드백(학원·학교·스터디 등)과 비교하면?
          </legend>
          <div className="form__choices">
            {COMPARES.map((c) => (
              <button
                type="button"
                key={c}
                className={chipClass(compare === c)}
                aria-pressed={compare === c}
                onClick={() => setCompare(c)}
              >
                {c}
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
          <span className="form__label">가장 좋았던 점은 무엇이었나요?</span>
          <textarea
            className="form__input form__input--area"
            value={good}
            onChange={(e) => setGood(e.target.value)}
            placeholder="예: 고칠 점을 하나만 딱 짚어줘서 뭘 연습할지 분명해졌어요"
            maxLength={1000}
            rows={3}
            required
          />
        </label>

        <label className="form__field">
          <span className="form__label">
            아쉬웠던 점, 이렇게 바뀌면 좋겠다 싶은 점을 알려주세요
          </span>
          <textarea
            className="form__input form__input--area"
            value={improve}
            onChange={(e) => setImprove(e.target.value)}
            placeholder="솔직할수록 도움이 돼요. 사소한 것도 좋아요"
            maxLength={1000}
            rows={3}
            required
          />
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
