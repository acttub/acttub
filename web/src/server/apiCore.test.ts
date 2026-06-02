import { describe, expect, it, vi } from 'vitest';
import {
  handleArchiveUpload,
  handleArchiveVideos,
  handleActiSurveyResponses,
  handleCommunityComments,
  handleCommunityPosts,
} from './apiCore';
import { createMemoryActtubStorage } from './storage';

describe('unified API core', () => {
  it('lists community posts through the server API boundary', async () => {
    const result = await handleCommunityPosts({
      method: 'GET',
      url: '/api/community/posts?board=hot',
    });

    expect(result.status).toBe(200);
    expect((result.body as { items: unknown[] }).items.length).toBeGreaterThan(0);
  });

  it('creates secret-board posts as anonymous', async () => {
    const result = await handleCommunityPosts({
      method: 'POST',
      url: '/api/community/posts',
      body: { title: '비밀 글', body: '내용', boardId: 'secret', anonymous: false },
    });

    expect(result.status).toBe(201);
    expect((result.body as { item: { anonymous: boolean; boardId: string } }).item).toMatchObject({
      anonymous: true,
      boardId: 'secret',
    });
  });

  it('creates comments and increments post comment counts', async () => {
    const storage = createMemoryActtubStorage({ seedFixtures: false });
    const postResult = await handleCommunityPosts({
      method: 'POST',
      url: '/api/community/posts',
      body: { title: '댓글 테스트', body: '내용', boardId: 'free' },
    }, storage);
    const postId = (postResult.body as { id: string }).id;
    const commentResult = await handleCommunityComments({
      method: 'POST',
      url: '/api/community/comments',
      body: { postId, body: '댓글' },
    }, storage);

    expect(commentResult.status).toBe(201);
    const fetched = await handleCommunityPosts({
      method: 'GET',
      url: `/api/community/posts?q=${encodeURIComponent('댓글 테스트')}`,
    }, storage);
    expect((fetched.body as { items: Array<{ commentCount: number }> }).items[0].commentCount).toBe(1);
  });

  it('lists and creates archive video metadata', async () => {
    const storage = createMemoryActtubStorage({ seedFixtures: false });
    const create = await handleArchiveVideos({
      method: 'POST',
      url: '/api/archive/videos',
      body: {
        title: '새 영상',
        description: '메타데이터 저장',
        tags: ['테스트'],
        visibility: 'public',
        durationSec: 90,
      },
    }, storage);

    expect(create.status).toBe(201);
    const list = await handleArchiveVideos({ method: 'GET', url: '/api/archive/videos?q=새 영상' }, storage);
    expect((list.body as { items: Array<{ title: string }> }).items[0].title).toBe('새 영상');
  });

  it('stores ACTI survey answers with the computed result code', async () => {
    const storage = createMemoryActtubStorage({ seedFixtures: false });
    const result = await handleActiSurveyResponses({
      method: 'POST',
      url: '/api/acti/survey',
      body: {
        userId: 'acti-user-test',
        resultCode: 'MINB',
        answers: {
          'actor-status': 'active-actor',
          'feedback-source': ['teacher-coach', 'director'],
        },
      },
    }, storage);

    expect(result.status).toBe(201);
    expect(result.body).toMatchObject({
      item: {
        userId: 'acti-user-test',
        resultCode: 'MINB',
        answers: {
          'actor-status': 'active-actor',
          'feedback-source': ['teacher-coach', 'director'],
        },
      },
    });
  });

  it('logs ACTI survey storage failures without exposing answers', async () => {
    const storage = createMemoryActtubStorage({ seedFixtures: false });
    const createActiSurveyResponse = vi
      .spyOn(storage, 'createActiSurveyResponse')
      .mockRejectedValue(new Error('database unavailable'));
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const result = await handleActiSurveyResponses({
      method: 'POST',
      url: '/api/acti/survey',
      body: {
        userId: 'acti-user-test',
        resultCode: 'MINB',
        answers: {
          contact: '010-1234-5678',
        },
      },
    }, storage);

    expect(result).toEqual({
      status: 500,
      body: { error: 'survey response storage failed' },
    });
    expect(createActiSurveyResponse).toHaveBeenCalledOnce();
    expect(consoleError).toHaveBeenCalledWith('ACTI survey response storage failed', {
      userId: 'acti-user-test',
      resultCode: 'MINB',
      error: 'database unavailable',
    });
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain('010-1234-5678');

    consoleError.mockRestore();
  });

  it('keeps blob upload explicit until Vercel Blob is configured', async () => {
    const result = await handleArchiveUpload({ method: 'POST', url: '/api/archive/upload' });

    expect(result.status).toBe(501);
    expect((result.body as { maximumSizeInBytes: null }).maximumSizeInBytes).toBeNull();
  });
});
