import { handleCommunityComments } from '@/server/apiCore';
import { jsonRequestInput, jsonResponse } from '@/server/nextApi';

export async function GET(request: Request) {
  return jsonResponse(await handleCommunityComments(await jsonRequestInput(request)));
}

export async function POST(request: Request) {
  return jsonResponse(await handleCommunityComments(await jsonRequestInput(request)));
}
