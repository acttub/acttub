import { describe, expect, it } from 'vitest';
import { createActtubStorage } from './storageFactory';

describe('storage factory', () => {
  it('uses memory storage when DATABASE_URL is not configured', async () => {
    const storage = createActtubStorage({ DATABASE_URL: '' });

    const post = await storage.createCommunityPost({
      title: '메모리 fallback',
      body: '로컬 개발은 DB 없이 돌아가야 한다',
      boardId: 'free',
    });

    expect(await storage.getCommunityPost(post.id)).toMatchObject({ title: '메모리 fallback' });
  });
});
