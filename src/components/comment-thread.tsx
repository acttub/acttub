"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { clientDb } from "@/lib/firebase/client";
import {
  COL,
  type AuthorSnapshot,
} from "@/lib/firebase/schema";
import { CommentItem } from "./comment-item";
import { computeAnonymousLabels } from "@/lib/anonymous-labels";
import { cn } from "@/lib/utils";
import type { CommentRow } from "@/lib/comments";

type ClientCommentDoc = {
  postId: string;
  parentId: string | null;
  authorId: string;
  author: AuthorSnapshot;
  anonymous?: boolean;
  body: string;
  score: number;
  createdAt: Timestamp | null;
  deletedAt: Timestamp | null;
};

type CommentSort = "time" | "top";

type Props = {
  postId: string;
  postAuthorId: string;
  initialComments: CommentRow[];
  currentUserId: string | null;
};

export function CommentThread({
  postId,
  postAuthorId,
  initialComments,
  currentUserId,
}: Props) {
  const [comments, setComments] = useState<CommentRow[]>(initialComments);
  const [sort, setSort] = useState<CommentSort>("time");

  useEffect(() => {
    const q = query(
      collection(clientDb(), COL.comments),
      where("postId", "==", postId),
      orderBy("createdAt", "asc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      const myVoteMap = new Map(
        initialComments.map((c) => [c.id, c.myVote] as const),
      );
      const rows: CommentRow[] = snap.docs.map((d) => {
        const data = d.data() as ClientCommentDoc;
        return {
          id: d.id,
          postId: data.postId,
          parentId: data.parentId,
          body: data.body,
          score: data.score,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          deletedAt: data.deletedAt ? data.deletedAt.toDate() : null,
          author: data.author,
          anonymous: data.anonymous === true,
          myVote: myVoteMap.get(d.id) ?? 0,
        };
      });
      setComments(rows);
    });
    return () => unsub();
  }, [postId, initialComments]);

  const anonymousLabels = useMemo(
    () => computeAnonymousLabels(comments, postAuthorId),
    [comments, postAuthorId],
  );

  // Group children by parent; replies always stay in time order.
  const byParent = useMemo(() => {
    const m = new Map<string | null, CommentRow[]>();
    for (const c of comments) {
      const list = m.get(c.parentId);
      if (list) list.push(c);
      else m.set(c.parentId, [c]);
    }
    return m;
  }, [comments]);

  // Roots get the user-chosen sort.
  const roots = useMemo(() => {
    const base = byParent.get(null) ?? [];
    if (sort === "top") {
      return [...base].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
    }
    return base;
  }, [byParent, sort]);

  if (roots.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => setSort("time")}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors",
            sort === "time"
              ? "bg-secondary font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          시간순
        </button>
        <button
          type="button"
          onClick={() => setSort("top")}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors",
            sort === "top"
              ? "bg-secondary font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          추천순
        </button>
      </div>
      <ul className="space-y-5">
        {roots.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            replies={byParent.get(c.id) ?? []}
            byParent={byParent}
            currentUserId={currentUserId}
            anonymousLabels={anonymousLabels}
            depth={0}
          />
        ))}
      </ul>
    </div>
  );
}
