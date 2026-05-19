import { NextResponse } from "next/server";
import { sql, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db
    .update(schema.videos)
    .set({ viewCount: sql`${schema.videos.viewCount} + 1` })
    .where(eq(schema.videos.id, id));
  return NextResponse.json({ ok: true });
}
