import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";

const Body = z.object({ videoId: z.string().uuid() });

export async function POST(req: Request) {
  const user = await requireDbUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "bad" }, { status: 400 });
  await db
    .insert(schema.bookmarks)
    .values({ userId: user.id, videoId: parsed.data.videoId })
    .onConflictDoNothing();
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await requireDbUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "bad" }, { status: 400 });
  await db
    .delete(schema.bookmarks)
    .where(and(eq(schema.bookmarks.userId, user.id), eq(schema.bookmarks.videoId, parsed.data.videoId)));
  return NextResponse.json({ ok: true });
}
