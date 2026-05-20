import { NextResponse } from "next/server";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { COL, type CommentDoc } from "@/lib/firebase/schema";
import { requireDbUser } from "@/lib/auth";

const updateSchema = z.object({ body: z.string().min(1).max(10000) });

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const user = await requireDbUser();
  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const ref = adminDb().collection(COL.comments).doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const c = snap.data() as CommentDoc;
  if (c.authorId !== user.id || c.deletedAt !== null) {
    return NextResponse.json({ error: "forbidden" }, { status: 404 });
  }

  await ref.update({ body: parsed.data.body });
  return NextResponse.json({ id });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const user = await requireDbUser();
  const { id } = await params;

  const db = adminDb();
  const ref = db.collection(COL.comments).doc(id);

  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error("NOT_FOUND");
      const c = snap.data() as CommentDoc;
      if (c.authorId !== user.id || c.deletedAt !== null) {
        throw new Error("NOT_FOUND");
      }

      tx.update(ref, { deletedAt: FieldValue.serverTimestamp() });
      tx.update(db.collection(COL.posts).doc(c.postId), {
        commentCount: FieldValue.increment(-1),
      });
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "ERROR";
    if (msg === "NOT_FOUND") {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    throw err;
  }

  return NextResponse.json({ ok: true });
}
