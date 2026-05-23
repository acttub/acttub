import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { handleArchiveUpload } from '@/server/apiCore';
import { createArchiveUploadTokenOptions } from '@/server/blobUpload';
import { jsonResponse } from '@/server/nextApi';

export async function POST(request: Request) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const body = await request.json().catch(() => ({})) as HandleUploadBody;
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: createArchiveUploadTokenOptions,
      onUploadCompleted: async () => {},
    });
    return Response.json(result);
  }

  return jsonResponse(await handleArchiveUpload({
    method: request.method,
    url: request.url,
  }));
}
