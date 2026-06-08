import { handleFormApply } from '@/server/formApply';
import { jsonRequestInput, jsonResponse } from '@/server/nextApi';

export async function POST(request: Request) {
  return jsonResponse(await handleFormApply(await jsonRequestInput(request)));
}
