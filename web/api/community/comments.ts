import { handleCommunityComments } from '../../src/server/apiCore.js';

type VercelRequestLike = {
  method?: string;
  url?: string;
  body?: unknown;
};

type VercelResponseLike = {
  status: (statusCode: number) => { json: (body: unknown) => void };
};

export default async function handler(request: VercelRequestLike, response: VercelResponseLike) {
  const result = await handleCommunityComments({
    method: request.method ?? 'GET',
    url: request.url ?? '/api/community/comments',
    body: request.body,
  });
  response.status(result.status).json(result.body);
}
