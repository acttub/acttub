import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { formatDuration } from "@/lib/utils";

type Props = {
  video: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    durationSec: number | null;
    createdAt: Date;
    viewCount: number;
    user: {
      username: string;
      displayName: string;
      avatarUrl: string | null;
    };
  };
};

export function VideoCard({ video }: Props) {
  return (
    <Link href={`/videos/${video.id}`} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted ring-1 ring-border/60 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_24px_rgba(25,31,40,0.08)]">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            미리보기 없음
          </div>
        )}
        {video.durationSec ? (
          <div className="absolute bottom-2 right-2 rounded-full bg-foreground/85 px-2 py-0.5 text-[11px] font-semibold text-background">
            {formatDuration(video.durationSec)}
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex gap-2.5">
        {video.user.avatarUrl ? (
          <Image
            src={video.user.avatarUrl}
            alt=""
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-full object-cover ring-1 ring-border/60"
            unoptimized
          />
        ) : (
          <div className="size-9 shrink-0 rounded-full bg-muted ring-1 ring-border/60" />
        )}
        <div className="min-w-0 flex-1">
          <div className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground">
            {video.title}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {video.user.displayName}
          </div>
          <div className="text-xs text-muted-foreground">
            조회 {video.viewCount.toLocaleString()}회 ·{" "}
            {formatDistanceToNow(video.createdAt, { addSuffix: true, locale: ko })}
          </div>
        </div>
      </div>
    </Link>
  );
}
