import { handleCoachBlobCleanup } from '@/server/coachBlobCleanup';
import { jsonResponse } from '@/server/nextApi';

export const maxDuration = 60;

export async function GET(request: Request) {
  return jsonResponse(await handleCoachBlobCleanup(request));
}

export async function POST(request: Request) {
  return jsonResponse(await handleCoachBlobCleanup(request));
}
