export type Board = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  /** When true, all posts in this board are forced to be anonymous. */
  alwaysAnonymous?: boolean;
};

/** Writable boards — users can create posts in these. */
export const BOARDS: readonly Board[] = [
  { slug: "free", name: "자유게시판", emoji: "💬", description: "편하게 이야기 나누는 곳" },
  {
    slug: "secret",
    name: "비밀게시판",
    emoji: "🤫",
    description: "익명으로만 올라가는 솔직한 공간",
    alwaysAnonymous: true,
  },
  { slug: "promo", name: "홍보게시판", emoji: "📣", description: "활동·채널·작업 홍보" },
] as const;

/** Virtual board that aggregates highly-voted posts across all boards. */
export const HOT_BOARD: Board = {
  slug: "hot",
  name: "베스트",
  emoji: "🔥",
  description: "추천 10개 이상의 인기글",
};

export const HOT_THRESHOLD = 10;

export const DEFAULT_BOARD_SLUG: string = "free";

export function getBoard(slug: string | undefined | null): Board | undefined {
  if (!slug) return undefined;
  if (slug === HOT_BOARD.slug) return HOT_BOARD;
  return BOARDS.find((b) => b.slug === slug);
}

export function isValidBoardSlug(slug: string | undefined | null): boolean {
  return getBoard(slug) !== undefined;
}

/** True only for boards users can create posts in (excludes virtual ones like 'hot'). */
export function isWritableBoardSlug(slug: string | undefined | null): boolean {
  if (!slug) return false;
  return BOARDS.some((b) => b.slug === slug);
}

export function isAlwaysAnonymousBoard(slug: string | undefined | null): boolean {
  const b = getBoard(slug);
  return b?.alwaysAnonymous === true;
}
