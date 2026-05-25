import type { ApiRequestInput, ApiResult } from './apiCore';

export function jsonResponse(result: ApiResult) {
  return Response.json(result.body, { status: result.status });
}

export async function jsonRequestInput(request: Request): Promise<ApiRequestInput> {
  let body: unknown;

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const text = await request.text();
    if (text.trim()) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }
  }

  return {
    method: request.method,
    url: request.url,
    body,
  };
}
