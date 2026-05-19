import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";
import { slugifyTagName } from "@/lib/share";

const Body = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(5000).optional().nullable(),
  tags: z.array(z.string()).max(20).default([]),
  visibility: z.enum(["public", "unlisted", "private"]),
  blobUrl: z.string().url(),
  blobPathname: z.string().min(1),
  thumbnailUrl: z.string().url().nullable().optional(),
  mimeType: z.string().optional().nullable(),
  sizeBytes: z.number().int().nonnegative().optional().nullable(),
  durationSec: z.number().int().nonnegative().optional().nullable(),
});

export async function POST(req: Request) {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }
  const data = parsed.data;

  const [video] = await db
    .insert(schema.videos)
    .values({
      userId: user.id,
      title: data.title,
      description: data.description ?? null,
      blobUrl: data.blobUrl,
      blobPathname: data.blobPathname,
      thumbnailUrl: data.thumbnailUrl ?? null,
      mimeType: data.mimeType ?? null,
      sizeBytes: data.sizeBytes ?? null,
      durationSec: data.durationSec ?? null,
      visibility: data.visibility,
    })
    .returning();

  for (const raw of data.tags) {
    const name = raw.trim();
    const slug = slugifyTagName(name);
    if (!slug) continue;
    const existing = await db.query.tags.findFirst({
      where: eq(schema.tags.slug, slug),
    });
    const tagId =
      existing?.id ??
      (
        await db
          .insert(schema.tags)
          .values({ name, slug })
          .returning()
      )[0].id;
    await db
      .insert(schema.videoTags)
      .values({ videoId: video.id, tagId })
      .onConflictDoNothing();
  }

  return NextResponse.json({ id: video.id });
}
