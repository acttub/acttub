import { handleLineshotScore } from '@/server/lineshotScore';
import { jsonResponse } from '@/server/nextApi';

export async function POST(request: Request) {
  return jsonResponse(await handleLineshotScore(request));
}
