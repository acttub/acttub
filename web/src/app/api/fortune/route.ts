import { handleFortune } from '@/server/fortuneGenerate';
import { jsonRequestInput, jsonResponse } from '@/server/nextApi';

export async function POST(request: Request) {
  return jsonResponse(await handleFortune(await jsonRequestInput(request)));
}
