import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { and, desc, eq } from "drizzle-orm";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { db, schema } from "@/lib/db";
import { getCurrentDbUser } from "@/lib/auth";
import { VideoPlayer } from "@/components/video-player";
import { VideoActions } from "@/components/video-actions";
import { CommentSection } from "@/components/comment-section";
import { Badge } from "@/components/ui/badge";
import { formatBytes, formatDuration } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [row] = await db
    .select({
      video: schema.videos,
      user: {
        id: schema.users.id,
        username: schema.users.username,
        displayName: schema.users.displayName,
        avatarUrl: schema.users.avatarUrl,
        bio: schema.users.bio,
      },
    })
    .from(schema.videos)
    .innerJoin(schema.users, eq(schema.users.id, schema.videos.userId))
    .where(eq(schema.videos.id, id))
    .limit(1);

  if (!row) notFound();

  const me = await getCurrentDbUser();
  if (row.video.visibility === "private" && row.user.id !== me?.id) {
    notFound();
  }

  const tags = await db
    .select({ id: schema.tags.id, name: schema.tags.name, slug: schema.tags.slug })
    .from(schema.videoTags)
    .innerJoin(schema.tags, eq(schema.tags.id, schema.videoTags.tagId))
    .where(eq(schema.videoTags.videoId, id));

  let bookmarked = false;
  if (me) {
    const bm = await db.query.bookmarks.findFirst({
      where: and(eq(schema.bookmarks.userId, me.id), eq(schema.bookmarks.videoId, id)),
    });
    bookmarked = !!bm;
  }

  const myPlaylists = me
    ? await db
        .select({ id: schema.playlists.id, title: schema.playlists.title })
        .from(schema.playlists)
        .where(eq(schema.playlists.userId, me.id))
        .orderBy(desc(schema.playlists.updatedAt))
    : [];

  const comments = await db
    .select({
      id: schema.comments.id,
      body: schema.comments.body,
      createdAt: schema.comments.createdAt,
      userId: schema.users.id,
      userName: schema.users.displayName,
      username: schema.users.username,
      avatarUrl: schema.users.avatarUrl,
    })
    .from(schema.comments)
    .innerJoin(schema.users, eq(schema.users.id, schema.comments.userId))
    .where(eq(schema.comments.videoId, id))
    .orderBy(desc(schema.comments.createdAt))
    .limit(200);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_320px]">
      <div>
        <VideoPlayer src={row.video.blobUrl} poster={row.video.thumbnailUrl} videoId={row.video.id} />
        <h1 className="mt-4 text-xl font-semibold leading-snug">{row.video.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>조회 {row.video.viewCount.toLocaleString()}회</span>
          <span>·</span>
          <span>
            {formatDistanceToNow(row.video.createdAt, { addSuffix: true, locale: ko })}
          </span>
          {row.video.durationSec ? (
            <>
              <span>·</span>
              <span>{formatDuration(row.video.durationSec)}</span>
            </>
          ) : null}
          {row.video.sizeBytes ? (
            <>
              <span>·</span>
              <span>{formatBytes(row.video.sizeBytes)}</span>
            </>
          ) : null}
          <span>·</span>
          <span>
            {row.video.visibility === "public"
              ? "공개"
              : row.video.visibility === "unlisted"
                ? "비공개 링크"
                : "비공개"}
          </span>
        </div>

        {tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Link key={t.id} href={`/search?tag=${encodeURIComponent(t.slug)}`}>
                <Badge variant="secondary">#{t.name}</Badge>
              </Link>
            ))}
          </div>
        ) : null}

        <VideoActions
          videoId={row.video.id}
          initialBookmarked={bookmarked}
          initialVisibility={row.video.visibility}
          isOwner={me?.id === row.user.id}
          isAuthed={!!me}
          playlists={myPlaylists}
        />

        {row.video.description ? (
          <div className="mt-6 whitespace-pre-wrap rounded-xl border border-border bg-card p-4 text-sm leading-relaxed">
            {row.video.description}
          </div>
        ) : null}

        <CommentSection
          videoId={row.video.id}
          comments={comments}
          currentUserId={me?.id ?? null}
        />
      </div>

      <aside className="space-y-4">
        <Link
          href={`/u/${row.user.username}`}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:bg-accent"
        >
          {row.user.avatarUrl ? (
            <Image
              src={row.user.avatarUrl}
              alt=""
              width={48}
              height={48}
              className="size-12 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="size-12 rounded-full bg-muted" />
          )}
          <div className="min-w-0">
            <div className="truncate font-medium">{row.user.displayName}</div>
            <div className="truncate text-xs text-muted-foreground">@{row.user.username}</div>
          </div>
        </Link>
      </aside>
    </div>
  );
}
