/**
 * 결과 메일 HTML/텍스트 템플릿 렌더러.
 *
 * 서버 API 라우트에서만 호출되지만, 테스트 가능성을 위해 분리해 둔다.
 * 사이트 URL은 서버 환경변수에서 읽어 인자로 전달한다.
 */

import type { EmailType } from './types';
import { getTypeDetails } from './typeDetails';

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default:  return c;
    }
  });

export function renderResultEmail(type: EmailType, siteUrl: string): RenderedEmail {
  const details = getTypeDetails(type.code);
  const resultUrl = `${siteUrl.replace(/\/$/, '')}/result/${type.code}`;
  const subject = `[ACTI] ${type.code} ${type.name} — 상세 결과 리포트`;

  const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Pretendard','Segoe UI',Roboto,sans-serif;color:#1A1A1A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF8;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:20px;padding:40px 32px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <tr><td>
          <p style="margin:0;font-size:12px;color:#999;letter-spacing:0.08em;text-transform:uppercase;">ACTI · 연기 스타일 MBTI</p>
          <h1 style="margin:8px 0 4px;font-size:28px;font-weight:800;letter-spacing:-0.02em;line-height:1.25;">[${escapeHtml(type.code)}] ${escapeHtml(type.name)}</h1>
          <p style="margin:0 0 24px;font-size:16px;color:#555;line-height:1.5;">"${escapeHtml(type.tagline)}"</p>

          <h2 style="margin:24px 0 12px;font-size:18px;font-weight:700;letter-spacing:-0.01em;">너의 결</h2>
          <ul style="margin:0;padding:0 0 0 18px;color:#333;line-height:1.7;">
            ${type.traits.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}
          </ul>

          <h2 style="margin:24px 0 12px;font-size:18px;font-weight:700;letter-spacing:-0.01em;">어울리는 역할</h2>
          <ul style="margin:0;padding:0 0 0 18px;color:#333;line-height:1.7;">
            ${type.roles.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}
          </ul>

          <h2 style="margin:24px 0 12px;font-size:18px;font-weight:700;letter-spacing:-0.01em;">깊이 있는 분석</h2>
          ${details.longAnalysis.map((p) => `<p style="margin:0 0 14px;color:#333;line-height:1.75;">${escapeHtml(p)}</p>`).join('')}

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #EEE;text-align:center;">
            <a href="${escapeHtml(resultUrl)}" style="display:inline-block;background:#1A1A1A;color:#FFFFFF;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:12px;">웹에서 다시 보기</a>
          </div>

          <p style="margin:24px 0 0;font-size:12px;color:#999;text-align:center;line-height:1.6;">
            ACTI · 연기 스타일 MBTI<br/>
            이 메일을 잘못 받으셨다면 무시해주세요.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `[ACTI] ${type.code} ${type.name}`,
    '',
    `"${type.tagline}"`,
    '',
    '[너의 결]',
    ...type.traits.map((t) => `- ${t}`),
    '',
    '[어울리는 역할]',
    ...type.roles.map((r) => `- ${r}`),
    '',
    '[깊이 있는 분석]',
    ...details.longAnalysis.flatMap((p) => [p, '']),
    `웹에서 다시 보기: ${resultUrl}`,
    '',
    '--',
    'ACTI · 연기 스타일 MBTI',
  ].join('\n');

  return { subject, html, text };
}
