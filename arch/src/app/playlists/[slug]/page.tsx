import { notFound } from "next/navigation";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { db, schema } from "@/lib/db";
import { getCurrentDbUser } from "@/lib/auth";
import { VideoCard } from "@/components/video-card";

export const dynamic = "force-dynamic";

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [row] = await db
    .select({
      playlist: schema.playlists,
      owner: {
        id: schema.users.id,
        username: schema.users.username,
        displayName: schema.users.displayName,
      },
    })
    .from(schema.playlists)
    .innerJoin(schema.users, eq(schema.users.id, schema.playlists.userId))
    .where(eq(schema.playlists.slug, slug))
    .limit(1);

  if (!row) notFound();

  const me = await getCurrentDbUser();
  if (row.playlist.visibility === "private" && row.owner.id !== me?.id) notFound();

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
    .from(schema.playlistVideos)
    .innerJoin(schema.videos, eq(schema.videos.id, schema.playlistVideos.videoId))
    .innerJoin(schema.users, eq(schema.users.id, schema.videos.userId))
    .where(eq(schema.playlistVideos.playlistId, row.playlist.id))
    .orderBy(asc(schema.playlistVideos.position));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{row.playlist.title}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link href={`/u/${row.owner.username}`} className="hover:text-foreground">
            {row.owner.displayName}
          </Link>
          <span>·</span>
          <span>영상 {videos.length}개</span>
          <span>·</span>
          <span>
            {formatDistanceToNow(row.playlist.updatedAt, { addSuffix: true, locale: ko })} 업데이트
          </span>
          <span>·</span>
          <span>
            {row.playlist.visibility === "public"
              ? "공개"
              : row.playlist.visibility === "unlisted"
                ? "비공개 링크"
                : "비공개"}
          </span>
        </div>
        {row.playlist.description ? (
          <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
            {row.playlist.description}
          </p>
        ) : null}
      </div>

      {videos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
          아직 담긴 영상이 없어요. 영상 페이지에서 “플레이리스트” 버튼으로 추가할 수 있어요.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </div>
  );
}
