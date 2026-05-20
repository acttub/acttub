"use client";

import { useState, useTransition } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { apiUrl } from "@/lib/api";

type Props = {
  kind: "post" | "comment";
  targetId: string;
  initialScore: number;
  initialVote: number;
  signedIn: boolean;
  orientation?: "horizontal" | "vertical";
};

export function VoteButton({
  kind,
  targetId,
  initialScore,
  initialVote,
  signedIn,
  orientation = "horizontal",
}: Props) {
  const [score, setScore] = useState(initialScore);
  const [myVote, setMyVote] = useState(initialVote);
  const [pending, start] = useTransition();

  const setVote = (clicked: 1 | -1) => {
    if (!signedIn) {
      toast.error("로그인 후 투표할 수 있어요");
      return;
    }
    const next = myVote === clicked ? 0 : clicked;
    const delta = next - myVote;
    if (delta === 0) return;

    const prevVote = myVote;
    setMyVote(next);
    setScore((s) => s + delta);

    start(async () => {
      const path = kind === "post" ? "posts" : "comments";
      const res = await fetch(apiUrl(`/api/${path}/${targetId}/vote`), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ value: next }),
      });
      if (!res.ok) {
        setMyVote(prevVote);
        setScore((s) => s - delta);
        toast.error("투표에 실패했어요");
      }
    });
  };

  const isVertical = orientation === "vertical";

  return (
    <div
      className={cn(
        "inline-flex items-center select-none",
        isVertical ? "flex-col gap-0" : "gap-0.5",
      )}
    >
      <button
        type="button"
        onClick={() => setVote(1)}
        disabled={pending}
        className={cn(
          "rounded-full p-1 transition-colors hover:bg-accent",
          myVote === 1 && "text-primary",
        )}
        aria-label="추천"
        aria-pressed={myVote === 1}
      >
        <ArrowBigUp className={isVertical ? "h-6 w-6" : "h-5 w-5"} />
      </button>
      <span
        className={cn(
          "tabular-nums text-center",
          isVertical ? "text-sm font-semibold w-6" : "min-w-6 text-sm",
          myVote === 1 && "text-primary",
          myVote === -1 && "text-destructive",
        )}
      >
        {score}
      </span>
      <button
        type="button"
        onClick={() => setVote(-1)}
        disabled={pending}
        className={cn(
          "rounded-full p-1 transition-colors hover:bg-accent",
          myVote === -1 && "text-destructive",
        )}
        aria-label="비추천"
        aria-pressed={myVote === -1}
      >
        <ArrowBigDown className={isVertical ? "h-6 w-6" : "h-5 w-5"} />
      </button>
    </div>
  );
}
