import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Article } from "@/types/article"

function mapRowToArticle(row: {
  id: string
  title: string
  slug: string
  description: string
  content: string
  category_id: string
  cover_image_url: string | null
  read_time: string
  published_at: string | null
  author_id: string | null
  author_name: string
  featured: boolean
  is_published: boolean
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
  categories?: { name: string } | null
}): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    content: row.content,
    categoryId: row.category_id,
    categoryName: row.categories?.name ?? "",
    readTime: row.read_time,
    publishedAt: row.published_at ?? row.created_at,
    authorName: row.author_name,
    authorAvatarUrl: null,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getLatestArticles(limit: number = 3): Promise<Article[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("articles")
    .select("*, categories(name)")
    .eq("featured", true)
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch articles: ${error.message}`)
  }

  return (data ?? []).map(mapRowToArticle)
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("articles")
    .select("*, categories(name)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(`Failed to fetch article: ${error.message}`)
  }

  return mapRowToArticle(data)
}

export async function getArticlesByCategory(
  categorySlug: string,
  limit: number = 10
): Promise<Article[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("articles")
    .select("*, categories(name)")
    .eq("categories.slug", categorySlug)
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch articles by category: ${error.message}`)
  }

  return (data ?? []).map(mapRowToArticle)
}
