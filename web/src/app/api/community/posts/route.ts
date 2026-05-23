import { handleCommunityPosts } from '@/server/apiCore';
import { jsonRequestInput, jsonResponse } from '@/server/nextApi';

export async function GET(request: Request) {
  return jsonResponse(await handleCommunityPosts(await jsonRequestInput(request)));
}

export async function POST(request: Request) {
  return jsonResponse(await handleCommunityPosts(await jsonRequestInput(request)));
}
