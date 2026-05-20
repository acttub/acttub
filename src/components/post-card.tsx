import Link from "next/link";
import { Flame, MessageSquare } from "lucide-react";
import { cn, formatRelative } from "@/lib/utils";
import { getBoard } from "@/lib/boards";
import type { PostWithAuthor } from "@/lib/posts";

const HOT_THRESHOLD = 5;

type Props = {
  post: PostWithAuthor;
  showBoard?: boolean;
};

export function PostCard({ post, showBoard = false }: Props) {
  const isHot = post.score >= HOT_THRESHOLD;
  const board = getBoard(post.boardId);
  const authorName = post.anonymous ? "익명" : post.author.displayName;

  return (
    <li>
      <Link
        href={`/p/${post.id}`}
        className="group block border-b border-border px-4 py-4 transition-colors hover:bg-secondary/50"
      >
        {showBoard && board && (
          <div className="mb-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-foreground/70">
              <span aria-hidden>{board.emoji}</span>
              {board.name}
            </span>
          </div>
        )}
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
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span className={cn("font-medium", post.anonymous ? "text-muted-foreground" : "text-foreground/70")}>
            {authorName}
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
