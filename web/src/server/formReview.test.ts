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
  ratingWhy: '피드백이 구체적이라 어디를 고쳐야 할지 바로 알았어요.',
  actionable: 4,
  actionableWhy: '처방이 명확해서 다음 연습에 바로 적용할 수 있을 것 같아요.',
  reuse: true,
  reuseWhy: '혼자 연습할 때 객관적인 시선이 필요해서 또 쓸 것 같아요.',
  serviceOpinion: '',
  consent: true,
};

describe('handleFormReview', () => {
  it('유효 입력을 webhook으로 보내고 200 ok 를 반환한다 (전화번호 숫자만 정규화, reuse는 Y/N)', async () => {
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
      ratingWhy: '피드백이 구체적이라 어디를 고쳐야 할지 바로 알았어요.',
      actionable: 4,
      actionableWhy: '처방이 명확해서 다음 연습에 바로 적용할 수 있을 것 같아요.',
      reuse: 'Y',
      reuseWhy: '혼자 연습할 때 객관적인 시선이 필요해서 또 쓸 것 같아요.',
      serviceOpinion: '',
      consent: 'Y',
    });
  });

  it('서비스 의견(serviceOpinion)은 선택 — 없어도 200 으로 접수한다', async () => {
    const send = vi
      .fn<(url: string, payload: FormReviewPayload) => Promise<boolean>>()
      .mockResolvedValue(true);
    const withoutOpinion: Record<string, unknown> = { ...validBody };
    delete withoutOpinion.serviceOpinion;
    const result = await handleFormReview(input(withoutOpinion), {
      webhookUrl: 'https://example.test/hook',
      send,
      now: () => FIXED,
    });

    expect(result.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][1].serviceOpinion).toBe('');
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

  it('만족도 사유(ratingWhy)가 비면 400 을 반환한다', async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormReview(input({ ...validBody, ratingWhy: '   ' }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });
    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('평가 사유가 10자 미만이면 400 을 반환한다 (쿠폰 어뷰징 1차 필터)', async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormReview(input({ ...validBody, reuseWhy: '좋아요' }), {
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
