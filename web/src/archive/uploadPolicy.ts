export const ARCHIVE_MULTIPART_UPLOAD_THRESHOLD_BYTES = 100 * 1024 * 1024;

export function shouldUseArchiveMultipartUpload(sizeBytes: number) {
  return sizeBytes > ARCHIVE_MULTIPART_UPLOAD_THRESHOLD_BYTES;
}
