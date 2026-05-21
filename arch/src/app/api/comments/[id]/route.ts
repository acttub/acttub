import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireDbUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const deleted = await db
    .delete(schema.comments)
    .where(and(eq(schema.comments.id, id), eq(schema.comments.userId, user.id)))
    .returning({ id: schema.comments.id });
  if (deleted.length === 0) {
    return NextResponse.json({ error: "not found or forbidden" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
