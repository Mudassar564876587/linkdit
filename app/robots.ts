import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/linkdit-studio-8k92/", "/auth/", "/api/"],
    },
    sitemap: "https://linkdit.vercel.app/sitemap.xml",
  }
}
