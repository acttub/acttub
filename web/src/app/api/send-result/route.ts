import { Resend } from 'resend';
import { z } from 'zod';
import { renderResultEmail } from '@/server/email/emailTemplate';
import { TYPE_CODES, getType } from '@/server/email/types';

const bodySchema = z.object({
  email: z.string().email().max(255),
  code: z.enum(TYPE_CODES),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY missing');
    return Response.json({ error: '이메일 서비스가 설정되지 않았어요' }, { status: 500 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => undefined));
  if (!parsed.success) {
    return Response.json({ error: '입력값이 올바르지 않아요' }, { status: 400 });
  }

  const { email, code } = parsed.data;
  const from = process.env.RESEND_FROM ?? 'ACTI <onboarding@resend.dev>';
  const siteUrl = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://acttub.com';
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
      return Response.json({ error: '메일 발송에 실패했어요' }, { status: 502 });
    }

    const sheetsUrl = process.env.SHEETS_WEBHOOK_URL;
    if (sheetsUrl) {
      try {
        await fetch(sheetsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code, consent: true }),
        });
      } catch (sheetErr) {
        console.warn('Sheets log failed', sheetErr);
      }
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error('Unexpected error', err);
    return Response.json({ error: '예기치 못한 오류가 발생했어요' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'POST' } });
}
