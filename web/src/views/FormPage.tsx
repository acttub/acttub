'use client';

/**
 * FormPage — 알파 테스터 신청 폼(acttub.com/form).
 *
 * SOMA-70 모집 깔때기의 끝단. 모델: 한 번 사용 + 리뷰(/form/review) 작성 → 쿠폰.
 * 한 화면에 7문항 + 개인정보 동의, 제출 시 /api/form 으로 POST → 구글시트 적재.
 * 성공하면 완료 화면으로 교체한다. 게임/저장 로직 없음.
 * 톤은 acttub.com 루트(Toss풍 연회색 배경 + 흰 카드 + 코랄 액센트)에 맞춘다.
 * CSS는 src/app/globals.css 의 @import 로 로드한다(views 컨벤션).
 */

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

const CAREERS = ['입시생', '현역·세미프로', '취미·입문'] as const;
const FEEDBACK_SOURCES = [
  '학원 선생님',
  '학교·교수',
  '스터디·동료',
  '셀프 모니터링',
  '거의 못 받음',
] as const;
const CONCERNS = ['감정 표현', '대사·발성', '표정', '움직임·동선', '기타'] as const;
const CHANNELS = ['DM', '필름메이커스', '오픈카톡', '인스타'] as const;

type Career = (typeof CAREERS)[number];
type FeedbackSource = (typeof FEEDBACK_SOURCES)[number];
type Concern = (typeof CONCERNS)[number];
type Channel = (typeof CHANNELS)[number];

/** 서버(zod phoneSchema)와 같은 기준 — 숫자만 남겨 01로 시작하는 10~11자리. */
function isPhone(value: string): boolean {
  return /^01\d{8,9}$/.test(value.replace(/\D/g, ''));
}

export default function FormPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [career, setCareer] = useState<Career | ''>('');
  const [feedbackSource, setFeedbackSource] = useState<FeedbackSource | ''>('');
  const [concern, setConcern] = useState<Concern | ''>('');
  const [q1, setQ1] = useState<boolean | null>(null);
  const [channel, setChannel] = useState<Channel | ''>('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const ready =
    name.trim().length > 0 &&
    isPhone(phone) &&
    career !== '' &&
    feedbackSource !== '' &&
    concern !== '' &&
    q1 !== null &&
    channel !== '' &&
    consent;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ready || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          career,
          feedbackSource,
          concern,
          q1,
          channel,
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
        setError(data.error ?? '신청을 접수하지 못했어요. 잠시 후 다시 시도해 주세요.');
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
          <span className="form__badge">알파 테스터</span>
        </header>

        <section className="form__card form__card--done">
          <div className="form__done-mark" aria-hidden="true">🎭</div>
          <h1 className="form__title">신청 완료!</h1>
          <p className="form__lead">
            알파 테스터로 신청해주셔서 고마워요. 적어주신 번호로 곧 안내드릴게요.
          </p>
          <p className="form__note">
            피드백을 한 번 사용해보고 리뷰를 남겨주시면, 커피 기프티콘을 보내드립니다.
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
        <span className="form__badge">알파 테스터</span>
      </header>

      <form className="form__card" onSubmit={handleSubmit}>
        <div className="form__intro">
          <span className="form__kicker">AI 연기 피드백 · 알파 테스트</span>
          <h1 className="form__title">알파 테스터 신청</h1>
          <p className="form__lead">
            연기 영상 1개를 올리면 「잘된 점 + 딱 하나 고칠 점 + 다음 한 걸음」을 카드로
            짚어주는 AI 연기 피드백을 테스트해요. 한 번 사용하고 짧은 리뷰를 남겨주시면
            커피 기프티콘을 드립니다. <strong>(오디션 아님 · 앱 테스트)</strong>
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
          <legend className="form__label">연기 경력</legend>
          <div className="form__choices">
            {CAREERS.map((c) => (
              <button
                type="button"
                key={c}
                className={['form__chip', career === c && 'form__chip--on'].filter(Boolean).join(' ')}
                aria-pressed={career === c}
                onClick={() => setCareer(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="form__field">
          <legend className="form__label">지금 연기 피드백은 주로 어디서 받나요?</legend>
          <div className="form__choices">
            {FEEDBACK_SOURCES.map((s) => (
              <button
                type="button"
                key={s}
                className={['form__chip', feedbackSource === s && 'form__chip--on']
                  .filter(Boolean)
                  .join(' ')}
                aria-pressed={feedbackSource === s}
                onClick={() => setFeedbackSource(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="form__field">
          <legend className="form__label">연기에서 가장 고민인 부분 하나를 골라주세요</legend>
          <div className="form__choices">
            {CONCERNS.map((c) => (
              <button
                type="button"
                key={c}
                className={['form__chip', concern === c && 'form__chip--on'].filter(Boolean).join(' ')}
                aria-pressed={concern === c}
                onClick={() => setConcern(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="form__field">
          <legend className="form__label">
            최근 1주 안에 연기 영상 1개를 찍어 올릴 수 있나요?
          </legend>
          <div className="form__choices">
            <button
              type="button"
              className={['form__chip', q1 === true && 'form__chip--on'].filter(Boolean).join(' ')}
              aria-pressed={q1 === true}
              onClick={() => setQ1(true)}
            >
              예
            </button>
            <button
              type="button"
              className={['form__chip', q1 === false && 'form__chip--on'].filter(Boolean).join(' ')}
              aria-pressed={q1 === false}
              onClick={() => setQ1(false)}
            >
              아니오
            </button>
          </div>
        </fieldset>

        <fieldset className="form__field">
          <legend className="form__label">어떤 경로로 오셨나요?</legend>
          <div className="form__choices">
            {CHANNELS.map((c) => (
              <button
                type="button"
                key={c}
                className={['form__chip', channel === c && 'form__chip--on'].filter(Boolean).join(' ')}
                aria-pressed={channel === c}
                onClick={() => setChannel(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="form__consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
          <span>
            <strong>개인정보 수집·이용 동의 (필수)</strong> — 성함·전화번호는 테스트 안내와
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
          {submitting ? '접수 중…' : '신청하기'}
        </button>
      </form>
    </main>
  );
}
