import Link from "next/link";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { VideoCard } from "@/components/video-card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const { q, tag } = await searchParams;
  const query = q?.trim() || null;
  const tagSlug = tag?.trim() || null;

  const conditions = [eq(schema.videos.visibility, "public")];
  if (query) {
    conditions.push(
      or(
        ilike(schema.videos.title, `%${query}%`),
        ilike(schema.videos.description, `%${query}%`),
      )!,
    );
  }

  let videoIdsByTag: string[] | null = null;
  let tagRow: { name: string } | null = null;
  if (tagSlug) {
    const t = await db.query.tags.findFirst({ where: eq(schema.tags.slug, tagSlug) });
    if (!t) {
      videoIdsByTag = [];
    } else {
      tagRow = { name: t.name };
      const rows = await db
        .select({ videoId: schema.videoTags.videoId })
        .from(schema.videoTags)
        .where(eq(schema.videoTags.tagId, t.id));
      videoIdsByTag = rows.map((r) => r.videoId);
    }
  }

  if (videoIdsByTag && videoIdsByTag.length === 0) {
    return renderEmpty({ query, tagName: tagRow?.name ?? tagSlug });
  }
  if (videoIdsByTag && videoIdsByTag.length > 0) {
    conditions.push(sql`${schema.videos.id} = any(${videoIdsByTag})`);
  }

  const results = await db
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
    .where(and(...conditions))
    .orderBy(desc(schema.videos.createdAt))
    .limit(60);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-baseline gap-2">
        <h1 className="text-2xl font-bold tracking-tight">검색 결과</h1>
        {query ? <Badge variant="secondary">검색어: {query}</Badge> : null}
        {tagSlug ? <Badge variant="secondary">#{tagRow?.name ?? tagSlug}</Badge> : null}
        <Link href="/" className="ml-auto text-sm text-muted-foreground hover:text-foreground">
          홈으로
        </Link>
      </div>
      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
          결과가 없어요.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </div>
  );
}

function renderEmpty({ query, tagName }: { query: string | null; tagName: string | null | undefined }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-baseline gap-2">
        <h1 className="text-2xl font-bold tracking-tight">검색 결과</h1>
        {query ? <Badge variant="secondary">검색어: {query}</Badge> : null}
        {tagName ? <Badge variant="secondary">#{tagName}</Badge> : null}
      </div>
      <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
        결과가 없어요.
      </div>
    </div>
  );
}
