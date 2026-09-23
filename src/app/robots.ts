import type { MetadataRoute } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://meri-nazmein.vercel.app/").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/author/login",
        "/author/signup",
        "/author/dashboard",
        "/author/poems",
        "/author/poems/",
        "/author/profile",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
