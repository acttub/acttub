import { handlePlay } from '@/server/playGame';
import { jsonRequestInput, jsonResponse } from '@/server/nextApi';

export async function GET(request: Request) {
  return jsonResponse(await handlePlay(await jsonRequestInput(request)));
}

export async function POST(request: Request) {
  return jsonResponse(await handlePlay(await jsonRequestInput(request)));
}
