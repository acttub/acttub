import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";

const Body = z.object({
  videoId: z.string().uuid(),
  body: z.string().trim().min(1).max(2000),
});

export async function POST(req: Request) {
  const user = await requireDbUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "bad" }, { status: 400 });
  const [created] = await db
    .insert(schema.comments)
    .values({ videoId: parsed.data.videoId, userId: user.id, body: parsed.data.body })
    .returning();
  return NextResponse.json({
    id: created.id,
    body: created.body,
    createdAt: created.createdAt,
    userId: user.id,
    userName: user.displayName,
    username: user.username,
    avatarUrl: user.avatarUrl,
  });
}
