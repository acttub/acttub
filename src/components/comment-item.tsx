"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentForm } from "./comment-form";
import { VoteButton } from "./vote-button";
import { formatRelative } from "@/lib/utils";
import { apiUrl } from "@/lib/api";
import type { CommentRow } from "@/lib/comments";

const MAX_DEPTH = 5;

type Props = {
  comment: CommentRow;
  replies: CommentRow[];
  byParent: Map<string | null, CommentRow[]>;
  currentUserId: string | null;
  depth: number;
};

export function CommentItem({
  comment,
  replies,
  byParent,
  currentUserId,
  depth,
}: Props) {
  const router = useRouter();
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
  const [pending, start] = useTransition();

  const isOwner = currentUserId !== null && currentUserId === comment.author.id;
  const isDeleted = comment.deletedAt !== null;
  const signedIn = currentUserId !== null;

  const saveEdit = () => {
    const trimmed = editBody.trim();
    if (!trimmed) return;
    start(async () => {
      const res = await fetch(apiUrl(`/api/comments/${comment.id}`), {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: trimmed }),
      });
      if (!res.ok) {
        toast.error("수정에 실패했어요");
        return;
      }
      setEditing(false);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!confirm("이 댓글을 삭제할까요?")) return;
    start(async () => {
      const res = await fetch(apiUrl(`/api/comments/${comment.id}`), { method: "DELETE" });
      if (!res.ok) {
        toast.error("삭제에 실패했어요");
        return;
      }
      router.refresh();
    });
  };

  const indentClass = depth === 0 ? "" : "border-l-2 border-border pl-3 ml-1";
  const displayName = comment.anonymous ? "익명" : comment.author.displayName;

  return (
    <li className={indentClass}>
      <div className="space-y-1.5 py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isDeleted ? (
            <span>[삭제됨]</span>
          ) : comment.anonymous ? (
            <span className="font-medium text-foreground/70">익명</span>
          ) : (
            <>
              <Link
                href={`/u/${comment.author.username}`}
                className="font-medium text-foreground hover:underline"
              >
                {displayName}
              </Link>
            </>
          )}
          {!isDeleted && (
            <>
              <span aria-hidden>·</span>
              <time>{formatRelative(comment.createdAt)}</time>
            </>
          )}
        </div>

        {isDeleted ? (
          <p className="text-sm italic text-muted-foreground">
            삭제된 댓글입니다.
          </p>
        ) : editing ? (
          <div className="space-y-2">
            <Textarea
              rows={3}
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="text-[14px]"
            />
            <div className="flex justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditing(false);
                  setEditBody(comment.body);
                }}
                disabled={pending}
              >
                취소
              </Button>
              <Button
                size="sm"
                onClick={saveEdit}
                disabled={pending || !editBody.trim()}
              >
                저장
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-foreground">
            {comment.body}
          </p>
        )}

        {!isDeleted && !editing && (
          <div className="-ml-1 flex items-center gap-1 text-xs text-muted-foreground">
            <VoteButton
              kind="comment"
              targetId={comment.id}
              initialScore={comment.score}
              initialVote={comment.myVote}
              signedIn={signedIn}
            />
            {signedIn && depth < MAX_DEPTH && (
              <button
                type="button"
                onClick={() => setReplying((v) => !v)}
                className="rounded px-2 py-1 hover:bg-accent hover:text-foreground"
              >
                {replying ? "닫기" : "답글"}
              </button>
            )}
            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded px-2 py-1 hover:bg-accent hover:text-foreground"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={pending}
                  className="rounded px-2 py-1 hover:bg-accent hover:text-destructive"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        )}

        {replying && (
          <div className="pt-2">
            <CommentForm
              postId={comment.postId}
              parentId={comment.id}
              onCancel={() => setReplying(false)}
              autoFocus
            />
          </div>
        )}
      </div>

      {replies.length > 0 && (
        <ul>
          {replies.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              replies={byParent.get(child.id) ?? []}
              byParent={byParent}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
