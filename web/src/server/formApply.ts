import { z } from 'zod';
import type { ApiRequestInput, ApiResult } from './apiCore';
import { sendToSheetsWebhook } from './sheetsWebhook';

/**
 * formApply — 알파 테스터 신청(acttub.com/form) 접수.
 *
 * SOMA-70 모집 깔때기의 끝단. 모델: 한 번 사용 + 리뷰 작성 → 쿠폰(기프티콘) 지급.
 * 7문항 + 개인정보 동의를 검증해 구글시트(Apps Script 웹앱 webhook)로 한 행
 * append 한다. webhook URL은 기존 환경변수 SHEETS_WEBHOOK_URL 재사용(send-result와
 * 공유). payload의 kind='tester-apply'로 Apps Script가 다른 탭에 분기 적재한다.
 * 게임 로직 없는 단순 수집기라 storage/DB를 쓰지 않는다.
 *
 * 전화번호는 쿠폰(기프티콘) 발송 키 — 숫자만 남겨 정규화해 적재한다.
 */

export const CAREERS = ['입시생', '현역·세미프로', '취미·입문'] as const;
export const CHANNELS = ['DM', '필름메이커스', '오픈카톡', '인스타'] as const;
export const FEEDBACK_SOURCES = [
  '학원 선생님',
  '학교·교수',
  '스터디·동료',
  '셀프 모니터링',
  '거의 못 받음',
] as const;
export const CONCERNS = ['감정 표현', '대사·발성', '표정', '움직임·동선', '기타'] as const;

/** 하이픈·공백 섞인 입력을 숫자만 남기고 01로 시작하는 10~11자리만 통과시킨다. */
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => /^01\d{8,9}$/.test(v), '전화번호 형식을 확인해 주세요.');

const applySchema = z.object({
  name: z.string().trim().min(1).max(40),
  phone: phoneSchema,
  career: z.enum(CAREERS),
  feedbackSource: z.enum(FEEDBACK_SOURCES),
  concern: z.enum(CONCERNS),
  q1: z.boolean(),
  channel: z.enum(CHANNELS),
  // 개인정보 수집·이용 동의 — 미동의 제출은 400.
  consent: z.literal(true),
  // honeypot — 사람은 비워둠. 봇이 채우면 조용히 무시(200)한다.
  website: z.string().max(200).optional(),
});

export type FormApplyPayload = {
  kind: 'tester-apply';
  ts: string;
  name: string;
  phone: string;
  career: string;
  feedbackSource: string;
  concern: string;
  q1: string;
  channel: string;
  consent: string;
};

export type FormApplyOptions = {
  webhookUrl?: string;
  /** 시트 전송기(테스트 주입용). true=성공. */
  send?: (url: string, payload: FormApplyPayload) => Promise<boolean>;
  /** 제출 시각 주입(테스트 결정성). 기본 now. */
  now?: () => Date;
};

const FAILURE = '신청을 접수하지 못했어요. 잠시 후 다시 시도해 주세요.';
const INVALID = '입력값을 확인해 주세요.';

export async function handleFormApply(
  input: ApiRequestInput,
  options: FormApplyOptions = {}
): Promise<ApiResult> {
  const parsed = applySchema.safeParse(input.body);
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
  const payload: FormApplyPayload = {
    kind: 'tester-apply',
    ts: now().toISOString(),
    name: data.name,
    phone: data.phone,
    career: data.career,
    feedbackSource: data.feedbackSource,
    concern: data.concern,
    q1: data.q1 ? 'Y' : 'N',
    channel: data.channel,
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
