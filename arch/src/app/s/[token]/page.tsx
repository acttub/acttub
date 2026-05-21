import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const link = await db.query.shareLinks.findFirst({
    where: eq(schema.shareLinks.token, token),
  });
  if (!link) notFound();
  if (link.expiresAt && link.expiresAt.getTime() < Date.now()) notFound();

  if (link.videoId) redirect(`/videos/${link.videoId}`);
  if (link.playlistId) {
    const pl = await db.query.playlists.findFirst({
      where: eq(schema.playlists.id, link.playlistId),
    });
    if (pl) redirect(`/playlists/${pl.slug}`);
  }
  notFound();
}
