import { handleCoachAnalyze } from '@/server/coachAnalyze';
import { jsonResponse } from '@/server/nextApi';

// 멀티 페르소나 파이프라인은 영상 폴링 + Gemini 6호출이라 60s를 넘길 수 있어 상향.
export const maxDuration = 300;

export async function POST(request: Request) {
  return jsonResponse(await handleCoachAnalyze(request));
}
