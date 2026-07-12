import type { MetadataRoute } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://linkdit.online"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient()

  const results = await Promise.allSettled([
    supabase.from("tools").select("slug, updated_at").eq("is_published", true),
    supabase.from("categories").select("slug, updated_at"),
    supabase.from("articles").select("slug, updated_at").eq("is_published", true),
    supabase.from("resources").select("slug, updated_at").eq("is_published", true),
    supabase.from("comparisons").select("slug, updated_at").eq("is_published", true),
  ])

  const tools = results[0].status === "fulfilled" ? results[0].value.data : null
  const categories = results[1].status === "fulfilled" ? results[1].value.data : null
  const articles = results[2].status === "fulfilled" ? results[2].value.data : null
  const resources = results[3].status === "fulfilled" ? results[3].value.data : null
  const comparisons = results[4].status === "fulfilled" ? results[4].value.data : null

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/tools`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/articles`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/resources`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/compare`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/submit-tool`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/submit-article`, changeFrequency: "monthly", priority: 0.5 },
  ]

  const toolPages: MetadataRoute.Sitemap = (tools ?? []).map((t) => ({
    url: `${BASE}/tools/${t.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    lastModified: t.updated_at ? new Date(t.updated_at) : undefined,
  }))

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${BASE}/categories/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
    lastModified: c.updated_at ? new Date(c.updated_at) : undefined,
  }))

  const articlePages: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${BASE}/articles/${a.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
    lastModified: a.updated_at ? new Date(a.updated_at) : undefined,
  }))

  const resourcePages: MetadataRoute.Sitemap = (resources ?? []).map((r) => ({
    url: `${BASE}/resources/${r.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
    lastModified: r.updated_at ? new Date(r.updated_at) : undefined,
  }))

  const comparisonPages: MetadataRoute.Sitemap = (comparisons ?? []).map((c) => ({
    url: `${BASE}/compare/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    lastModified: c.updated_at ? new Date(c.updated_at) : undefined,
  }))

  const categoryArticlePages: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${BASE}/articles/category/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }))

  const categoryResourcePages: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${BASE}/resources/category/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }))

  return [
    ...staticPages,
    ...toolPages,
    ...categoryPages,
    ...articlePages,
    ...resourcePages,
    ...categoryArticlePages,
    ...categoryResourcePages,
    ...comparisonPages,
  ]
}
