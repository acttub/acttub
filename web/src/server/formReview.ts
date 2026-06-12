import { z } from 'zod';
import type { ApiRequestInput, ApiResult } from './apiCore';
import { phoneSchema } from './formApply';
import { sendToSheetsWebhook } from './sheetsWebhook';

/**
 * formReview — 알파 테스트 사용 후 리뷰(acttub.com/form/review) 접수.
 *
 * 검증 신호의 정본. 멘토 피드백(폼이 너무 길다)으로 핵심 5문항으로 축소:
 * 만족도(코칭 가치)·실행 가능성(처방)·재사용 의향(대안 대비 가치)·한 줄 리뷰(주관식).
 * 정확성·고민 적중·최고 도움 부분·톤·기존 대비 문항은 인터뷰로 이관.
 * 전화번호가 신청(tester-apply)과의 매칭 키이자 쿠폰(기프티콘) 발송 키.
 * payload kind='tester-review'로 Apps Script가 리뷰 탭에 분기 적재한다.
 * 시트 컬럼은 유지하고 삭제 문항은 빈칸('')으로 보낸다 — Apps Script 수정 불필요.
 * formApply와 같은 SHEETS_WEBHOOK_URL 재사용.
 */

const score = z.number().int().min(1).max(5);

const reviewSchema = z.object({
  name: z.string().trim().min(1).max(40),
  phone: phoneSchema,
  /** 전체 만족도 1~5 */
  rating: score,
  /** "연기 성장에 도움이 될 것 같다" 동의 정도 1~5 — 성장 기대(시트 '실행가능성' 컬럼 적재) */
  actionable: score,
  /** 다음 연습에도 다시 쓸 의향 */
  reuse: z.boolean(),
  /** 한 줄 리뷰 — 좋았던 점·아쉬운 점 자유 서술 (시트 '좋았던점' 컬럼 적재).
   *  쿠폰 어뷰징 1차 필터: 최소 30자(무성의 단답 차단). 최종 '괜찮은 리뷰' 판단은 수동 검수. */
  good: z.string().trim().min(30).max(1000),
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
  /** 축소된 문항 — 시트 컬럼 유지용 빈칸 */
  accuracy: '';
  concernHit: '';
  bestPart: '';
  actionable: number;
  tone: '';
  compare: '';
  reuse: string;
  good: string;
  improve: '';
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
    accuracy: '',
    concernHit: '',
    bestPart: '',
    actionable: data.actionable,
    tone: '',
    compare: '',
    reuse: data.reuse ? 'Y' : 'N',
    good: data.good,
    improve: '',
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
