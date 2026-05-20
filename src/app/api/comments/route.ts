import { NextResponse } from "next/server";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { COL, type CommentDoc, type PostDoc } from "@/lib/firebase/schema";
import { requireDbUser } from "@/lib/auth";

const createSchema = z.object({
  postId: z.string().min(1),
  parentId: z.string().nullable().optional(),
  body: z.string().min(1).max(10000),
});

export async function POST(req: Request) {
  const user = await requireDbUser();
  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { postId, parentId, body } = parsed.data;
  const db = adminDb();
  const commentRef = db.collection(COL.comments).doc();
  const postRef = db.collection(COL.posts).doc(postId);

  try {
    await db.runTransaction(async (tx) => {
      const postSnap = await tx.get(postRef);
      if (!postSnap.exists) throw new Error("POST_NOT_FOUND");
      const post = postSnap.data() as PostDoc;
      if (post.deletedAt !== null) throw new Error("POST_NOT_FOUND");

      if (parentId) {
        const parentSnap = await tx.get(
          db.collection(COL.comments).doc(parentId),
        );
        if (!parentSnap.exists) throw new Error("PARENT_NOT_FOUND");
        const parent = parentSnap.data() as CommentDoc;
        if (parent.postId !== postId) throw new Error("PARENT_NOT_FOUND");
      }

      tx.set(commentRef, {
        postId,
        parentId: parentId ?? null,
        authorId: user.id,
        author: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
        },
        body,
        score: 0,
        createdAt: FieldValue.serverTimestamp(),
        deletedAt: null,
      });
      tx.update(postRef, { commentCount: FieldValue.increment(1) });
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "ERROR";
    if (msg === "POST_NOT_FOUND") {
      return NextResponse.json({ error: "post not found" }, { status: 404 });
    }
    if (msg === "PARENT_NOT_FOUND") {
      return NextResponse.json({ error: "parent not found" }, { status: 400 });
    }
    throw err;
  }

  return NextResponse.json({ id: commentRef.id }, { status: 201 });
}
