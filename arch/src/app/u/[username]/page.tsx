import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { and, desc, eq, ne, or } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getCurrentDbUser } from "@/lib/auth";
import { VideoCard } from "@/components/video-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await db.query.users.findFirst({
    where: eq(schema.users.username, username),
  });
  if (!user) notFound();

  const me = await getCurrentDbUser();
  const isMe = me?.id === user.id;

  const videos = await db
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
    .where(
      and(
        eq(schema.videos.userId, user.id),
        isMe
          ? or(eq(schema.videos.visibility, "public"), ne(schema.videos.visibility, "public"))!
          : eq(schema.videos.visibility, "public"),
      ),
    )
    .orderBy(desc(schema.videos.createdAt))
    .limit(60);

  const playlistRows = await db
    .select()
    .from(schema.playlists)
    .where(
      and(
        eq(schema.playlists.userId, user.id),
        isMe ? undefined : eq(schema.playlists.visibility, "public"),
      ),
    )
    .orderBy(desc(schema.playlists.updatedAt))
    .limit(24);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 flex items-start gap-4">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt=""
            width={80}
            height={80}
            className="size-20 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="size-20 rounded-full bg-muted" />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{user.displayName}</h1>
          <div className="text-sm text-muted-foreground">@{user.username}</div>
          {user.bio ? <p className="mt-2 text-sm leading-relaxed">{user.bio}</p> : null}
        </div>
      </header>

      <Tabs defaultValue="videos">
        <TabsList>
          <TabsTrigger value="videos">영상 {videos.length}</TabsTrigger>
          <TabsTrigger value="playlists">플레이리스트 {playlistRows.length}</TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="mt-6">
          {videos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
              아직 올린 영상이 없어요.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="playlists" className="mt-6">
          {playlistRows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
              아직 만든 플레이리스트가 없어요.
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {playlistRows.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/playlists/${p.slug}`}
                    className="block rounded-xl border border-border bg-card p-4 hover:bg-accent"
                  >
                    <div className="font-medium">{p.title}</div>
                    {p.description ? (
                      <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {p.description}
                      </div>
                    ) : null}
                    <div className="mt-2 text-xs text-muted-foreground">
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
