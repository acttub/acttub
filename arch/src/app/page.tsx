import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Clapperboard, Lock } from "lucide-react";
import { db, schema } from "@/lib/db";
import { getCurrentDbUser } from "@/lib/auth";
import { VideoCard } from "@/components/video-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const me = await getCurrentDbUser();

  const recent = await db
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
    .where(eq(schema.videos.visibility, "public"))
    .orderBy(desc(schema.videos.createdAt))
    .limit(24);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-extrabold leading-tight tracking-tight">
            공유된 연기
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            전체 공개로 올라온 영상들. 내 영상은{" "}
            <Link href="/me" className="font-medium text-foreground underline-offset-4 hover:underline">
              내 보관함
            </Link>
            에서 따로 볼 수 있어요.
          </p>
        </div>
        {me ? (
          <Button asChild variant="outline" size="sm">
            <Link href="/me">
              <Lock />내 보관함
            </Link>
          </Button>
        ) : null}
      </div>

      {recent.length === 0 ? (
        <div className="mx-auto max-w-md rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Clapperboard className="size-7" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">아직 공유된 영상이 없어요</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            업로드한 영상은 기본적으로 비공개예요.
            <br />
            남들에게 보여주고 싶을 때만 전체 공개로 바꿔주세요.
          </p>
          {me ? (
            <div className="mt-6">
              <Button asChild size="lg">
                <Link href="/upload">새 영상 올리기</Link>
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recent.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </div>
  );
}
