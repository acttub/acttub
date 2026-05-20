import "server-only";
import { db, isDbConfigured, schema } from "./index";
import { FIXTURE_ROOMS } from "./fixtures";
import type { Room } from "./schema";
import { and, eq } from "drizzle-orm";

/**
 * 모든 active 연습실. DATABASE_URL 미설정이면 fixture 사용.
 */
export async function listActiveRooms(): Promise<Room[]> {
  if (!isDbConfigured) return FIXTURE_ROOMS;
  return db.select().from(schema.rooms).where(eq(schema.rooms.active, true));
}

/**
 * slug 로 단건 조회. 없으면 null.
 */
export async function getRoomBySlug(slug: string): Promise<Room | null> {
  if (!isDbConfigured) {
    return FIXTURE_ROOMS.find((r) => r.slug === slug) ?? null;
  }
  const rows = await db
    .select()
    .from(schema.rooms)
    .where(and(eq(schema.rooms.slug, slug), eq(schema.rooms.active, true)))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * 모든 slug — sitemap 용. fixture 모드면 fixture slug 만.
 */
export async function listAllSlugs(): Promise<string[]> {
  if (!isDbConfigured) return FIXTURE_ROOMS.map((r) => r.slug);
  const rows = await db
    .select({ slug: schema.rooms.slug })
    .from(schema.rooms)
    .where(eq(schema.rooms.active, true));
  return rows.map((r) => r.slug);
}
