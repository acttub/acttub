import { handleTestCoachAnalyze } from '@/server/testCoachAnalyze';
import { jsonResponse } from '@/server/nextApi';

// /test 전용 분석 파이프라인(testcoach) — /coach(coach-second)와 분리된 독립 엔진.
// 영상 다운로드 + Gemini 영상 6회 + 텍스트 6회가 60s를 넘길 수 있어 상향.
export const maxDuration = 300;

export async function POST(request: Request) {
  return jsonResponse(await handleTestCoachAnalyze(request));
}
