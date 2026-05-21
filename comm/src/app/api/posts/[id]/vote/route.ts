import { NextResponse } from "next/server";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { COL, postVoteId, type PostDoc } from "@/lib/firebase/schema";
import { requireDbUser } from "@/lib/auth";

const schema = z.object({ value: z.number().int().min(-1).max(1) });

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const user = await requireDbUser();
  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const newValue = parsed.data.value;

  const db = adminDb();
  const postRef = db.collection(COL.posts).doc(id);
  const voteRef = db.collection(COL.postVotes).doc(postVoteId(user.id, id));

  let newScore = 0;
  try {
    await db.runTransaction(async (tx) => {
      const postSnap = await tx.get(postRef);
      if (!postSnap.exists) throw new Error("NOT_FOUND");
      const post = postSnap.data() as PostDoc;
      if (post.deletedAt !== null) throw new Error("NOT_FOUND");

      const voteSnap = await tx.get(voteRef);
      const oldValue = voteSnap.exists
        ? (voteSnap.data() as { value: number }).value
        : 0;
      const delta = newValue - oldValue;

      if (newValue === 0) {
        if (voteSnap.exists) tx.delete(voteRef);
      } else {
        tx.set(voteRef, {
          userId: user.id,
          postId: id,
          value: newValue,
          createdAt: voteSnap.exists
            ? (voteSnap.data() as { createdAt: unknown }).createdAt
            : FieldValue.serverTimestamp(),
        });
      }

      if (delta !== 0) {
        tx.update(postRef, { score: FieldValue.increment(delta) });
        newScore = post.score + delta;
      } else {
        newScore = post.score;
      }
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "ERROR";
    if (msg === "NOT_FOUND") {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    throw err;
  }

  return NextResponse.json({ value: newValue, score: newScore });
}
