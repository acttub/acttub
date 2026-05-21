import Link from "next/link";
import { Pencil } from "lucide-react";
import { listPosts, type PostSort } from "@/lib/posts";
import { getCurrentDbUser } from "@/lib/auth";
import { BOARDS, HOT_BOARD, getBoard, isValidBoardSlug } from "@/lib/boards";
import { PostCard } from "@/components/post-card";
import { SiteSidebar } from "@/components/site-sidebar";
import { BoardTabs } from "@/components/board-tabs";
import { cn } from "@/lib/utils";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; board?: string }>;
}) {
  const { sort, board } = await searchParams;
  const safeSort: PostSort = sort === "top" ? "top" : "new";
  const safeBoard = isValidBoardSlug(board) ? (board as string) : null;
  const activeBoard = safeBoard ? getBoard(safeBoard) : null;

  const me = await getCurrentDbUser();
  const items = await listPosts({
    sort: safeSort,
    currentUserId: me?.id ?? null,
    boardId: safeBoard,
  });

  const tabClass = (active: boolean) =>
    cn(
      "relative px-4 py-3 text-sm font-medium transition-colors",
      active
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground",
    );

  const baseUrl = safeBoard ? `/?board=${safeBoard}` : "/";
  const newSort = safeBoard ? `${baseUrl}&sort=new` : "/?sort=new";
  const topSort = safeBoard ? `${baseUrl}&sort=top` : "/?sort=top";

  return (
    <div className="mx-auto flex max-w-5xl gap-6 px-4 pt-4 lg:px-6">
      <SiteSidebar currentBoard={safeBoard} />

      <div className="min-w-0 flex-1">
        <BoardTabs currentBoard={safeBoard} />

        <div className="px-0 py-3 lg:px-1">
          {activeBoard ? (
            <div className="flex items-baseline gap-2 px-4 lg:px-0">
              <span className="text-2xl">{activeBoard.emoji}</span>
              <h1 className="text-xl font-bold tracking-tight">
                {activeBoard.name}
              </h1>
              <p className="ml-1 text-xs text-muted-foreground">
                {activeBoard.description}
              </p>
            </div>
          ) : (
            <div className="flex items-baseline gap-2 px-4 lg:px-0">
              <h1 className="text-xl font-bold tracking-tight">홈</h1>
              <p className="ml-1 text-xs text-muted-foreground">
                전체 게시글
              </p>
            </div>
          )}
        </div>

        {safeBoard !== HOT_BOARD.slug && (
          <div className="sticky top-14 z-20 border-b border-border bg-background/90 backdrop-blur lg:rounded-t-xl">
            <div className="flex items-center">
              <Link href={newSort} className={tabClass(safeSort === "new")}>
                최신
                {safeSort === "new" && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
                )}
              </Link>
              <Link href={topSort} className={tabClass(safeSort === "top")}>
                인기
                {safeSort === "top" && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="px-4 py-20 text-center text-sm text-muted-foreground">
            {safeBoard === HOT_BOARD.slug
              ? "추천 10개 이상의 인기글이 모이는 곳이에요. 아직 비어있네요."
              : activeBoard
                ? `아직 ${activeBoard.name} 글이 없어요. 첫 글을 써보세요.`
                : "아직 글이 없어요. 첫 글을 써보세요."}
          </div>
        ) : (
          <ul className="divide-y-0">
            {items.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                showBoard={safeBoard === null || safeBoard === HOT_BOARD.slug}
              />
            ))}
          </ul>
        )}

        {/* Hint: which boards exist when on home */}
        {!activeBoard && items.length > 0 && (
          <div className="mt-6 hidden border-t border-border px-4 pt-6 lg:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              둘러보기
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {BOARDS.map((b) => (
                <Link
                  key={b.slug}
                  href={`/?board=${b.slug}`}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground/80 hover:bg-secondary/80"
                >
                  {b.emoji} {b.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {me && (
        <Link
          href={
            safeBoard && safeBoard !== HOT_BOARD.slug
              ? `/new?board=${safeBoard}`
              : "/new"
          }
          className="fixed bottom-6 right-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 sm:bottom-10 sm:right-10"
          aria-label="글쓰기"
        >
          <Pencil className="h-5 w-5" />
        </Link>
      )}
    </div>
  );
}
