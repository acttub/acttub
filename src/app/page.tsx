import Link from "next/link";
import { Pencil } from "lucide-react";
import { listPosts, type PostSort } from "@/lib/posts";
import { getCurrentDbUser } from "@/lib/auth";
import { PostCard } from "@/components/post-card";
import { cn } from "@/lib/utils";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  const safeSort: PostSort = sort === "top" ? "top" : "new";
  const me = await getCurrentDbUser();
  const items = await listPosts({ sort: safeSort, currentUserId: me?.id ?? null });

  const tabClass = (active: boolean) =>
    cn(
      "relative px-4 py-3 text-sm font-medium transition-colors",
      active
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground",
    );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="sticky top-14 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="flex items-center">
          <Link href="/?sort=new" className={tabClass(safeSort === "new")}>
            최신
            {safeSort === "new" && (
              <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </Link>
          <Link href="/?sort=top" className={tabClass(safeSort === "top")}>
            인기
            {safeSort === "top" && (
              <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-4 py-20 text-center text-sm text-muted-foreground">
          아직 글이 없어요. 첫 글을 써보세요.
        </div>
      ) : (
        <ul className="divide-y-0">
          {items.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </ul>
      )}

      {me && (
        <Link
          href="/new"
          className="fixed bottom-6 right-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 sm:bottom-10 sm:right-10"
          aria-label="글쓰기"
        >
          <Pencil className="h-5 w-5" />
        </Link>
      )}
    </div>
  );
}
