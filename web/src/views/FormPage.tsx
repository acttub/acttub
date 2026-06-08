'use client';

/**
 * FormPage — 알파 테스터 신청 폼(acttub.com/form).
 *
 * SOMA-70 모집 깔때기의 끝단. 한 화면에 7문항, 제출 시 /api/form 으로 POST →
 * 구글시트 적재. 성공하면 완료 화면으로 교체한다. 게임/저장 로직 없음.
 * 톤은 acttub.com 루트(Toss풍 연회색 배경 + 흰 카드 + 코랄 액센트)에 맞춘다.
 * CSS는 src/app/globals.css 의 @import 로 로드한다(views 컨벤션).
 */

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

const CAREERS = ['입시생', '현역·세미프로', '취미·입문'] as const;
const CHANNELS = ['DM', '필름메이커스', '오픈카톡', '인스타'] as const;

type Career = (typeof CAREERS)[number];
type Channel = (typeof CHANNELS)[number];

export default function FormPage() {
  const [nickname, setNickname] = useState('');
  const [contact, setContact] = useState('');
  const [career, setCareer] = useState<Career | ''>('');
  const [q1, setQ1] = useState<boolean | null>(null);
  const [q2, setQ2] = useState<boolean | null>(null);
  const [slot, setSlot] = useState('');
  const [channel, setChannel] = useState<Channel | ''>('');
  const [website, setWebsite] = useState(''); // honeypot

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const ready =
    nickname.trim().length > 0 &&
    contact.trim().length > 0 &&
    career !== '' &&
    q1 !== null &&
    q2 !== null &&
    channel !== '';

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
          nickname: nickname.trim(),
          contact: contact.trim(),
          career,
          q1,
          q2,
          slot: slot.trim(),
          channel,
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
            알파 테스터로 신청해주셔서 고마워요. 적어주신 연락처로 곧 안내드릴게요.
          </p>
          <p className="form__note">
            연기 영상 1개 + 10~15분 인터뷰 후, 커피 기프티콘을 보내드립니다.
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
            짚어주는 AI 연기 피드백을 함께 테스트해요. 영상 1개 + 10~15분 인터뷰,
            커피 기프티콘을 드립니다. <strong>(오디션 아님 · 앱 테스트)</strong>
          </p>
        </div>

        <label className="form__field">
          <span className="form__label">닉네임 (공개용)</span>
          <input
            className="form__input"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={40}
            required
          />
        </label>

        <label className="form__field">
          <span className="form__label">연락 수단 (카톡 ID 또는 인스타 핸들)</span>
          <input
            className="form__input"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            maxLength={120}
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
          <legend className="form__label">
            피드백을 받고 다음 날 같은 장면을 다시 연습할 의향이 있나요?
          </legend>
          <div className="form__choices">
            <button
              type="button"
              className={['form__chip', q2 === true && 'form__chip--on'].filter(Boolean).join(' ')}
              aria-pressed={q2 === true}
              onClick={() => setQ2(true)}
            >
              예
            </button>
            <button
              type="button"
              className={['form__chip', q2 === false && 'form__chip--on'].filter(Boolean).join(' ')}
              aria-pressed={q2 === false}
              onClick={() => setQ2(false)}
            >
              아니오
            </button>
          </div>
        </fieldset>

        <label className="form__field">
          <span className="form__label">인터뷰 가능 시간대 (선택)</span>
          <input
            className="form__input"
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            placeholder="예: 평일 저녁, 주말 오후"
            maxLength={200}
          />
        </label>

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
        <p className="form__privacy">제출하면 연락처는 테스트 안내 용도로만 쓰여요.</p>
      </form>
    </main>
  );
}
