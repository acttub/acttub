import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";
import { VideoCard } from "@/components/video-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default async function MyPage() {
  const me = await requireDbUser();

  const myVideos = await db
    .select({
      id: schema.videos.id,
      title: schema.videos.title,
      thumbnailUrl: schema.videos.thumbnailUrl,
      durationSec: schema.videos.durationSec,
      createdAt: schema.videos.createdAt,
      viewCount: schema.videos.viewCount,
      user: {
        username: schema.users.username,
        displayName: schema.users.displayName,
        avatarUrl: schema.users.avatarUrl,
      },
    })
    .from(schema.videos)
    .innerJoin(schema.users, eq(schema.users.id, schema.videos.userId))
    .where(eq(schema.videos.userId, me.id))
    .orderBy(desc(schema.videos.createdAt));

  const bookmarked = await db
    .select({
      id: schema.videos.id,
      title: schema.videos.title,
      thumbnailUrl: schema.videos.thumbnailUrl,
      durationSec: schema.videos.durationSec,
      createdAt: schema.videos.createdAt,
      viewCount: schema.videos.viewCount,
      user: {
        username: schema.users.username,
        displayName: schema.users.displayName,
        avatarUrl: schema.users.avatarUrl,
      },
    })
    .from(schema.bookmarks)
    .innerJoin(schema.videos, eq(schema.videos.id, schema.bookmarks.videoId))
    .innerJoin(schema.users, eq(schema.users.id, schema.videos.userId))
    .where(eq(schema.bookmarks.userId, me.id))
    .orderBy(desc(schema.bookmarks.createdAt));

  const myPlaylists = await db
    .select()
    .from(schema.playlists)
    .where(eq(schema.playlists.userId, me.id))
    .orderBy(desc(schema.playlists.updatedAt));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">내 아카이브</h1>
        <Link href={`/u/${me.username}`} className="text-sm text-muted-foreground hover:text-foreground">
          공개 프로필 보기
        </Link>
      </div>
      <Tabs defaultValue="videos">
        <TabsList>
          <TabsTrigger value="videos">내 영상 {myVideos.length}</TabsTrigger>
          <TabsTrigger value="bookmarks">북마크 {bookmarked.length}</TabsTrigger>
          <TabsTrigger value="playlists">플레이리스트 {myPlaylists.length}</TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="mt-6">
          {myVideos.length === 0 ? (
            <EmptyState text="아직 올린 영상이 없어요." cta={{ href: "/upload", label: "업로드" }} />
          ) : (
            <Grid items={myVideos} />
          )}
        </TabsContent>
        <TabsContent value="bookmarks" className="mt-6">
          {bookmarked.length === 0 ? (
            <EmptyState text="북마크한 영상이 없어요." />
          ) : (
            <Grid items={bookmarked} />
          )}
        </TabsContent>
        <TabsContent value="playlists" className="mt-6">
          <div className="mb-3 flex justify-end">
            <Link
              href="/playlists/new"
              className="text-sm font-medium text-primary hover:underline"
            >
              + 새 플레이리스트
            </Link>
          </div>
          {myPlaylists.length === 0 ? (
            <EmptyState text="플레이리스트가 없어요." cta={{ href: "/playlists/new", label: "만들기" }} />
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {myPlaylists.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/playlists/${p.slug}`}
                    className="block rounded-xl border border-border bg-card p-4 hover:bg-accent"
                  >
                    <div className="font-medium">{p.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {p.visibility === "public"
                        ? "공개"
                        : p.visibility === "unlisted"
                          ? "비공개 링크"
                          : "비공개"}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Grid({ items }: { items: React.ComponentProps<typeof VideoCard>["video"][] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((v) => (
        <VideoCard key={v.id} video={v} />
      ))}
    </div>
  );
}

function EmptyState({ text, cta }: { text: string; cta?: { href: string; label: string } }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
      {text}
      {cta ? (
        <>
          {" "}
          <Link href={cta.href} className="underline hover:text-foreground">
            {cta.label}
          </Link>
        </>
      ) : null}
    </div>
  );
}
