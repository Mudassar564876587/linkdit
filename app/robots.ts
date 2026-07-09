import type { MetadataRoute } from "next"
import { SITE } from "@/constants/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/linkdit-studio-8k92/", "/auth/", "/api/"],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  }
}
