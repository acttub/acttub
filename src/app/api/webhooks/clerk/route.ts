import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import { adminDb } from "@/lib/firebase/admin";
import { COL } from "@/lib/firebase/schema";

export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error("Clerk webhook verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const col = adminDb().collection(COL.users);

  switch (evt.type) {
    case "user.created":
    case "user.updated": {
      const { id, username, first_name, image_url } = evt.data;
      const displayName = first_name ?? username ?? "익명";
      await col.doc(id).set(
        {
          clerkId: id,
          username: username ?? `user_${nanoid(8)}`,
          displayName,
          avatarUrl: image_url ?? null,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      break;
    }
    case "user.deleted": {
      const { id } = evt.data;
      if (id) await col.doc(id).delete();
      break;
    }
  }

  return new Response("ok", { status: 200 });
}
