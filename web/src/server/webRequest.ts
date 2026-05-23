import type { IncomingHttpHeaders, IncomingMessage } from 'node:http';

type RequestWithUrl = IncomingMessage & {
  method?: string;
  url?: string;
};

function headersFromIncoming(headers: IncomingHttpHeaders) {
  const result = new Headers();
  Object.entries(headers).forEach(([name, value]) => {
    if (typeof value === 'string') {
      result.set(name, value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => result.append(name, item));
    }
  });
  return result;
}

export function createWebRequest(request: RequestWithUrl, fallbackPath: string) {
  const method = request.method ?? 'GET';
  const host = request.headers.host ?? 'localhost';
  const protoHeader = request.headers['x-forwarded-proto'];
  const protocol = Array.isArray(protoHeader) ? protoHeader[0] : protoHeader ?? 'http';
  const path = request.url && request.url !== '/' ? request.url : fallbackPath;
  const url = `${protocol}://${host}${path}`;
  const bodyless = method === 'GET' || method === 'HEAD';

  return new Request(url, {
    method,
    headers: headersFromIncoming(request.headers),
    body: bodyless ? undefined : request as unknown as ReadableStream,
    duplex: bodyless ? undefined : 'half',
  } as RequestInit & { duplex?: 'half' });
}
