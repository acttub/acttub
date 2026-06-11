import { describe, expect, it, vi } from 'vitest';
import { handleFormReview, type FormReviewPayload } from './formReview';
import type { ApiRequestInput } from './apiCore';

const FIXED = new Date('2026-06-10T00:00:00.000Z');

function input(body: unknown): ApiRequestInput {
  return { method: 'POST', url: '/api/form/review', body };
}

const validBody = {
  name: '김지민',
  phone: '010 1234 5678',
  rating: 4,
  actionable: 4,
  reuse: true,
  good: '고칠 점을 하나만 짚어줘서 뭘 연습할지 분명했어요.',
  consent: true,
};

describe('handleFormReview', () => {
  it('유효 입력을 webhook으로 보내고 200 ok 를 반환한다 (전화번호는 숫자만 정규화, 축소 문항은 빈칸)', async () => {
    const send = vi
      .fn<(url: string, payload: FormReviewPayload) => Promise<boolean>>()
      .mockResolvedValue(true);

    const result = await handleFormReview(input(validBody), {
      webhookUrl: 'https://example.test/hook',
      send,
      now: () => FIXED,
    });

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith('https://example.test/hook', {
      kind: 'tester-review',
      ts: FIXED.toISOString(),
      name: '김지민',
      phone: '01012345678',
      rating: 4,
      accuracy: '',
      concernHit: '',
      bestPart: '',
      actionable: 4,
      tone: '',
      compare: '',
      reuse: 'Y',
      good: '고칠 점을 하나만 짚어줘서 뭘 연습할지 분명했어요.',
      improve: '',
      consent: 'Y',
    });
  });

  it('만족도가 1~5 범위를 벗어나면 400 을 반환한다', async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormReview(input({ ...validBody, rating: 6 }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('실행 가능성(actionable)이 범위를 벗어나면 400 을 반환한다', async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormReview(input({ ...validBody, actionable: 9 }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });
    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('한 줄 리뷰(good)가 비면 400 을 반환한다', async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormReview(input({ ...validBody, good: '  ' }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });
    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('개인정보 동의(consent)가 없으면 400 을 반환한다', async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormReview(input({ ...validBody, consent: false }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('honeypot이 채워지면 전송 없이 조용히 200 을 반환한다', async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormReview(input({ ...validBody, website: 'http://spam' }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it('webhook URL 이 없으면 500 을 반환한다', async () => {
    const result = await handleFormReview(input(validBody), { webhookUrl: '' });
    expect(result.status).toBe(500);
  });

  it('시트 전송이 실패(false)하면 502 를 반환한다', async () => {
    const result = await handleFormReview(input(validBody), {
      webhookUrl: 'https://example.test/hook',
      send: async () => false,
    });
    expect(result.status).toBe(502);
  });

  it('시트 전송이 예외를 던져도 502 로 안전하게 처리한다', async () => {
    const result = await handleFormReview(input(validBody), {
      webhookUrl: 'https://example.test/hook',
      send: async () => {
        throw new Error('network');
      },
    });
    expect(result.status).toBe(502);
  });
});
