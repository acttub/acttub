import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { slugifyTagName } from "./share";

export async function getCurrentDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await db.query.users.findFirst({
    where: eq(schema.users.clerkId, userId),
  });
  if (existing) return existing;

  const cu = await currentUser();
  if (!cu) return null;

  const baseUsername = pickBaseUsername(cu);
  const username = await ensureUniqueUsername(baseUsername);
  const firstName = cu.firstName?.trim();
  const lastName = cu.lastName?.trim();
  const displayName =
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    cu.username ||
    username;

  const [created] = await db
    .insert(schema.users)
    .values({
      clerkId: userId,
      username,
      displayName,
      avatarUrl: cu.imageUrl ?? null,
    })
    .returning();
  return created;
}

export async function requireDbUser() {
  const u = await getCurrentDbUser();
  if (!u) throw new Error("UNAUTHORIZED");
  return u;
}

function pickBaseUsername(cu: {
  username: string | null;
  emailAddresses: { emailAddress: string }[];
}) {
  const raw =
    cu.username ||
    cu.emailAddresses[0]?.emailAddress.split("@")[0] ||
    "user";
  const cleaned = slugifyTagName(raw) || "user";
  return cleaned;
}

async function ensureUniqueUsername(base: string): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const candidate = i === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`;
    const found = await db.query.users.findFirst({
      where: eq(schema.users.username, candidate),
    });
    if (!found) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}
