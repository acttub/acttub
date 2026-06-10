import { handleFormReview } from '@/server/formReview';
import { jsonRequestInput, jsonResponse } from '@/server/nextApi';

export async function POST(request: Request) {
  return jsonResponse(await handleFormReview(await jsonRequestInput(request)));
}
