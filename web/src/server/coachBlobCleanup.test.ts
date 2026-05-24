// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { cleanupOldCoachBlobs, handleCoachBlobCleanup } from './coachBlobCleanup';

function blob(pathname: string, uploadedAt: Date) {
  return {
    url: `https://blob.vercel-storage.com/${pathname}`,
    downloadUrl: `https://blob.vercel-storage.com/${pathname}?download=1`,
    pathname,
    size: 100,
    uploadedAt,
    etag: pathname,
  };
}

describe('coach Blob cleanup', () => {
  it('deletes only expired coach blobs', async () => {
    const now = new Date('2026-05-24T12:00:00.000Z');
    const oldCoachBlob = blob('coach/old.webm', new Date('2026-05-23T11:59:00.000Z'));
    const freshCoachBlob = blob('coach/fresh.webm', new Date('2026-05-24T11:00:00.000Z'));
    const listBlobs = vi.fn().mockResolvedValue({
      blobs: [oldCoachBlob, freshCoachBlob],
      hasMore: false,
    });
    const deleteBlobs = vi.fn().mockResolvedValue(undefined);

    const result = await cleanupOldCoachBlobs({
      now,
      retentionHours: 24,
      listBlobs,
      deleteBlobs,
    });

    expect(listBlobs).toHaveBeenCalledWith({
      prefix: 'coach/',
      cursor: undefined,
      limit: 1000,
    });
    expect(deleteBlobs).toHaveBeenCalledWith([oldCoachBlob.url]);
    expect(result).toEqual({
      scanned: 2,
      deleted: 1,
      deletedPathnames: ['coach/old.webm'],
      retentionHours: 24,
    });
  });

  it('requires the cleanup bearer secret', async () => {
    const result = await handleCoachBlobCleanup(new Request('http://localhost/api/coach/cleanup'), {
      cronSecret: 'secret',
    });

    expect(result).toEqual({
      status: 401,
      body: { error: 'unauthorized' },
    });
  });

  it('runs cleanup when the bearer secret matches', async () => {
    const listBlobs = vi.fn().mockResolvedValue({ blobs: [], hasMore: false });
    const deleteBlobs = vi.fn().mockResolvedValue(undefined);

    const result = await handleCoachBlobCleanup(new Request('http://localhost/api/coach/cleanup', {
      headers: { authorization: 'Bearer secret' },
    }), {
      cronSecret: 'secret',
      listBlobs,
      deleteBlobs,
    });

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      scanned: 0,
      deleted: 0,
    });
  });
});
