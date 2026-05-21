import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";
import { newShareToken } from "@/lib/share";

const Body = z
  .object({
    videoId: z.string().uuid().optional(),
    playlistId: z.string().uuid().optional(),
  })
  .refine((d) => !!d.videoId !== !!d.playlistId, {
    message: "Provide exactly one of videoId or playlistId",
  });

export async function POST(req: Request) {
  const user = await requireDbUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "bad" }, { status: 400 });
  const token = newShareToken();
  await db.insert(schema.shareLinks).values({
    token,
    videoId: parsed.data.videoId ?? null,
    playlistId: parsed.data.playlistId ?? null,
    createdBy: user.id,
  });
  return NextResponse.json({ token });
}
