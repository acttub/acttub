import type { GenerateClientTokenOptions } from '@vercel/blob/client';

export const ARCHIVE_VIDEO_CONTENT_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska',
  'video/x-msvideo',
] as const;

export function isArchiveVideoContentType(contentType: string) {
  return ARCHIVE_VIDEO_CONTENT_TYPES.includes(contentType as (typeof ARCHIVE_VIDEO_CONTENT_TYPES)[number]);
}

export async function createArchiveUploadTokenOptions(
  pathname: string,
): Promise<
  Pick<
    GenerateClientTokenOptions,
    | 'allowedContentTypes'
    | 'maximumSizeInBytes'
    | 'validUntil'
    | 'addRandomSuffix'
    | 'allowOverwrite'
    | 'cacheControlMaxAge'
    | 'ifMatch'
  > & { tokenPayload?: string }
> {
  return {
    allowedContentTypes: [...ARCHIVE_VIDEO_CONTENT_TYPES],
    addRandomSuffix: true,
    tokenPayload: JSON.stringify({ pathname }),
  };
}
