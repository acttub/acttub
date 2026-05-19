"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type CommentRow = {
  id: string;
  body: string;
  createdAt: Date;
  userId: string;
  userName: string;
  username: string;
  avatarUrl: string | null;
};

type Props = {
  videoId: string;
  comments: CommentRow[];
  currentUserId: string | null;
};

export function CommentSection({ videoId, comments: initial, currentUserId }: Props) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [comments, setComments] = useState(initial);
  const [pending, startTransition] = useTransition();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId) {
      toast.error("로그인이 필요해요");
      return;
    }
    const text = body.trim();
    if (!text) return;
    const res = await fetch("/archive/api/comments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ videoId, body: text }),
    });
    if (!res.ok) {
      toast.error("댓글 등록 실패");
      return;
    }
    const created = (await res.json()) as CommentRow;
    setComments((prev) => [{ ...created, createdAt: new Date(created.createdAt) }, ...prev]);
    setBody("");
    router.refresh();
  }

  function remove(id: string) {
    if (!confirm("댓글을 삭제할까요?")) return;
    startTransition(async () => {
      const res = await fetch(`/archive/api/comments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("삭제 실패");
        return;
      }
      setComments((prev) => prev.filter((c) => c.id !== id));
    });
  }

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-base font-semibold">댓글 {comments.length}</h2>
      <form onSubmit={submit} className="mb-6 space-y-2">
        <Textarea
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={currentUserId ? "이 연기를 본 생각을 남겨보세요" : "댓글을 남기려면 로그인하세요"}
          disabled={!currentUserId}
          maxLength={2000}
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={!currentUserId || !body.trim()}>
            등록
          </Button>
        </div>
      </form>

      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="flex gap-3">
            {c.avatarUrl ? (
              <Image
                src={c.avatarUrl}
                alt=""
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="size-8 shrink-0 rounded-full bg-muted" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{c.userName}</span>
                <span>·</span>
                <span>{formatDistanceToNow(c.createdAt, { addSuffix: true, locale: ko })}</span>
                {currentUserId === c.userId ? (
                  <>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => remove(c.id)}
                      disabled={pending}
                      className="hover:text-destructive"
                    >
                      삭제
                    </button>
                  </>
                ) : null}
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{c.body}</p>
            </div>
          </li>
        ))}
        {comments.length === 0 ? (
          <li className="text-sm text-muted-foreground">아직 댓글이 없어요.</li>
        ) : null}
      </ul>
    </section>
  );
}
