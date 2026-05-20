import { NextResponse } from "next/server";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { COL, type PostDoc } from "@/lib/firebase/schema";
import { requireDbUser } from "@/lib/auth";

const updateSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(20000),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const user = await requireDbUser();
  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const ref = adminDb().collection(COL.posts).doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const post = snap.data() as PostDoc;
  if (post.authorId !== user.id || post.deletedAt !== null) {
    return NextResponse.json({ error: "forbidden" }, { status: 404 });
  }

  await ref.update({
    title: parsed.data.title,
    body: parsed.data.body,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ id });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const user = await requireDbUser();
  const { id } = await params;

  const ref = adminDb().collection(COL.posts).doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const post = snap.data() as PostDoc;
  if (post.authorId !== user.id || post.deletedAt !== null) {
    return NextResponse.json({ error: "forbidden" }, { status: 404 });
  }

  await ref.update({ deletedAt: FieldValue.serverTimestamp() });
  return NextResponse.json({ ok: true });
}
