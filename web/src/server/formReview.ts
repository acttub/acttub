import { z } from 'zod';
import type { ApiRequestInput, ApiResult } from './apiCore';
import { phoneSchema } from './formApply';
import { sendToSheetsWebhook } from './sheetsWebhook';

/**
 * formReview — 알파 테스트 사용 후 리뷰(acttub.com/form/review) 접수.
 *
 * 검증 신호의 정본: 인터뷰 없이 구조화 문항으로 Gate 1(포맷·코칭 가치)을 측정한다.
 * 만족도·정확성·고민 적중·실행 가능성은 코칭 가치를, 카드 최고 도움 부분·톤은
 * 포맷(카드 구조·문체)을, 기존 피드백 대비·재사용 의향은 대안 대비 가치를 잰다.
 * 전화번호가 신청(tester-apply)과의 매칭 키이자 쿠폰(기프티콘) 발송 키.
 * payload kind='tester-review'로 Apps Script가 리뷰 탭에 분기 적재한다.
 * formApply와 같은 SHEETS_WEBHOOK_URL 재사용.
 */

export const CONCERN_HITS = ['예', '부분적으로', '아니오'] as const;
export const BEST_PARTS = ['잘된 점', '딱 하나 고칠 점', '다음 한 걸음', '없음'] as const;
export const TONES = [
  '딱 좋았다',
  '더 직설적이어도 된다',
  '더 부드러웠으면 한다',
  '기계적으로 느껴졌다',
] as const;
export const COMPARES = [
  '기존 피드백보다 낫다',
  '비슷하다',
  '기존 피드백이 더 낫다',
  '비교할 기존 피드백이 없다',
] as const;

const score = z.number().int().min(1).max(5);

const reviewSchema = z.object({
  name: z.string().trim().min(1).max(40),
  phone: phoneSchema,
  /** 전체 만족도 1~5 */
  rating: score,
  /** "영상 속 내 연기를 제대로 봤다" 동의 정도 1~5 — 지각 신뢰 */
  accuracy: score,
  /** 피드백 카드가 본인이 고민하던 부분을 짚었는가 */
  concernHit: z.enum(CONCERN_HITS),
  /** 카드 세 부분 중 가장 도움된 곳 — 포맷 검증 */
  bestPart: z.enum(BEST_PARTS),
  /** "다음 한 걸음대로 바로 연습할 수 있겠다" 동의 정도 1~5 — 처방 실행 가능성 */
  actionable: score,
  /** 말투·표현 평가 — 톤 검증(문체 가이드) */
  tone: z.enum(TONES),
  /** 평소 받던 피드백 대비 */
  compare: z.enum(COMPARES),
  /** 다음 연습에도 다시 쓸 의향 */
  reuse: z.boolean(),
  /** 가장 좋았던 점 */
  good: z.string().trim().min(1).max(1000),
  /** 아쉬웠던 점·바라는 점 */
  improve: z.string().trim().min(1).max(1000),
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
  accuracy: number;
  concernHit: string;
  bestPart: string;
  actionable: number;
  tone: string;
  compare: string;
  reuse: string;
  good: string;
  improve: string;
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
    accuracy: data.accuracy,
    concernHit: data.concernHit,
    bestPart: data.bestPart,
    actionable: data.actionable,
    tone: data.tone,
    compare: data.compare,
    reuse: data.reuse ? 'Y' : 'N',
    good: data.good,
    improve: data.improve,
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
