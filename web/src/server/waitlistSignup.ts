import { z } from 'zod';
import type { ApiRequestInput, ApiResult } from './apiCore';

/**
 * waitlistSignup — 비공개 테스터 대기자(waitlist) 이메일 수집(acttub.com/tester) 접수.
 *
 * 정식 오픈 전, 인스타 프로필 링크로 쓰는 사전 등록 수집기. 이메일(필수) + 선택 2문항
 * (현재 상황·도움받고 싶은 부분) + 개인정보 동의를 검증해 구글시트(Apps Script 웹앱
 * webhook)로 한 행 append 한다. /form·/form/review 와 같은 SHEETS_WEBHOOK_URL 을
 * 공유하고, payload.kind='waitlist' 로 Apps Script 가 다른 탭에 분기 적재한다.
 * 게임/저장 로직 없는 단순 수집기라 storage/DB 를 쓰지 않는다(/form 과 같은 패턴).
 *
 * 중복 이메일: Apps Script 가 시트에서 같은 이메일을 찾으면 응답 body 로
 * { ok: true, duplicate: true } 를 돌려준다는 계약을 따른다. 그 때는 새 행을 쌓지 않고
 * "이미 신청된 이메일입니다." 를 반환한다. ⚠ Apps Script 가 아직 이 분기를 안 하면
 * duplicate 는 항상 false 라 중복도 새 행으로 쌓인다 — 서버단(append-only webhook)에서는
 * 중복을 완전히 못 막는다. 끝단 정합은 Apps Script 보완으로 닫는다(README/주석 참고).
 */

export const ACTOR_STATUSES = [
  '연기 입시 준비 중',
  '연극영화과 재학 중',
  '배우 지망생',
  '현역 배우',
  '취미로 연기 연습 중',
  '기타',
] as const;

export const HELP_TOPICS = [
  '대본 분석',
  '인물의 목적 찾기',
  '이전 상황 감정 정리',
  '현재 감정선 정리',
  '서브텍스트 정리',
  '기타',
] as const;

const signupSchema = z.object({
  // 필수 — 이메일 형식 검증(send-result 와 같은 z.string().email()).
  email: z.string().trim().email('이메일 형식을 확인해 주세요.').max(255),
  // 선택 — 현재 상황 / 도움받고 싶은 부분. 빈 문자열도 미선택으로 본다.
  actorStatus: z.enum(ACTOR_STATUSES).optional(),
  helpTopic: z.enum(HELP_TOPICS).optional(),
  // 개인정보 수집·이용 동의 — 미동의 제출은 400.
  consent: z.literal(true),
  // honeypot — 사람은 비워둠. 봇이 채우면 조용히 무시(200).
  website: z.string().max(200).optional(),
});

export type WaitlistPayload = {
  kind: 'waitlist';
  ts: string;
  email: string;
  actorStatus: string;
  helpTopic: string;
  consent: string;
};

/** webhook 전송 결과 — form 의 boolean 과 달리 시트 중복(duplicate)까지 읽는다. */
export type WaitlistSendResult = { ok: boolean; duplicate: boolean };

export type WaitlistSignupOptions = {
  webhookUrl?: string;
  /** 시트 전송기(테스트 주입용). */
  send?: (url: string, payload: WaitlistPayload) => Promise<WaitlistSendResult>;
  /** 제출 시각 주입(테스트 결정성). 기본 now. */
  now?: () => Date;
};

const FAILURE = '신청을 접수하지 못했어요. 잠시 후 다시 시도해 주세요.';
const INVALID = '입력값을 확인해 주세요.';
const DUPLICATE = '이미 신청된 이메일입니다.';

/**
 * 구글시트 webhook 전송. form 의 sendToSheetsWebhook 과 달리 body 의 duplicate 플래그까지
 * 읽어 중복 신청을 구분한다(form 의 boolean 계약은 그대로 두고 여기서만 확장).
 */
async function sendWaitlistToSheets(url: string, payload: WaitlistPayload): Promise<WaitlistSendResult> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  // Apps Script(웹앱)는 내부 실패에도 항상 HTTP 200 을 주므로 body.ok 까지 확인한다.
  if (!res.ok) return { ok: false, duplicate: false };
  const body = (await res.json().catch(() => null)) as { ok?: boolean; duplicate?: boolean } | null;
  return { ok: body?.ok === true, duplicate: body?.duplicate === true };
}

export async function handleWaitlistSignup(
  input: ApiRequestInput,
  options: WaitlistSignupOptions = {}
): Promise<ApiResult> {
  const parsed = signupSchema.safeParse(input.body);
  if (!parsed.success) {
    return { status: 400, body: { ok: false, error: INVALID } };
  }
  const data = parsed.data;

  // 봇: honeypot 이 채워졌으면 성공한 척 조용히 버린다(시트엔 안 쌓음).
  if (data.website && data.website.length > 0) {
    return { status: 200, body: { ok: true } };
  }

  const webhookUrl = options.webhookUrl ?? process.env.SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    return { status: 500, body: { ok: false, error: FAILURE } };
  }

  const now = options.now ?? (() => new Date());
  const payload: WaitlistPayload = {
    kind: 'waitlist',
    ts: now().toISOString(),
    // 중복 비교 키 — 시트(Apps Script)와 같은 기준이 되도록 소문자로 정규화해 적재한다.
    email: data.email.toLowerCase(),
    actorStatus: data.actorStatus ?? '',
    helpTopic: data.helpTopic ?? '',
    consent: 'Y',
  };

  const send = options.send ?? sendWaitlistToSheets;
  let result: WaitlistSendResult;
  try {
    result = await send(webhookUrl, payload);
  } catch {
    result = { ok: false, duplicate: false };
  }

  // 이미 신청된 이메일 — 새 행은 안 쌓고 안내만 돌려준다(에러 아님).
  if (result.duplicate) {
    return { status: 200, body: { ok: false, duplicate: true, error: DUPLICATE } };
  }
  if (!result.ok) {
    return { status: 502, body: { ok: false, error: FAILURE } };
  }
  return { status: 200, body: { ok: true } };
}
