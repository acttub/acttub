import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { COL } from "@/lib/firebase/schema";
import { requireDbUser } from "@/lib/auth";
import { listPosts, type PostSort } from "@/lib/posts";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(20000),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sort: PostSort = url.searchParams.get("sort") === "top" ? "top" : "new";
  const limit = Math.min(Number(url.searchParams.get("limit")) || 30, 100);
  const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);
  const items = await listPosts({ sort, limit, offset });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const user = await requireDbUser();
  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const id = nanoid(12);
  const now = FieldValue.serverTimestamp();

  await adminDb()
    .collection(COL.posts)
    .doc(id)
    .set({
      id,
      authorId: user.id,
      author: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
      title: parsed.data.title,
      body: parsed.data.body,
      score: 0,
      commentCount: 0,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });

  return NextResponse.json({ id }, { status: 201 });
}
