import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentDbUser } from "@/lib/auth";
import {
  listMyPosts,
  listMyComments,
  listMyLikedPosts,
  listMyBookmarks,
} from "@/lib/me";
import { PostCard } from "@/components/post-card";
import { CommentCard } from "@/components/comment-card";
import { SiteSidebar } from "@/components/site-sidebar";
import { BoardTabs } from "@/components/board-tabs";
import { cn } from "@/lib/utils";

export const metadata = { title: "내 활동" };

type Tab = "posts" | "comments" | "likes" | "bookmarks";

const TABS: { key: Tab; label: string; emptyMessage: string }[] = [
  { key: "posts", label: "내 글", emptyMessage: "아직 쓴 글이 없어요." },
  { key: "comments", label: "내 댓글", emptyMessage: "아직 남긴 댓글이 없어요." },
  { key: "likes", label: "좋아요", emptyMessage: "추천한 글이 없어요." },
  { key: "bookmarks", label: "북마크", emptyMessage: "저장한 글이 없어요." },
];

export default async function MePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const me = await getCurrentDbUser();
  if (!me) redirect("/");

  const { tab: rawTab } = await searchParams;
  const tab: Tab =
    rawTab === "comments"
      ? "comments"
      : rawTab === "likes"
        ? "likes"
        : rawTab === "bookmarks"
          ? "bookmarks"
          : "posts";

  const [posts, comments, likes, bookmarks] = await Promise.all([
    tab === "posts" ? listMyPosts(me.id) : Promise.resolve([]),
    tab === "comments" ? listMyComments(me.id) : Promise.resolve([]),
    tab === "likes" ? listMyLikedPosts(me.id) : Promise.resolve([]),
    tab === "bookmarks" ? listMyBookmarks(me.id) : Promise.resolve([]),
  ]);

  const meta = TABS.find((t) => t.key === tab)!;

  const tabClass = (active: boolean) =>
    cn(
      "relative px-4 py-3 text-sm font-medium transition-colors",
      active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
    );

  return (
    <div className="mx-auto flex max-w-5xl gap-6 px-4 pt-4 lg:px-6">
      <SiteSidebar currentBoard={null} />

      <div className="min-w-0 flex-1">
        <BoardTabs currentBoard={null} />

        <div className="px-0 py-3 lg:px-1">
          <div className="flex items-baseline gap-2 px-4 lg:px-0">
            <h1 className="text-xl font-bold tracking-tight">내 활동</h1>
            <p className="ml-1 text-xs text-muted-foreground">
              {me.displayName}님이 남긴 글·댓글·좋아요
            </p>
          </div>
        </div>

        <div className="sticky top-14 z-20 border-b border-border bg-background/90 backdrop-blur lg:rounded-t-xl">
          <div className="flex items-center">
            {TABS.map((t) => (
              <Link
                key={t.key}
                href={`/me?tab=${t.key}`}
                className={tabClass(tab === t.key)}
              >
                {t.label}
                {tab === t.key && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {tab === "posts" && (
          posts.length === 0 ? (
            <div className="px-4 py-20 text-center text-sm text-muted-foreground">
              {meta.emptyMessage}
            </div>
          ) : (
            <ul>
              {posts.map((p) => (
                <PostCard key={p.id} post={p} showBoard />
              ))}
            </ul>
          )
        )}

        {tab === "comments" && (
          comments.length === 0 ? (
            <div className="px-4 py-20 text-center text-sm text-muted-foreground">
              {meta.emptyMessage}
            </div>
          ) : (
            <ul>
              {comments.map((c) => (
                <CommentCard key={c.id} comment={c} />
              ))}
            </ul>
          )
        )}

        {tab === "likes" && (
          likes.length === 0 ? (
            <div className="px-4 py-20 text-center text-sm text-muted-foreground">
              {meta.emptyMessage}
            </div>
          ) : (
            <ul>
              {likes.map((p) => (
                <PostCard key={p.id} post={p} showBoard />
              ))}
            </ul>
          )
        )}

        {tab === "bookmarks" && (
          bookmarks.length === 0 ? (
            <div className="px-4 py-20 text-center text-sm text-muted-foreground">
              {meta.emptyMessage}
            </div>
          ) : (
            <ul>
              {bookmarks.map((p) => (
                <PostCard key={p.id} post={p} showBoard />
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
}
