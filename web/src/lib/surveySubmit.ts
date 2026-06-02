/**
 * 설문 응답을 Google Form 으로 전송.
 *
 * - 폼 origin은 외부라 CORS 차단 → `mode: 'no-cors'` fire-and-forget.
 *   응답 본문은 읽을 수 없지만 폼 측에는 응답이 기록됨.
 * - 호출자는 await 가능하지만 실패해도 사용자 흐름은 막지 않음.
 */

import {
  SURVEY_ITEMS,
  isVisible,
  type SurveyAnswers,
} from '../content/survey';

const FORM_RESPONSE_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfjQ1QWaNJDs50Ljjoxtw9u6nE3lr2tttQjSDqQra3tFGFfFQ/formResponse';

export function buildSurveyParams(answers: SurveyAnswers): URLSearchParams {
  const params = new URLSearchParams();
  for (const item of SURVEY_ITEMS) {
    if (item.kind === 'section') continue;
    if (!isVisible(item, answers)) continue;
    const v = answers[item.id];
    if (v == null) continue;
    const entry = `entry.${item.entryId}`;
    if (item.kind === 'radio') {
      if (typeof v !== 'string' || v.length === 0) continue;
      const opt = item.options.find((o) => o.value === v);
      if (opt) params.append(entry, opt.submitLabel ?? opt.label);
    } else if (item.kind === 'checkbox') {
      if (!Array.isArray(v)) continue;
      for (const code of v) {
        const opt = item.options.find((o) => o.value === code);
        if (opt) params.append(entry, opt.submitLabel ?? opt.label);
      }
    } else {
      // text
      if (typeof v !== 'string' || v.trim().length === 0) continue;
      params.append(entry, v.trim());
    }
  }
  return params;
}

export async function submitSurveyResponse(answers: SurveyAnswers, resultCode?: string, userId?: string | null): Promise<void> {
  if (resultCode && userId) {
    await fetch('/api/acti/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, resultCode, answers }),
    }).catch(() => undefined);
  }

  const body = buildSurveyParams(answers);
  await fetch(FORM_RESPONSE_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
}
