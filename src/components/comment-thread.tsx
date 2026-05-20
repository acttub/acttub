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
import type { CommentRow } from "@/lib/comments";

type ClientCommentDoc = {
  postId: string;
  parentId: string | null;
  authorId: string;
  author: AuthorSnapshot;
  body: string;
  score: number;
  createdAt: Timestamp | null;
  deletedAt: Timestamp | null;
};

type Props = {
  postId: string;
  initialComments: CommentRow[];
  currentUserId: string | null;
};

export function CommentThread({ postId, initialComments, currentUserId }: Props) {
  const [comments, setComments] = useState<CommentRow[]>(initialComments);

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
          myVote: myVoteMap.get(d.id) ?? 0,
        };
      });
      setComments(rows);
    });
    return () => unsub();
  }, [postId, initialComments]);

  const byParent = useMemo(() => {
    const m = new Map<string | null, CommentRow[]>();
    for (const c of comments) {
      const list = m.get(c.parentId);
      if (list) list.push(c);
      else m.set(c.parentId, [c]);
    }
    return m;
  }, [comments]);

  const roots = byParent.get(null) ?? [];
  if (roots.length === 0) return null;

  return (
    <ul className="space-y-5">
      {roots.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          replies={byParent.get(c.id) ?? []}
          byParent={byParent}
          currentUserId={currentUserId}
          depth={0}
        />
      ))}
    </ul>
  );
}
