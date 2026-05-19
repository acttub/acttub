/**
 * ResultEmailForm — 결과 페이지 하단의 "이메일로 상세 결과 받기" 폼.
 *
 * 개인정보 보호법(PIPA) 동의 체크 + 이메일 입력 + honeypot.
 * 발송은 sendResultEmail() → /api/send-result.
 */

import { useId, useState, type FormEvent } from 'react';
import { Mail, Loader2, Check } from 'lucide-react';
import type { TypeCode } from '../content/schema';
import { sendResultEmail } from '../lib/sendResult';
import './ResultEmailForm.css';

type Props = {
  code: TypeCode;
  onDelivered?: () => void;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ResultEmailForm({ code, onDelivered }: Props) {
  const emailId = useId();
  const consentId = useId();

  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const emailValid = EMAIL_RE.test(email);
  // 'error' 상태에서도 재시도 허용 — 발송 실패 후 사용자가 다시 누를 수 있어야 함
  const canSubmit = emailValid && consent && (status === 'idle' || status === 'error');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('loading');
    setErrorMsg(null);
    try {
      await sendResultEmail({ email, code, consent: true });
      setStatus('success');
      try {
        onDelivered?.();
      } catch {
        // 트래킹 실패가 사용자 경험을 깨지 않도록 무시
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : '발송에 실패했어요');
    }
  };

  if (status === 'success') {
    return (
      <section className="email-form email-form--success" aria-live="polite">
        <div className="email-form__success-icon" aria-hidden="true">
          <Check size={24} strokeWidth={3} />
        </div>
        <h3 className="email-form__title">발송 완료!</h3>
        <p className="email-form__desc">
          <strong>{email}</strong> 으로 상세 결과 리포트를 보냈어요.
          <br />
          몇 분 안에 도착하지 않으면 스팸함을 확인해주세요.
        </p>
      </section>
    );
  }

  return (
    <section className="email-form">
      <h3 className="email-form__title">상세 결과를 이메일로 받기</h3>
      <p className="email-form__desc">
        유형별 깊이 있는 해설, 추천 작품, 권장 훈련법까지 한 번에 보내드려요.
      </p>

      <form className="email-form__form" onSubmit={handleSubmit} noValidate>
        <label htmlFor={emailId} className="email-form__label">
          이메일
        </label>
        <input
          id={emailId}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
          className="email-form__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          aria-invalid={email.length > 0 && !emailValid}
          required
        />

        <label htmlFor={consentId} className="email-form__consent">
          <input
            id={consentId}
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={status === 'loading'}
          />
          <span>
            <strong>(필수)</strong> 개인정보 수집·이용에 동의합니다.
            <span className="email-form__consent-detail">
              {' '}
              수집 항목: 이메일 · 목적: 상세 결과 리포트 발송 · 보관: 발송 후 30일
            </span>
          </span>
        </label>

        {status === 'error' && errorMsg && (
          <p className="email-form__error" role="alert">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          className="email-form__submit"
          disabled={!canSubmit}
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={18} className="email-form__spin" aria-hidden="true" />
              발송 중...
            </>
          ) : (
            <>
              <Mail size={18} aria-hidden="true" />
              이메일로 받기
            </>
          )}
        </button>
      </form>
    </section>
  );
}
