import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { handleArchiveUpload } from '../../src/server/apiCore';
import { createArchiveUploadTokenOptions } from '../../src/server/blobUpload';
import type { IncomingMessage } from 'node:http';

type VercelRequestLike = IncomingMessage & {
  method?: string;
  url?: string;
  body?: unknown;
};

type VercelResponseLike = {
  status: (statusCode: number) => { json: (body: unknown) => void };
};

export default async function handler(request: VercelRequestLike, response: VercelResponseLike) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const result = await handleUpload({
      request,
      body: request.body as HandleUploadBody,
      onBeforeGenerateToken: createArchiveUploadTokenOptions,
      onUploadCompleted: async () => {},
    });
    response.status(200).json(result);
    return;
  }

  const result = await handleArchiveUpload({
    method: request.method ?? 'POST',
    url: request.url ?? '/api/archive/upload',
    body: request.body,
  });
  response.status(result.status).json(result.body);
}
