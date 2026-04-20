import { MetadataRoute } from "next";
import { featuresData, useCasesData } from "@/lib/landing-data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://voiceiq.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...featuresData.map((f) => ({
      url: `${BASE}/features/${f.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...useCasesData.map((u) => ({
      url: `${BASE}/use-cases/${u.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
