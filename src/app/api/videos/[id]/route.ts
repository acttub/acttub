import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { del } from "@vercel/blob";
import { db, schema } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";

const PatchBody = z.object({
  visibility: z.enum(["public", "unlisted", "private"]).optional(),
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().max(5000).nullable().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireDbUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const parsed = PatchBody.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "bad" }, { status: 400 });

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ ok: true });
  }

  const updated = await db
    .update(schema.videos)
    .set(parsed.data)
    .where(and(eq(schema.videos.id, id), eq(schema.videos.userId, user.id)))
    .returning({ id: schema.videos.id, visibility: schema.videos.visibility });
  if (updated.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, ...updated[0] });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireDbUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;

  const video = await db.query.videos.findFirst({
    where: and(eq(schema.videos.id, id), eq(schema.videos.userId, user.id)),
  });
  if (!video) return NextResponse.json({ error: "not found" }, { status: 404 });

  await db.delete(schema.videos).where(eq(schema.videos.id, id));

  await Promise.allSettled([
    del(video.blobUrl),
    video.thumbnailUrl ? del(video.thumbnailUrl) : Promise.resolve(),
  ]);

  return NextResponse.json({ ok: true });
}
