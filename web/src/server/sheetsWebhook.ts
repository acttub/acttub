/**
 * sheetsWebhook — 구글시트(Apps Script 웹앱) webhook 공용 전송기.
 *
 * /form(신청)·/form/review(리뷰)가 같은 SHEETS_WEBHOOK_URL 로 payload 를 보내고,
 * Apps Script 가 payload.kind 로 탭을 분기해 append 한다.
 */

export async function sendToSheetsWebhook(url: string, payload: unknown): Promise<boolean> {
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
