import type { MetadataRoute } from "next";
import { getPublishedPoems } from "@/lib/content/poems";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const poems = await getPublishedPoems();

  return [
    {
      url: new URL("/", baseUrl).toString(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/poetry", baseUrl).toString(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...poems.map((poem) => ({
      url: new URL(`/poetry/${encodeURIComponent(poem.slug)}`, baseUrl).toString(),
      lastModified: poem.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
