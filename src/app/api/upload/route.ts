import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const { userId } = await auth();
        if (!userId) throw new Error("로그인이 필요합니다.");
        const kind = clientPayload === "thumbnail" ? "thumbnail" : "video";
        return {
          allowedContentTypes:
            kind === "thumbnail"
              ? ["image/jpeg", "image/png", "image/webp"]
              : [
                  "video/mp4",
                  "video/webm",
                  "video/quicktime",
                  "video/x-matroska",
                  "video/x-msvideo",
                ],
          maximumSizeInBytes:
            kind === "thumbnail" ? 5 * 1024 * 1024 : 500 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId, kind }),
        };
      },
      onUploadCompleted: async () => {
        // Metadata persisted via /api/videos after client upload resolves.
      },
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error instanceof Error ? error.message : "upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
