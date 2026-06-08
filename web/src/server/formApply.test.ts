import { describe, expect, it, vi } from 'vitest';
import { handleFormApply, type FormApplyPayload } from './formApply';
import type { ApiRequestInput } from './apiCore';

const FIXED = new Date('2026-06-08T00:00:00.000Z');

function input(body: unknown): ApiRequestInput {
  return { method: 'POST', url: '/api/form', body };
}

const validBody = {
  nickname: '지민',
  contact: '@jimin_act',
  career: '입시생',
  q1: true,
  q2: true,
  slot: '평일 저녁',
  channel: '인스타',
};

describe('handleFormApply', () => {
  it('유효 입력을 webhook으로 보내고 200 ok 를 반환한다', async () => {
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
      nickname: '지민',
      contact: '@jimin_act',
      career: '입시생',
      q1: 'Y',
      q2: 'Y',
      slot: '평일 저녁',
      channel: '인스타',
    });
  });

  it('필수값이 빠지면 400 을 반환하고 전송하지 않는다', async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormApply(input({ ...validBody, nickname: '' }), {
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
