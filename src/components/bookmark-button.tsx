"use client";

import { useState, useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { apiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

type Props = {
  postId: string;
  initialBookmarked: boolean;
  signedIn: boolean;
};

export function BookmarkButton({ postId, initialBookmarked, signedIn }: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, start] = useTransition();

  const toggle = () => {
    if (!signedIn) {
      toast.error("로그인 후 저장할 수 있어요");
      return;
    }
    const next = !bookmarked;
    setBookmarked(next);

    start(async () => {
      const res = await fetch(apiUrl(`/api/posts/${postId}/bookmark`), {
        method: "POST",
      });
      if (!res.ok) {
        setBookmarked(!next);
        toast.error("저장에 실패했어요");
        return;
      }
      toast.success(next ? "저장했어요" : "저장 취소");
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={bookmarked}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary",
        bookmarked && "border-primary bg-primary/10 text-primary",
      )}
    >
      {bookmarked ? (
        <BookmarkCheck className="h-3.5 w-3.5" />
      ) : (
        <Bookmark className="h-3.5 w-3.5" />
      )}
      {bookmarked ? "저장됨" : "저장"}
    </button>
  );
}
