import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Article } from "@/types/article"

function mapRowToArticle(row: any): Article {
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
    authorAvatarUrl: row.users?.avatar_url ?? row.author_avatar_url ?? null,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getArticles(options: {
  search?: string
  category?: string
  featured?: boolean
  page?: number
  pageSize?: number
} = {}) {
  const supabase = await createServerSupabaseClient()
  const { search, category, featured, page = 1, pageSize = 9 } = options

  const query = supabase
    .from("articles")
    .select("*, categories(name), users(avatar_url)", { count: "exact" })
    .eq("is_published", true)

   if (category) {
    query.eq("categories.slug", category.toLowerCase())
  }
  if (featured) {
    query.eq("featured", true)
  }
  if (search) {
    query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  query.order("published_at", { ascending: false, nullsFirst: false })
  query.order("created_at", { ascending: false })

  const from = (page - 1) * pageSize
  query.range(from, from + pageSize - 1)

  const { data, count, error } = await query
  if (error) throw new Error(`Failed to fetch articles: ${error.message}`)

  return {
    articles: (data ?? []).map(mapRowToArticle),
    total: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}

export async function getLatestArticles(limit: number = 3): Promise<Article[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("articles")
    .select("*, categories(name), users(avatar_url)")
    .eq("featured", true)
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch articles: ${error.message}`)
  return (data ?? []).map(mapRowToArticle)
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  slug = slug.toLowerCase()
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("articles")
    .select("*, categories(name), users(avatar_url)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(`Failed to fetch article: ${error.message}`)
  }
  return mapRowToArticle(data)
}

export async function getArticlesByCategory(categorySlug: string, limit: number = 10): Promise<Article[]> {
  categorySlug = categorySlug.toLowerCase()
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("articles")
    .select("*, categories(name), users(avatar_url)")
    .eq("categories.slug", categorySlug)
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch articles by category: ${error.message}`)
  return (data ?? []).map(mapRowToArticle)
}

export async function getRelatedArticles(currentId: string, categoryId: string, limit: number = 3): Promise<Article[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("articles")
    .select("*, categories(name), users(avatar_url)")
    .eq("is_published", true)
    .eq("category_id", categoryId)
    .neq("id", currentId)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch related articles: ${error.message}`)
  return (data ?? []).map(mapRowToArticle)
}

export async function getFeaturedArticles(limit: number = 6): Promise<Article[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("articles")
    .select("*, categories(name), users(avatar_url)")
    .eq("featured", true)
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch featured articles: ${error.message}`)
  return (data ?? []).map(mapRowToArticle)
}
