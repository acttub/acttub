import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { COL } from "@/lib/firebase/schema";
import { requireDbUser } from "@/lib/auth";
import { listPosts, type PostSort } from "@/lib/posts";
import { isValidBoardSlug, DEFAULT_BOARD_SLUG } from "@/lib/boards";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(20000),
  boardId: z.string().min(1).max(40).optional(),
  anonymous: z.boolean().optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sort: PostSort = url.searchParams.get("sort") === "top" ? "top" : "new";
  const limit = Math.min(Number(url.searchParams.get("limit")) || 30, 100);
  const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);
  const board = url.searchParams.get("board");
  const boardId = isValidBoardSlug(board) ? board : null;
  const items = await listPosts({ sort, limit, offset, boardId });
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
  const boardId = isValidBoardSlug(parsed.data.boardId)
    ? parsed.data.boardId!
    : DEFAULT_BOARD_SLUG;
  const anonymous = parsed.data.anonymous === true;

  await adminDb()
    .collection(COL.posts)
    .doc(id)
    .set({
      id,
      boardId,
      authorId: user.id,
      author: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
      anonymous,
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
