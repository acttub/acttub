import { describe, expect, it } from 'vitest';
import { ARCHIVE_MULTIPART_UPLOAD_THRESHOLD_BYTES, shouldUseArchiveMultipartUpload } from './uploadPolicy';

describe('archive upload policy', () => {
  it('uses 100MB only as a multipart threshold, not as an upload rejection limit', () => {
    expect(shouldUseArchiveMultipartUpload(ARCHIVE_MULTIPART_UPLOAD_THRESHOLD_BYTES)).toBe(false);
    expect(shouldUseArchiveMultipartUpload(ARCHIVE_MULTIPART_UPLOAD_THRESHOLD_BYTES + 1)).toBe(true);
    expect(shouldUseArchiveMultipartUpload(10 * ARCHIVE_MULTIPART_UPLOAD_THRESHOLD_BYTES)).toBe(true);
  });
});
