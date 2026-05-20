import { adminDb } from "@/lib/firebase/admin";
import {
  COL,
  type CommentDoc,
  type PostDoc,
} from "@/lib/firebase/schema";
import type { PostWithAuthor } from "@/lib/posts";
import type { CommentRow } from "@/lib/comments";

export type MyCommentRow = CommentRow & {
  postTitle: string;
  postExists: boolean;
};

function toPostBasic(id: string, d: PostDoc, myVote: number): PostWithAuthor {
  return {
    id,
    boardId: d.boardId ?? "free",
    title: d.title,
    body: d.body,
    score: d.score,
    commentCount: d.commentCount,
    createdAt: d.createdAt.toDate(),
    updatedAt: d.updatedAt.toDate(),
    author: d.author,
    anonymous: d.anonymous === true,
    myVote,
  };
}

export async function listMyPosts(
  userId: string,
  limit = 50,
): Promise<PostWithAuthor[]> {
  const db = adminDb();
  const snap = await db
    .collection(COL.posts)
    .where("authorId", "==", userId)
    .where("deletedAt", "==", null)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((d) => toPostBasic(d.id, d.data() as PostDoc, 0));
}

export async function listMyComments(
  userId: string,
  limit = 50,
): Promise<MyCommentRow[]> {
  const db = adminDb();
  const snap = await db
    .collection(COL.comments)
    .where("authorId", "==", userId)
    .where("deletedAt", "==", null)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  if (snap.empty) return [];

  // Build base comment rows
  const rows = snap.docs.map((d) => {
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
      anonymous: data.anonymous === true,
      myVote: 0,
    } satisfies CommentRow;
  });

  // Batch fetch parent post titles
  const uniquePostIds = Array.from(new Set(rows.map((r) => r.postId)));
  const postRefs = uniquePostIds.map((id) => db.collection(COL.posts).doc(id));
  const postSnaps = uniquePostIds.length > 0 ? await db.getAll(...postRefs) : [];
  const postInfo = new Map<string, { title: string; exists: boolean }>();
  postSnaps.forEach((p) => {
    if (p.exists) {
      const data = p.data() as PostDoc;
      const isLive = data.deletedAt === null;
      postInfo.set(p.id, { title: data.title, exists: isLive });
    }
  });

  return rows.map((r) => {
    const info = postInfo.get(r.postId);
    return {
      ...r,
      postTitle: info?.title ?? "삭제된 글",
      postExists: info?.exists ?? false,
    };
  });
}

export async function listMyLikedPosts(
  userId: string,
  limit = 50,
): Promise<PostWithAuthor[]> {
  const db = adminDb();
  const voteSnap = await db
    .collection(COL.postVotes)
    .where("userId", "==", userId)
    .where("value", "==", 1)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  if (voteSnap.empty) return [];

  const postIds = voteSnap.docs.map((d) => (d.data() as { postId: string }).postId);
  const postRefs = postIds.map((id) => db.collection(COL.posts).doc(id));
  const postSnaps = await db.getAll(...postRefs);

  const out: PostWithAuthor[] = [];
  postSnaps.forEach((p) => {
    if (!p.exists) return;
    const data = p.data() as PostDoc;
    if (data.deletedAt !== null) return;
    out.push(toPostBasic(p.id, data, 1));
  });
  return out;
}
