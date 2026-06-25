import { handleWaitlistSignup } from '@/server/waitlistSignup';
import { jsonRequestInput, jsonResponse } from '@/server/nextApi';

export async function POST(request: Request) {
  return jsonResponse(await handleWaitlistSignup(await jsonRequestInput(request)));
}
