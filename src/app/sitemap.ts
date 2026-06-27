import type { MetadataRoute } from "next";

const SITE_URL = process.env.SITE_URL || "https://github.com/guillaumeCode2012/stripe-mcp";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
