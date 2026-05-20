import { adminDb } from "@/lib/firebase/admin";
import {
  COL,
  commentVoteId,
  type AuthorSnapshot,
  type CommentDoc,
} from "@/lib/firebase/schema";

export type CommentAuthor = AuthorSnapshot;

export type CommentRow = {
  id: string;
  postId: string;
  parentId: string | null;
  body: string;
  score: number;
  createdAt: Date;
  deletedAt: Date | null;
  author: CommentAuthor;
  myVote: number;
};

export async function listComments(
  postId: string,
  currentUserId: string | null = null,
): Promise<CommentRow[]> {
  const db = adminDb();
  const snap = await db
    .collection(COL.comments)
    .where("postId", "==", postId)
    .orderBy("createdAt", "asc")
    .get();
  const docs = snap.docs;
  if (docs.length === 0) return [];

  const myVotes = new Map<string, number>();
  if (currentUserId) {
    const refs = docs.map((d) =>
      db.collection(COL.commentVotes).doc(commentVoteId(currentUserId, d.id)),
    );
    const vs = await db.getAll(...refs);
    vs.forEach((v, i) => {
      if (v.exists) {
        myVotes.set(docs[i].id, (v.data() as { value: number }).value);
      }
    });
  }

  return docs.map((d) => {
    const data = d.data() as CommentDoc;
    return {
      id: d.id,
      postId: data.postId,
      parentId: data.parentId,
      body: data.body,
      score: data.score,
      createdAt: data.createdAt.toDate(),
      deletedAt: data.deletedAt ? data.deletedAt.toDate() : null,
      author: data.author,
      myVote: myVotes.get(d.id) ?? 0,
    };
  });
}
