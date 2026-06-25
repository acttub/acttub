import { describe, expect, it, vi } from 'vitest';
import { handleWaitlistSignup, type WaitlistPayload, type WaitlistSendResult } from './waitlistSignup';
import type { ApiRequestInput } from './apiCore';

const FIXED = new Date('2026-06-25T00:00:00.000Z');

function input(body: unknown): ApiRequestInput {
  return { method: 'POST', url: '/api/waitlist', body };
}

const validBody = {
  email: 'Actor@Example.com',
  actorStatus: '연기 입시 준비 중',
  helpTopic: '서브텍스트 정리',
  consent: true,
};

function okSend() {
  return vi
    .fn<(url: string, payload: WaitlistPayload) => Promise<WaitlistSendResult>>()
    .mockResolvedValue({ ok: true, duplicate: false });
}

describe('handleWaitlistSignup', () => {
  it('유효 입력을 webhook으로 보내고 200 ok 를 반환한다 (이메일은 소문자 정규화)', async () => {
    const send = okSend();

    const result = await handleWaitlistSignup(input(validBody), {
      webhookUrl: 'https://example.test/hook',
      send,
      now: () => FIXED,
    });

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith('https://example.test/hook', {
      kind: 'waitlist',
      ts: FIXED.toISOString(),
      email: 'actor@example.com',
      actorStatus: '연기 입시 준비 중',
      helpTopic: '서브텍스트 정리',
      consent: 'Y',
    });
  });

  it('선택 문항(actorStatus·helpTopic)이 없어도 빈 문자열로 채워 200 을 반환한다', async () => {
    const send = okSend();

    const result = await handleWaitlistSignup(
      input({ email: 'a@b.com', consent: true }),
      { webhookUrl: 'https://example.test/hook', send, now: () => FIXED }
    );

    expect(result.status).toBe(200);
    expect(send).toHaveBeenCalledWith('https://example.test/hook', {
      kind: 'waitlist',
      ts: FIXED.toISOString(),
      email: 'a@b.com',
      actorStatus: '',
      helpTopic: '',
      consent: 'Y',
    });
  });

  it('이메일 형식이 아니면 400 을 반환하고 전송하지 않는다', async () => {
    const send = okSend();
    const result = await handleWaitlistSignup(input({ ...validBody, email: 'not-an-email' }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('이메일이 없으면 400 을 반환한다', async () => {
    const send = okSend();
    const result = await handleWaitlistSignup(input({ consent: true }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('개인정보 동의(consent)가 없으면 400 을 반환한다', async () => {
    const send = okSend();
    const result = await handleWaitlistSignup(input({ ...validBody, consent: false }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('알 수 없는 선택지(actorStatus)는 400 으로 막는다', async () => {
    const send = okSend();
    const result = await handleWaitlistSignup(input({ ...validBody, actorStatus: '우주 비행사' }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('honeypot이 채워지면 전송 없이 조용히 200 을 반환한다', async () => {
    const send = okSend();
    const result = await handleWaitlistSignup(input({ ...validBody, website: 'http://spam' }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it('중복 이메일이면 새 행을 쌓지 않고 안내 메시지를 200 으로 반환한다', async () => {
    const send = vi
      .fn<(url: string, payload: WaitlistPayload) => Promise<WaitlistSendResult>>()
      .mockResolvedValue({ ok: true, duplicate: true });

    const result = await handleWaitlistSignup(input(validBody), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ok: false, duplicate: true, error: '이미 신청된 이메일입니다.' });
  });

  it('webhook URL 이 없으면 500 을 반환한다', async () => {
    const result = await handleWaitlistSignup(input(validBody), { webhookUrl: '' });
    expect(result.status).toBe(500);
  });

  it('시트 전송이 실패(ok:false)하면 502 를 반환한다', async () => {
    const result = await handleWaitlistSignup(input(validBody), {
      webhookUrl: 'https://example.test/hook',
      send: async () => ({ ok: false, duplicate: false }),
    });
    expect(result.status).toBe(502);
  });

  it('시트 전송이 예외를 던져도 502 로 안전하게 처리한다', async () => {
    const result = await handleWaitlistSignup(input(validBody), {
      webhookUrl: 'https://example.test/hook',
      send: async () => {
        throw new Error('network');
      },
    });
    expect(result.status).toBe(502);
  });

  it('webhook이 HTTP 200 이라도 body 가 { ok: false } 면 502 로 처리한다(데이터 유실 방지)', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ ok: false, error: 'sheet fail' }) });
    vi.stubGlobal('fetch', fetchMock);
    try {
      const result = await handleWaitlistSignup(input(validBody), {
        webhookUrl: 'https://example.test/hook',
      });
      expect(result.status).toBe(502);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('webhook 이 HTTP 200 + body { ok: true, duplicate: true } 면 중복 안내를 반환한다', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ ok: true, duplicate: true }) });
    vi.stubGlobal('fetch', fetchMock);
    try {
      const result = await handleWaitlistSignup(input(validBody), {
        webhookUrl: 'https://example.test/hook',
      });
      expect(result.status).toBe(200);
      expect(result.body).toEqual({ ok: false, duplicate: true, error: '이미 신청된 이메일입니다.' });
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
