import type { MetadataRoute } from "next";
import { listAllSlugs } from "@/lib/db/queries";

const BASE = "https://acttub.com/excer";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await listAllSlugs();
  const now = new Date();

  return [
    {
      url: `${BASE}/`,
      changeFrequency: "daily",
      priority: 1,
      lastModified: now,
    },
    ...slugs.map((slug) => ({
      url: `${BASE}/rooms/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      lastModified: now,
    })),
  ];
}
