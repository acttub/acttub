import { z } from 'zod';
import type { ApiRequestInput, ApiResult } from './apiCore';

/**
 * formApply — 알파 테스터 신청(acttub.com/form) 접수.
 *
 * SOMA-70 모집 깔때기의 끝단. 7문항을 검증해 구글시트(Apps Script 웹앱
 * webhook)로 한 행 append 한다. webhook URL은 기존 환경변수 SHEETS_WEBHOOK_URL
 * 재사용(send-result와 공유). payload의 kind='tester-apply'로 Apps Script가
 * 결과메일 로그와 신청을 구분해 다른 탭에 적재한다.
 * 게임 로직 없는 단순 수집기라 storage/DB를 쓰지 않는다.
 */

const CAREERS = ['입시생', '현역·세미프로', '취미·입문'] as const;
const CHANNELS = ['DM', '필름메이커스', '오픈카톡', '인스타'] as const;

const applySchema = z.object({
  nickname: z.string().trim().min(1).max(40),
  contact: z.string().trim().min(1).max(120),
  career: z.enum(CAREERS),
  q1: z.boolean(),
  q2: z.boolean(),
  slot: z.string().trim().max(200).optional().default(''),
  channel: z.enum(CHANNELS),
  // honeypot — 사람은 비워둠. 봇이 채우면 조용히 무시(200)한다.
  website: z.string().max(200).optional(),
});

export type FormApplyPayload = {
  kind: 'tester-apply';
  ts: string;
  nickname: string;
  contact: string;
  career: string;
  q1: string;
  q2: string;
  slot: string;
  channel: string;
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

async function defaultSend(url: string, payload: FormApplyPayload): Promise<boolean> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  // Apps Script(웹앱)는 내부에서 실패해도 항상 HTTP 200을 돌려준다.
  // 그래서 status(res.ok)만으로는 적재 성공을 알 수 없고, body의 { ok: true }까지 확인해야
  // 시트 적재 실패를 조용히 성공으로 처리하는 데이터 유실을 막는다.
  if (!res.ok) return false;
  const body = (await res.json().catch(() => null)) as { ok?: boolean } | null;
  return body?.ok === true;
}

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
    nickname: data.nickname,
    contact: data.contact,
    career: data.career,
    q1: data.q1 ? 'Y' : 'N',
    q2: data.q2 ? 'Y' : 'N',
    slot: data.slot ?? '',
    channel: data.channel,
  };

  const send = options.send ?? defaultSend;
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
