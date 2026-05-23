import { describe, expect, it } from 'vitest';
import { createArchiveUploadTokenOptions, isArchiveVideoContentType } from './blobUpload';

describe('archive blob upload policy', () => {
  it('allows common video content types without a product-level size cap', async () => {
    expect(isArchiveVideoContentType('video/mp4')).toBe(true);
    expect(isArchiveVideoContentType('image/png')).toBe(false);

    const options = await createArchiveUploadTokenOptions('archive/sample.mp4');

    expect(options.allowedContentTypes).toContain('video/mp4');
    expect(options.maximumSizeInBytes).toBeUndefined();
    expect(options.tokenPayload).toBe(JSON.stringify({ pathname: 'archive/sample.mp4' }));
  });
});
