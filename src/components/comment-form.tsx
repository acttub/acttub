"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiUrl } from "@/lib/api";

type Props = {
  postId: string;
  parentId?: string;
  onCancel?: () => void;
  autoFocus?: boolean;
};

export function CommentForm({ postId, parentId, onCancel, autoFocus }: Props) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [pending, start] = useTransition();

  const submit = () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    start(async () => {
      const res = await fetch(apiUrl("/api/comments"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ postId, parentId, body: trimmed, anonymous }),
      });
      if (!res.ok) {
        toast.error(res.status === 404 ? "글을 찾지 못했어요" : "댓글을 남기지 못했어요");
        return;
      }
      setBody("");
      setAnonymous(false);
      onCancel?.();
      router.refresh();
    });
  };

  return (
    <div className="space-y-2 rounded-xl bg-secondary/50 p-3">
      <Textarea
        rows={2}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={parentId ? "답글을 남겨보세요" : "댓글을 남겨보세요"}
        autoFocus={autoFocus}
        className="bg-transparent border-0 shadow-none focus-visible:ring-0 resize-none p-0 text-[14px]"
      />
      <div className="flex items-center justify-between gap-2">
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground select-none">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-border accent-primary"
          />
          <span>익명</span>
        </label>
        <div className="flex gap-1">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel} disabled={pending}>
              취소
            </Button>
          )}
          <Button size="sm" onClick={submit} disabled={pending || !body.trim()}>
            {pending ? "등록 중..." : "등록"}
          </Button>
        </div>
      </div>
    </div>
  );
}
