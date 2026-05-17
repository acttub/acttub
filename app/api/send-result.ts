/**
 * POST /api/send-result — 결과 상세 리포트를 사용자 이메일로 발송.
 *
 * Body: { email, code, consent: true, website?: '' }
 *  - website 는 honeypot (비어 있어야 통과)
 *  - consent 는 개인정보 수집 동의 (true 필수)
 *
 * 환경변수:
 *  - RESEND_API_KEY   (필수)
 *  - RESEND_FROM      (선택, 기본: ACTI <onboarding@resend.dev>)
 *  - SITE_URL         (선택, 메일 본문 링크용)
 *
 * 주의: 마케팅 audience 자동 등록은 PIPA 동의 범위 초과 위험이 있어
 * 의도적으로 빼두었음. 별도 마케팅 동의 체크박스를 도입한 후 다시 붙일 것.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import { Resend } from 'resend';
import { z } from 'zod';

import { TYPE_CODES, getType } from './_lib/types.js';
import { renderResultEmail } from './_lib/emailTemplate.js';

/** Vercel Node runtime이 주입하는 최소 req/res 확장 (외부 타입 의존 제거). */
type VercelRequest = IncomingMessage & { body?: unknown };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
};

const BodySchema = z.object({
  email: z.string().email().max(255),
  code: z.enum(TYPE_CODES),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY missing');
    return res.status(500).json({ error: '이메일 서비스가 설정되지 않았어요' });
  }

  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: '입력값이 올바르지 않아요' });
  }
  const { email, code } = parsed.data;

  const from = process.env.RESEND_FROM ?? 'ACTI <onboarding@resend.dev>';
  const siteUrl = process.env.SITE_URL ?? 'https://acti.app';

  const resend = new Resend(apiKey);
  const type = getType(code);
  const { subject, html, text } = renderResultEmail(type, siteUrl);

  try {
    const { error: sendError } = await resend.emails.send({
      from,
      to: [email],
      subject,
      html,
      text,
    });

    if (sendError) {
      console.error('Resend send error', sendError);
      return res.status(502).json({ error: '메일 발송에 실패했어요' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Unexpected error', err);
    return res.status(500).json({ error: '예기치 못한 오류가 발생했어요' });
  }
}
