import type { MetadataRoute } from "next";
import { SKILLS } from "@/lib/skills";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/skills`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/slop-index`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...SKILLS.map((s) => ({
      url: `${SITE}/skills/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
