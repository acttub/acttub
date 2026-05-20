export type Board = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
};

export const BOARDS: readonly Board[] = [
  { slug: "free", name: "자유", emoji: "💬", description: "편하게 이야기 나누는 곳" },
  { slug: "info", name: "정보", emoji: "📢", description: "오디션·작업·교육 정보" },
  { slug: "qna", name: "질문", emoji: "❓", description: "선배 배우에게 묻기" },
  { slug: "review", name: "후기", emoji: "📝", description: "현장·오디션 후기" },
  { slug: "recruit", name: "모집", emoji: "🎯", description: "팀·작품 모집 공고" },
  { slug: "cheer", name: "응원", emoji: "👏", description: "서로 응원하고 칭찬" },
] as const;

export const DEFAULT_BOARD_SLUG: string = "free";

export function getBoard(slug: string | undefined | null): Board | undefined {
  if (!slug) return undefined;
  return BOARDS.find((b) => b.slug === slug);
}

export function isValidBoardSlug(slug: string | undefined | null): boolean {
  return getBoard(slug) !== undefined;
}
