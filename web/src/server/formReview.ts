import { z } from 'zod';
import type { ApiRequestInput, ApiResult } from './apiCore';
import { phoneSchema } from './formApply';
import { sendToSheetsWebhook } from './sheetsWebhook';

/**
 * formReview — 알파 테스트 사용 후 리뷰(acttub.com/form/review) 접수.
 *
 * 검증 신호의 정본. 세 가지 핵심 지표를 점수(1~5 또는 Y/N)로 받고, 각 점수마다
 * "왜 그렇게 느꼈는지" 한 줄 이유(최소 10자)를 함께 받는다 — 점수만으로는 못 읽는
 * '이유'가 검증의 핵심이라 정량+정성을 한 문항으로 묶는다:
 *  · rating(전체 만족도) + ratingWhy
 *  · actionable(연기 성장 도움) + actionableWhy
 *  · reuse(다시 쓸 의향) + reuseWhy
 * 마지막으로 서비스 전반 의견(serviceOpinion)은 선택(빈칸 허용)으로 받는다.
 * 정확성·고민 적중·톤·기존 대비 등 깊은 문항은 인터뷰로 이관.
 * 전화번호가 신청(tester-apply)과의 매칭 키이자 쿠폰(기프티콘) 발송 키.
 * payload kind='tester-review'로 Apps Script가 리뷰 탭에 분기 적재한다(컬럼은 v2 스키마).
 * formApply와 같은 SHEETS_WEBHOOK_URL 재사용.
 */

const score = z.number().int().min(1).max(5);

/** 평가 사유 — 쿠폰 어뷰징 1차 필터: 최소 10자(무성의 단답 차단). 최종 '괜찮은 리뷰' 판단은 수동 검수. */
const reason = z.string().trim().min(10).max(1000);

const reviewSchema = z.object({
  name: z.string().trim().min(1).max(40),
  phone: phoneSchema,
  /** 전체 만족도 1~5 */
  rating: score,
  /** 만족도를 그렇게 준 이유 */
  ratingWhy: reason,
  /** "연기 성장에 도움이 될 것 같다" 동의 정도 1~5 */
  actionable: score,
  /** 성장 도움을 그렇게 느낀 이유 */
  actionableWhy: reason,
  /** 다음 연습에도 다시 쓸 의향 */
  reuse: z.boolean(),
  /** 다시 쓸/안 쓸 이유 */
  reuseWhy: reason,
  /** 마지막 자유 의견 — 선택(빈칸 허용). */
  serviceOpinion: z.string().trim().max(1000).optional(),
  // 개인정보 수집·이용 동의 — 미동의 제출은 400.
  consent: z.literal(true),
  // honeypot — 사람은 비워둠. 봇이 채우면 조용히 무시(200)한다.
  website: z.string().max(200).optional(),
});

export type FormReviewPayload = {
  kind: 'tester-review';
  ts: string;
  name: string;
  phone: string;
  rating: number;
  ratingWhy: string;
  actionable: number;
  actionableWhy: string;
  /** 'Y' | 'N' */
  reuse: string;
  reuseWhy: string;
  serviceOpinion: string;
  /** 'Y' */
  consent: string;
};

export type FormReviewOptions = {
  webhookUrl?: string;
  /** 시트 전송기(테스트 주입용). true=성공. */
  send?: (url: string, payload: FormReviewPayload) => Promise<boolean>;
  /** 제출 시각 주입(테스트 결정성). 기본 now. */
  now?: () => Date;
};

const FAILURE = '리뷰를 접수하지 못했어요. 잠시 후 다시 시도해 주세요.';
const INVALID = '입력값을 확인해 주세요.';

export async function handleFormReview(
  input: ApiRequestInput,
  options: FormReviewOptions = {}
): Promise<ApiResult> {
  const parsed = reviewSchema.safeParse(input.body);
  if (!parsed.success) {
    return { status: 400, body: { ok: false, error: INVALID } };
  }
  const data = parsed.data;

  // 봇: honeypot이 채워졌으면 성공한 척 조용히 버린다(시트엔 안 쌓음).
  if (data.website && data.website.length > 0) {
    return { status: 200, body: { ok: true } };
  }

  const webhookUrl = options.webhookUrl ?? process.env.SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    return { status: 500, body: { ok: false, error: FAILURE } };
  }

  const now = options.now ?? (() => new Date());
  const payload: FormReviewPayload = {
    kind: 'tester-review',
    ts: now().toISOString(),
    name: data.name,
    phone: data.phone,
    rating: data.rating,
    ratingWhy: data.ratingWhy,
    actionable: data.actionable,
    actionableWhy: data.actionableWhy,
    reuse: data.reuse ? 'Y' : 'N',
    reuseWhy: data.reuseWhy,
    serviceOpinion: data.serviceOpinion ?? '',
    consent: 'Y',
  };

  const send = options.send ?? sendToSheetsWebhook;
  let ok: boolean;
  try {
    ok = await send(webhookUrl, payload);
  } catch {
    ok = false;
  }
  if (!ok) {
    return { status: 502, body: { ok: false, error: FAILURE } };
  }
  return { status: 200, body: { ok: true } };
}
