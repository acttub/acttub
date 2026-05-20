import { auth, currentUser as clerkCurrentUser } from "@clerk/nextjs/server";
import { FieldValue } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import { adminDb } from "@/lib/firebase/admin";
import { COL, type UserDoc } from "@/lib/firebase/schema";

export type User = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

function toUser(clerkId: string, d: UserDoc): User {
  return {
    id: clerkId,
    username: d.username,
    displayName: d.displayName,
    avatarUrl: d.avatarUrl,
  };
}

async function findByClerkId(clerkId: string): Promise<User | null> {
  const snap = await adminDb().collection(COL.users).doc(clerkId).get();
  if (!snap.exists) return null;
  return toUser(clerkId, snap.data() as UserDoc);
}

export async function getCurrentDbUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await findByClerkId(userId);
  if (existing) return existing;

  const clerk = await clerkCurrentUser();
  if (!clerk) return null;

  const username = clerk.username ?? `user_${nanoid(8)}`;
  const displayName = clerk.firstName ?? clerk.username ?? "익명";
  const avatarUrl = clerk.imageUrl ?? null;

  const ref = adminDb().collection(COL.users).doc(userId);
  await ref.set(
    {
      clerkId: userId,
      username,
      displayName,
      avatarUrl,
      createdAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return { id: userId, username, displayName, avatarUrl };
}

export async function requireDbUser(): Promise<User> {
  const u = await getCurrentDbUser();
  if (!u) throw new Error("UNAUTHORIZED");
  return u;
}
