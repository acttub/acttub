import { describe, expect, it, vi } from 'vitest';
import { handleFormApply, type FormApplyPayload } from './formApply';
import type { ApiRequestInput } from './apiCore';

const FIXED = new Date('2026-06-10T00:00:00.000Z');

function input(body: unknown): ApiRequestInput {
  return { method: 'POST', url: '/api/form', body };
}

const validBody = {
  name: '김지민',
  phone: '010-1234-5678',
  career: '입시생',
  feedbackSource: '학원 선생님',
  concern: '감정 표현',
  q1: true,
  channel: '인스타',
  consent: true,
};

describe('handleFormApply', () => {
  it('유효 입력을 webhook으로 보내고 200 ok 를 반환한다 (전화번호는 숫자만 정규화)', async () => {
    const send = vi
      .fn<(url: string, payload: FormApplyPayload) => Promise<boolean>>()
      .mockResolvedValue(true);

    const result = await handleFormApply(input(validBody), {
      webhookUrl: 'https://example.test/hook',
      send,
      now: () => FIXED,
    });

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith('https://example.test/hook', {
      kind: 'tester-apply',
      ts: FIXED.toISOString(),
      name: '김지민',
      phone: '01012345678',
      career: '입시생',
      feedbackSource: '학원 선생님',
      concern: '감정 표현',
      q1: 'Y',
      channel: '인스타',
      consent: 'Y',
    });
  });

  it('필수값이 빠지면 400 을 반환하고 전송하지 않는다', async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormApply(input({ ...validBody, name: '' }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('전화번호 형식이 아니면 400 을 반환한다', async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormApply(input({ ...validBody, phone: '02-123-4567' }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('개인정보 동의(consent)가 없으면 400 을 반환한다', async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormApply(input({ ...validBody, consent: false }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('honeypot이 채워지면 전송 없이 조용히 200 을 반환한다', async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormApply(input({ ...validBody, website: 'http://spam' }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it('webhook URL 이 없으면 500 을 반환한다', async () => {
    const result = await handleFormApply(input(validBody), { webhookUrl: '' });
    expect(result.status).toBe(500);
  });

  it('시트 전송이 실패(false)하면 502 를 반환한다', async () => {
    const result = await handleFormApply(input(validBody), {
      webhookUrl: 'https://example.test/hook',
      send: async () => false,
    });
    expect(result.status).toBe(502);
  });

  it('시트 전송이 예외를 던져도 502 로 안전하게 처리한다', async () => {
    const result = await handleFormApply(input(validBody), {
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
      const result = await handleFormApply(input(validBody), {
        webhookUrl: 'https://example.test/hook',
      });
      expect(result.status).toBe(502);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('webhook 이 HTTP 200 + body { ok: true } 면 200 으로 처리한다', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal('fetch', fetchMock);
    try {
      const result = await handleFormApply(input(validBody), {
        webhookUrl: 'https://example.test/hook',
      });
      expect(result.status).toBe(200);
      expect(result.body).toEqual({ ok: true });
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
