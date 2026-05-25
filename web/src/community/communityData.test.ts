import { describe, expect, it } from 'vitest';
import {
  HOT_BOARD,
  getCommunityBoard,
  getCommunityPost,
  listCommunityPosts,
  parseCommunityParams,
  searchCommunityPosts,
  type CommunityPost,
} from './communityData';

const posts: CommunityPost[] = [
  {
    id: 'a',
    boardId: 'free',
    title: '대본 외우는 방법',
    body: '녹음해서 듣는 방식이 좋아요.',
    score: 3,
    commentCount: 2,
    createdAt: new Date('2026-05-20T00:00:00.000Z'),
    updatedAt: new Date('2026-05-20T00:00:00.000Z'),
    author: { id: 'u1', username: 'one', displayName: '민서', avatarUrl: null },
    anonymous: false,
    myVote: 0,
    isBookmarked: false,
  },
  {
    id: 'b',
    boardId: 'secret',
    title: '비교하는 거 멈추기',
    body: 'SNS를 잠깐 쉬는 게 도움됐어요.',
    score: 14,
    commentCount: 4,
    createdAt: new Date('2026-05-21T00:00:00.000Z'),
    updatedAt: new Date('2026-05-21T00:00:00.000Z'),
    author: { id: 'u2', username: 'two', displayName: '지훈', avatarUrl: null },
    anonymous: true,
    myVote: 0,
    isBookmarked: false,
  },
];

describe('community data helpers', () => {
  it('parses board and sort params safely', () => {
    expect(parseCommunityParams({ board: 'secret', sort: 'top' })).toEqual({
      board: 'secret',
      sort: 'top',
    });
    expect(parseCommunityParams({ board: 'missing', sort: 'old' })).toEqual({
      board: null,
      sort: 'new',
    });
  });

  it('filters by board and sorts by top score', () => {
    expect(listCommunityPosts(posts, { board: 'secret', sort: 'new' }).map((post) => post.id)).toEqual(['b']);
    expect(listCommunityPosts(posts, { board: null, sort: 'top' }).map((post) => post.id)).toEqual(['b', 'a']);
  });

  it('uses the hot board threshold across all boards', () => {
    expect(HOT_BOARD.slug).toBe('hot');
    expect(listCommunityPosts(posts, { board: HOT_BOARD.slug, sort: 'new' }).map((post) => post.id)).toEqual(['b']);
  });

  it('searches title before body matches', () => {
    expect(searchCommunityPosts(posts, '방법').map((post) => post.id)).toEqual(['a']);
    expect(searchCommunityPosts(posts, '도움').map((post) => post.id)).toEqual(['b']);
  });

  it('gets boards and posts by slug/id', () => {
    expect(getCommunityBoard('free')?.name).toBe('자유게시판');
    expect(getCommunityPost(posts, 'a')?.title).toBe('대본 외우는 방법');
    expect(getCommunityPost(posts, 'missing')).toBeNull();
  });
});
