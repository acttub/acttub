import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";

const Body = z.object({ videoId: z.string().uuid() });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireDbUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "bad" }, { status: 400 });

  const playlist = await db.query.playlists.findFirst({
    where: and(eq(schema.playlists.id, id), eq(schema.playlists.userId, user.id)),
  });
  if (!playlist) return NextResponse.json({ error: "not found" }, { status: 404 });

  const [{ next }] = await db
    .select({
      next: sql<number>`coalesce(max(${schema.playlistVideos.position}), -1) + 1`,
    })
    .from(schema.playlistVideos)
    .where(eq(schema.playlistVideos.playlistId, id));

  await db
    .insert(schema.playlistVideos)
    .values({ playlistId: id, videoId: parsed.data.videoId, position: Number(next) })
    .onConflictDoNothing();

  await db
    .update(schema.playlists)
    .set({ updatedAt: new Date() })
    .where(eq(schema.playlists.id, id));

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireDbUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "bad" }, { status: 400 });

  const playlist = await db.query.playlists.findFirst({
    where: and(eq(schema.playlists.id, id), eq(schema.playlists.userId, user.id)),
  });
  if (!playlist) return NextResponse.json({ error: "not found" }, { status: 404 });

  await db
    .delete(schema.playlistVideos)
    .where(
      and(
        eq(schema.playlistVideos.playlistId, id),
        eq(schema.playlistVideos.videoId, parsed.data.videoId),
      ),
    );

  return NextResponse.json({ ok: true });
}
