import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";
import { newPlaylistSlug } from "@/lib/share";

const Body = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().max(2000).optional().nullable(),
  visibility: z.enum(["public", "unlisted", "private"]).default("public"),
});

export async function POST(req: Request) {
  const user = await requireDbUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "bad" }, { status: 400 });
  const slug = newPlaylistSlug();
  const [created] = await db
    .insert(schema.playlists)
    .values({
      userId: user.id,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      slug,
      visibility: parsed.data.visibility,
    })
    .returning();
  return NextResponse.json({ id: created.id, slug: created.slug });
}
