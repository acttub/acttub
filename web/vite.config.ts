/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {
  handleArchiveUpload,
  handleArchiveVideos,
  handleCommunityComments,
  handleCommunityPosts,
  type ApiRequestInput,
  type ApiResult,
} from './src/server/apiCore';

type MiddlewareRequest = {
  method?: string;
  url?: string;
  on: (event: 'data' | 'end' | 'error', callback: (chunk?: Buffer | Error) => void) => void;
};

type MiddlewareResponse = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (body: string) => void;
};

function readJsonBody(request: MiddlewareRequest): Promise<unknown> {
  if (request.method === 'GET' || request.method === 'HEAD') return Promise.resolve(undefined);

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    request.on('data', (chunk) => {
      if (Buffer.isBuffer(chunk)) chunks.push(chunk);
    });
    request.on('end', () => {
      const text = Buffer.concat(chunks).toString('utf8').trim();
      if (!text) {
        resolve(undefined);
        return;
      }
      try {
        resolve(JSON.parse(text));
      } catch {
        resolve(text);
      }
    });
    request.on('error', (error) => reject(error));
  });
}

function apiMiddleware(handler: (input: ApiRequestInput) => ApiResult | Promise<ApiResult>) {
  return async (request: MiddlewareRequest, response: MiddlewareResponse) => {
    const body = await readJsonBody(request);
    const result = await handler({
      method: request.method ?? 'GET',
      url: request.url ?? '/',
      body,
    });
    response.statusCode = result.status;
    response.setHeader('content-type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(result.body));
  };
}

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'acttub-local-api',
      configureServer(server) {
        server.middlewares.use('/api/community/posts', apiMiddleware(handleCommunityPosts));
        server.middlewares.use('/api/community/comments', apiMiddleware(handleCommunityComments));
        server.middlewares.use('/api/archive/videos', apiMiddleware(handleArchiveVideos));
        server.middlewares.use('/api/archive/upload', apiMiddleware(handleArchiveUpload));
      },
    },
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
