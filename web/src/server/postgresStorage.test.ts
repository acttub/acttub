import { describe, expect, it } from 'vitest';
import {
  archiveVideoRowToDomain,
  communityPostRowToDomain,
  selectStorageBackend,
} from './postgresStorage';

describe('postgres storage mapping', () => {
  it('maps community post rows to the existing community domain shape', () => {
    const createdAt = new Date('2026-05-23T00:00:00.000Z');

    const post = communityPostRowToDomain({
      id: 'post_1',
      boardId: 'free',
      title: 'DB 글',
      body: 'DB 본문',
      score: 3,
      commentCount: 2,
      createdAt,
      updatedAt: createdAt,
      authorId: 'user_1',
      authorUsername: 'actor',
      authorDisplayName: '배우',
      authorAvatarUrl: null,
      anonymous: false,
    });

    expect(post).toMatchObject({
      id: 'post_1',
      author: { id: 'user_1', username: 'actor', displayName: '배우', avatarUrl: null },
      myVote: 0,
      isBookmarked: false,
    });
  });

  it('maps archive video rows without exposing blob internals to cards', () => {
    const createdAt = new Date('2026-05-23T00:00:00.000Z');

    const video = archiveVideoRowToDomain({
      id: 'video_1',
      title: 'DB 영상',
      description: null,
      thumbnailUrl: null,
      durationSec: 30,
      createdAt,
      viewCount: 5,
      visibility: 'public',
      tags: ['독백'],
      userUsername: 'actor',
      userDisplayName: '배우',
      userAvatarUrl: null,
      blobUrl: 'https://blob.vercel-storage.com/archive/video.mp4',
      blobPathname: 'archive/video.mp4',
      mimeType: 'video/mp4',
      sizeBytes: 100,
    });

    expect(video).toMatchObject({
      id: 'video_1',
      title: 'DB 영상',
      tags: ['독백'],
      user: { username: 'actor', displayName: '배우', avatarUrl: null },
    });
    expect(Object.keys(video)).not.toContain('blobUrl');
  });
});

describe('storage backend selection', () => {
  it('uses postgres only when DATABASE_URL is configured', () => {
    expect(selectStorageBackend({ DATABASE_URL: '' })).toBe('memory');
    expect(selectStorageBackend({ DATABASE_URL: 'postgres://user:pass@example.com/db' })).toBe('postgres');
  });
});
