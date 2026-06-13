import { handleCoachSecondAnalyze } from '@/server/coachSecondAnalyze';
import { jsonResponse } from '@/server/nextApi';

// 영상 다운로드 + Gemini 영상 6회(E1~E3 + E4×3) + 텍스트 6회가 60s를 넘길 수 있어 상향.
export const maxDuration = 300;

export async function POST(request: Request) {
  return jsonResponse(await handleCoachSecondAnalyze(request));
}
