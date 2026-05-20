import { searchPosts } from "@/lib/posts";
import { getCurrentDbUser } from "@/lib/auth";
import { PostCard } from "@/components/post-card";
import { SiteSidebar } from "@/components/site-sidebar";
import { BoardTabs } from "@/components/board-tabs";
import { SearchForm } from "@/components/search-form";

export const metadata = { title: "검색" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const me = await getCurrentDbUser();
  const results = query ? await searchPosts(query, me?.id ?? null) : [];

  return (
    <div className="mx-auto flex max-w-5xl gap-6 px-4 pt-4 lg:px-6">
      <SiteSidebar currentBoard={null} />

      <div className="min-w-0 flex-1">
        <BoardTabs currentBoard={null} />

        <div className="px-4 py-4 lg:px-1">
          <SearchForm initialQuery={query} />
        </div>

        {query ? (
          results.length === 0 ? (
            <div className="px-4 py-20 text-center text-sm text-muted-foreground">
              ‘{query}’ 에 대한 결과가 없어요.
            </div>
          ) : (
            <>
              <p className="px-4 pb-2 text-xs text-muted-foreground lg:px-1">
                결과 {results.length}개
              </p>
              <ul>
                {results.map((p) => (
                  <PostCard key={p.id} post={p} showBoard />
                ))}
              </ul>
            </>
          )
        ) : (
          <div className="px-4 py-20 text-center text-sm text-muted-foreground">
            제목·본문에서 검색할 단어를 입력하세요.
          </div>
        )}
      </div>
    </div>
  );
}
