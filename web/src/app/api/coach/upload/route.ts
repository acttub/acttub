import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { createCoachUploadTokenOptions } from '@/server/blobUpload';

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: '영상 업로드 환경변수가 설정되어 있지 않습니다.' },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => ({})) as HandleUploadBody;
  const result = await handleUpload({
    request,
    body,
    onBeforeGenerateToken: createCoachUploadTokenOptions,
    onUploadCompleted: async () => {},
  });

  return Response.json(result);
}
