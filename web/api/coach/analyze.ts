import { handleCoachAnalyze } from '../../src/server/coachAnalyze.js';
import { createWebRequest } from '../../src/server/webRequest.js';
import type { IncomingMessage } from 'node:http';

type VercelRequestLike = IncomingMessage & {
  method?: string;
  url?: string;
};

type VercelResponseLike = {
  status: (statusCode: number) => { json: (body: unknown) => void };
};

export const config = {
  maxDuration: 60,
  api: {
    bodyParser: false,
  },
};

export default async function handler(request: VercelRequestLike, response: VercelResponseLike) {
  const result = await handleCoachAnalyze(createWebRequest(request, '/api/coach/analyze'));
  response.status(result.status).json(result.body);
}
