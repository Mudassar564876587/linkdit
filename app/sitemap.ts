import type { MetadataRoute } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SITE } from "@/constants/site"

const BASE = SITE.url

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient()

  const [{ data: tools }, { data: categories }, { data: articles }, { data: resources }, { data: comparisons }] = await Promise.all([
    supabase.from("tools").select("slug, updated_at").eq("is_published", true),
    supabase.from("categories").select("slug"),
    supabase.from("articles").select("slug, updated_at").eq("is_published", true),
    supabase.from("resources").select("slug, updated_at").eq("is_published", true),
    supabase.from("comparisons").select("slug, updated_at").eq("is_published", true),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/tools`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/articles`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/resources`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/compare`, changeFrequency: "daily", priority: 0.8 },
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
