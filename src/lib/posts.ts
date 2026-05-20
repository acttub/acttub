import type { Query } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import {
  COL,
  postVoteId,
  type AuthorSnapshot,
  type PostDoc,
} from "@/lib/firebase/schema";
import {
  HOT_BOARD,
  HOT_THRESHOLD,
  isWritableBoardSlug,
} from "@/lib/boards";

export type PostAuthor = AuthorSnapshot;

export type PostWithAuthor = {
  id: string;
  boardId: string;
  title: string;
  body: string;
  score: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: PostAuthor;
  anonymous: boolean;
  myVote: number;
};

export type PostSort = "new" | "top";

function toPost(id: string, d: PostDoc, myVote: number): PostWithAuthor {
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

export async function listPosts(
  opts: {
    sort?: PostSort;
    limit?: number;
    offset?: number;
    currentUserId?: string | null;
    boardId?: string | null;
  } = {},
): Promise<PostWithAuthor[]> {
  const {
    sort = "new",
    limit = 30,
    offset = 0,
    currentUserId = null,
    boardId = null,
  } = opts;
  const db = adminDb();

  const isHot = boardId === HOT_BOARD.slug;
  let q: Query = db.collection(COL.posts).where("deletedAt", "==", null);

  if (isHot) {
    // Best board: aggregate highly-voted posts across all boards.
    // Always score-desc — reuses the (deletedAt, score, createdAt) composite index.
    q = q
      .where("score", ">=", HOT_THRESHOLD)
      .orderBy("score", "desc")
      .orderBy("createdAt", "desc");
  } else {
    if (boardId && isWritableBoardSlug(boardId)) {
      q = q.where("boardId", "==", boardId);
    }
    q =
      sort === "top"
        ? q.orderBy("score", "desc").orderBy("createdAt", "desc")
        : q.orderBy("createdAt", "desc");
  }
  q = q.offset(offset).limit(limit);

  const snap = await q.get();
  const docs = snap.docs;
  if (docs.length === 0) return [];

  const myVotes = new Map<string, number>();
  if (currentUserId) {
    const voteRefs = docs.map((d) =>
      db.collection(COL.postVotes).doc(postVoteId(currentUserId, d.id)),
    );
    const voteSnaps = await db.getAll(...voteRefs);
    voteSnaps.forEach((s, i) => {
      if (s.exists) {
        const v = (s.data() as { value: number }).value;
        myVotes.set(docs[i].id, v);
      }
    });
  }

  return docs.map((d) =>
    toPost(d.id, d.data() as PostDoc, myVotes.get(d.id) ?? 0),
  );
}

export async function searchPosts(
  q: string,
  currentUserId: string | null = null,
  scanLimit = 200,
): Promise<PostWithAuthor[]> {
  const term = q.trim().toLowerCase();
  if (!term) return [];

  const db = adminDb();
  const snap = await db
    .collection(COL.posts)
    .where("deletedAt", "==", null)
    .orderBy("createdAt", "desc")
    .limit(scanLimit)
    .get();

  type Hit = { doc: (typeof snap.docs)[number]; titleMatch: boolean };
  const hits: Hit[] = [];
  snap.docs.forEach((d) => {
    const data = d.data() as PostDoc;
    const title = data.title.toLowerCase();
    const body = data.body.toLowerCase();
    const inTitle = title.includes(term);
    const inBody = body.includes(term);
    if (inTitle || inBody) hits.push({ doc: d, titleMatch: inTitle });
  });
  if (hits.length === 0) return [];

  // Title matches first (within each group already orderBy createdAt desc).
  hits.sort((a, b) => Number(b.titleMatch) - Number(a.titleMatch));

  const myVotes = new Map<string, number>();
  if (currentUserId) {
    const voteRefs = hits.map((h) =>
      db.collection(COL.postVotes).doc(postVoteId(currentUserId, h.doc.id)),
    );
    const voteSnaps = await db.getAll(...voteRefs);
    voteSnaps.forEach((s, i) => {
      if (s.exists) {
        const v = (s.data() as { value: number }).value;
        myVotes.set(hits[i].doc.id, v);
      }
    });
  }

  return hits.map((h) =>
    toPost(h.doc.id, h.doc.data() as PostDoc, myVotes.get(h.doc.id) ?? 0),
  );
}

export async function getPost(
  id: string,
  currentUserId: string | null = null,
): Promise<PostWithAuthor | null> {
  const db = adminDb();
  const snap = await db.collection(COL.posts).doc(id).get();
  if (!snap.exists) return null;
  const data = snap.data() as PostDoc;
  if (data.deletedAt !== null) return null;

  let myVote = 0;
  if (currentUserId) {
    const v = await db
      .collection(COL.postVotes)
      .doc(postVoteId(currentUserId, id))
      .get();
    if (v.exists) myVote = (v.data() as { value: number }).value;
  }

  return toPost(id, data, myVote);
}
