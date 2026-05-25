import { handleCoachAnalyze } from '@/server/coachAnalyze';
import { jsonResponse } from '@/server/nextApi';

export const maxDuration = 60;

export async function POST(request: Request) {
  return jsonResponse(await handleCoachAnalyze(request));
}
