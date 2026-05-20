import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { cn, formatRelative } from "@/lib/utils";
import type { MyCommentRow } from "@/lib/me";

export function CommentCard({ comment }: { comment: MyCommentRow }) {
  const content = (
    <div className="block px-4 py-4">
      <p className="line-clamp-3 whitespace-pre-wrap text-[14px] leading-relaxed text-foreground">
        {comment.body}
      </p>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <MessageSquare className="h-3.5 w-3.5 shrink-0" />
        <span className="line-clamp-1 min-w-0 flex-1">
          {comment.postExists ? comment.postTitle : (
            <span className="italic">{comment.postTitle}</span>
          )}
        </span>
        <span aria-hidden>·</span>
        <time className="shrink-0">{formatRelative(comment.createdAt)}</time>
        {comment.anonymous && (
          <>
            <span aria-hidden>·</span>
            <span className="shrink-0">익명</span>
          </>
        )}
        <span aria-hidden className="shrink-0">·</span>
        <span
          className={cn(
            "shrink-0 tabular-nums",
            comment.score > 0 && "text-primary",
            comment.score < 0 && "text-destructive",
          )}
        >
          {comment.score < 0 ? "▼" : "▲"} {Math.abs(comment.score)}
        </span>
      </div>
    </div>
  );

  return (
    <li className="border-b border-border transition-colors hover:bg-secondary/50">
      {comment.postExists ? (
        <Link href={`/p/${comment.postId}`} className="block">
          {content}
        </Link>
      ) : (
        <div className="opacity-60">{content}</div>
      )}
    </li>
  );
}
