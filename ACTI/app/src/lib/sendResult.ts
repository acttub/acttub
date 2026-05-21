/**
 * 결과 메일 발송 요청 — 서버리스 함수 호출 래퍼.
 */

import type { TypeCode } from '../content/schema';
import { BASE_PATH } from './share';

export type SendResultRequest = {
  email: string;
  code: TypeCode;
  consent: true;
};

/**
 * @throws Error (서버 4xx/5xx 또는 네트워크 실패 시)
 */
export async function sendResultEmail(payload: SendResultRequest): Promise<void> {
  const res = await fetch(`${BASE_PATH}/api/send-result`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // honeypot: 빈 값이어야 함 (봇 차단용)
    body: JSON.stringify({ ...payload, website: '' }),
  });

  if (!res.ok) {
    let message = `요청 실패 (${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }
}
