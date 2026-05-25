import { describe, expect, it } from 'vitest';
import { createMemoryActtubStorage, normalizeArchiveVideoInput } from './storage';

describe('acttub storage adapter', () => {
  it('persists community posts and comments behind one storage interface', async () => {
    const storage = createMemoryActtubStorage({ seedFixtures: false });

    const post = await storage.createCommunityPost({
      title: '저장소 테스트',
      body: '댓글 수가 같은 adapter에서 증가해야 한다',
      boardId: 'free',
      anonymous: false,
    });
    const comment = await storage.createCommunityComment({
      postId: post.id,
      body: '첫 댓글',
      anonymous: false,
    });
    const fetched = await storage.getCommunityPost(post.id);

    expect(comment.postId).toBe(post.id);
    expect(fetched?.commentCount).toBe(1);
  });

  it('persists archive video metadata without storing large file bytes in postgres', async () => {
    const storage = createMemoryActtubStorage({ seedFixtures: false });

    const video = await storage.createArchiveVideo({
      title: '영상 메타데이터',
      description: '파일은 Blob, 메타데이터는 DB',
      tags: ['테스트', '아카이브'],
      visibility: 'public',
      blobUrl: 'https://blob.vercel-storage.com/archive/test.mp4',
      blobPathname: 'archive/test.mp4',
      mimeType: 'video/mp4',
      sizeBytes: 12_345_678,
      durationSec: 120,
      thumbnailUrl: null,
    });
    const fetched = await storage.getArchiveVideo(video.id);

    expect(fetched).toMatchObject({
      id: video.id,
      title: '영상 메타데이터',
      tags: ['테스트', '아카이브'],
    });
    expect(Object.keys(fetched ?? {})).not.toContain('fileBytes');
  });
});

describe('archive video input normalization', () => {
  it('deduplicates tags and keeps upload metadata separate from display data', () => {
    const normalized = normalizeArchiveVideoInput({
      title: '  업로드 영상  ',
      description: '',
      tags: ['  리허설 ', '리허설', '', '독백'],
      visibility: 'public',
      blobUrl: 'https://blob.vercel-storage.com/archive/upload.mp4',
      blobPathname: 'archive/upload.mp4',
      sizeBytes: 99,
      durationSec: null,
      mimeType: 'video/mp4',
      thumbnailUrl: null,
    });

    expect(normalized).toMatchObject({
      title: '업로드 영상',
      description: null,
      tags: ['리허설', '독백'],
      blobUrl: 'https://blob.vercel-storage.com/archive/upload.mp4',
      blobPathname: 'archive/upload.mp4',
    });
  });
});
