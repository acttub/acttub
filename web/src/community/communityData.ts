export type CommunityBoard = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  alwaysAnonymous?: boolean;
};

export type CommunityAuthor = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

export type CommunityPost = {
  id: string;
  boardId: string;
  title: string;
  body: string;
  score: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: CommunityAuthor;
  anonymous: boolean;
  myVote: number;
  isBookmarked: boolean;
};

export type CommunityComment = {
  id: string;
  postId: string;
  parentId: string | null;
  body: string;
  score: number;
  createdAt: Date;
  deletedAt: Date | null;
  author: CommunityAuthor;
  anonymous: boolean;
  myVote: number;
};

export type CommunitySort = 'new' | 'top';

export type CommunityParams = {
  board: string | null;
  sort: CommunitySort;
};

export const COMMUNITY_BOARDS: readonly CommunityBoard[] = [
  { slug: 'free', name: '자유게시판', emoji: '💬', description: '편하게 이야기 나누는 곳' },
  {
    slug: 'secret',
    name: '비밀게시판',
    emoji: '🤫',
    description: '익명으로만 올라가는 솔직한 공간',
    alwaysAnonymous: true,
  },
  { slug: 'promo', name: '홍보게시판', emoji: '📣', description: '활동·채널·작업 홍보' },
] as const;

export const HOT_BOARD: CommunityBoard = {
  slug: 'hot',
  name: '베스트',
  emoji: '🔥',
  description: '추천 10개 이상의 인기글',
};

export const HOT_THRESHOLD = 10;

export function getCommunityBoard(slug: string | undefined | null): CommunityBoard | undefined {
  if (!slug) return undefined;
  if (slug === HOT_BOARD.slug) return HOT_BOARD;
  return COMMUNITY_BOARDS.find((board) => board.slug === slug);
}

export function isWritableCommunityBoard(slug: string | undefined | null): boolean {
  return COMMUNITY_BOARDS.some((board) => board.slug === slug);
}

export function parseCommunityParams(raw: Record<string, string | string[] | undefined>): CommunityParams {
  const boardRaw = Array.isArray(raw.board) ? raw.board[0] : raw.board;
  const sortRaw = Array.isArray(raw.sort) ? raw.sort[0] : raw.sort;

  return {
    board: getCommunityBoard(boardRaw) ? boardRaw ?? null : null,
    sort: sortRaw === 'top' ? 'top' : 'new',
  };
}

export function listCommunityPosts(posts: CommunityPost[], params: CommunityParams): CommunityPost[] {
  const filtered = posts.filter((post) => {
    if (params.board === HOT_BOARD.slug) return post.score >= HOT_THRESHOLD;
    if (params.board && isWritableCommunityBoard(params.board)) return post.boardId === params.board;
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (params.board === HOT_BOARD.slug || params.sort === 'top') {
      if (b.score !== a.score) return b.score - a.score;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

export function searchCommunityPosts(posts: CommunityPost[], query: string): CommunityPost[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];

  return posts
    .map((post) => {
      const titleMatch = post.title.toLowerCase().includes(term);
      const bodyMatch = post.body.toLowerCase().includes(term);
      return titleMatch || bodyMatch ? { post, titleMatch } : null;
    })
    .filter((hit): hit is { post: CommunityPost; titleMatch: boolean } => hit !== null)
    .sort((a, b) => {
      const titleDiff = Number(b.titleMatch) - Number(a.titleMatch);
      if (titleDiff !== 0) return titleDiff;
      return b.post.createdAt.getTime() - a.post.createdAt.getTime();
    })
    .map((hit) => hit.post);
}

export function getCommunityPost(posts: CommunityPost[], id: string | undefined): CommunityPost | null {
  if (!id) return null;
  return posts.find((post) => post.id === id) ?? null;
}

export function formatCommunityRelative(date: Date | string | number) {
  const d = typeof date === 'object' ? date : new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}일 전`;
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}
