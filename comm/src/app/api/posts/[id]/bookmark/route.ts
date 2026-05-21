import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { COL, bookmarkId, type PostDoc } from "@/lib/firebase/schema";
import { requireDbUser } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Ctx) {
  const user = await requireDbUser();
  const { id } = await params;
  const db = adminDb();

  const postSnap = await db.collection(COL.posts).doc(id).get();
  if (!postSnap.exists) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const post = postSnap.data() as PostDoc;
  if (post.deletedAt !== null) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const bmRef = db.collection(COL.bookmarks).doc(bookmarkId(user.id, id));
  const existing = await bmRef.get();
  if (existing.exists) {
    await bmRef.delete();
    return NextResponse.json({ bookmarked: false });
  }

  await bmRef.set({
    userId: user.id,
    postId: id,
    createdAt: FieldValue.serverTimestamp(),
  });
  return NextResponse.json({ bookmarked: true });
}
