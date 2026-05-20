import Link from "next/link";
import { Flame, MessageSquare } from "lucide-react";
import { cn, formatRelative } from "@/lib/utils";
import type { PostWithAuthor } from "@/lib/posts";

const HOT_THRESHOLD = 5;

export function PostCard({ post }: { post: PostWithAuthor }) {
  const isHot = post.score >= HOT_THRESHOLD;

  return (
    <li>
      <Link
        href={`/p/${post.id}`}
        className="group block border-b border-border px-4 py-4 transition-colors hover:bg-secondary/50"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground group-hover:text-primary">
              {isHot && (
                <Flame className="mr-1 inline h-4 w-4 -translate-y-0.5 text-primary" />
              )}
              {post.title}
            </h2>
            {post.body && (
              <p className="mt-1 line-clamp-1 text-[13px] text-muted-foreground">
                {post.body}
              </p>
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">
            {post.author.displayName}
          </span>
          <span aria-hidden>·</span>
          <time>{formatRelative(post.createdAt)}</time>
          <span aria-hidden className="ml-auto">
            ·
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-0.5 tabular-nums",
              post.score > 0 && "text-primary",
              post.score < 0 && "text-destructive",
            )}
          >
            ▲ {post.score}
          </span>
          <span className="inline-flex items-center gap-0.5 tabular-nums">
            <MessageSquare className="h-3.5 w-3.5" />
            {post.commentCount}
          </span>
        </div>
      </Link>
    </li>
  );
}
