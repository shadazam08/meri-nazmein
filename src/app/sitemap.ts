import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://meri-nazmein.vercel.app/").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [authors, poems] = await Promise.all([
    prisma.author.findMany({
      select: {
        username: true,
        updatedAt: true,
      },
      orderBy: {
        username: "asc",
      },
    }),

    prisma.poem.findMany({
      where: {
        status: "PUBLISHED",
        type: {
          in: ["NAZM", "GHAZAL", "SHAYARI"],
        },
      },
      select: {
        slug: true,
        type: true,
        publishedAt: true,
        updatedAt: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
    },
    {
      url: `${SITE_URL}/nazmein`,
    },
    {
      url: `${SITE_URL}/ghazals`,
    },
    {
      url: `${SITE_URL}/shayari`,
    },
    {
      url: `${SITE_URL}/authors`,
    },
  ];

  const authorRoutes: MetadataRoute.Sitemap = authors.map((author) => ({
    url: `${SITE_URL}/authors/${author.username}`,
    lastModified: author.updatedAt,
  }));

  const poemRoutes: MetadataRoute.Sitemap = poems.map((poem) => {
    const path = poem.type === "NAZM" ? "nazmein" : poem.type === "GHAZAL" ? "ghazals" : "shayari";

    return {
      url: `${SITE_URL}/${path}/${poem.slug}`,
      lastModified: poem.publishedAt || poem.updatedAt,
    };
  });

  return [...staticRoutes, ...authorRoutes, ...poemRoutes];
}
