import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Tool, ToolFilters } from "@/types/tool"

function mapRowToTool(row: {
  id: string
  name: string
  slug: string
  description: string
  category_id: string
  logo_url: string | null
  website_url: string
  pricing: "Free" | "Freemium" | "Paid"
  rating: number
  review_count: number
  featured: boolean
  is_published: boolean
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
  categories?: { name: string } | null
}): Tool {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    categoryId: row.category_id,
    categoryName: row.categories?.name ?? "",
    logoUrl: row.logo_url,
    websiteUrl: row.website_url,
    pricing: row.pricing,
    rating: row.rating,
    reviewCount: row.review_count,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getFeaturedTools(): Promise<Tool[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("tools")
    .select("*, categories(name)")
    .eq("featured", true)
    .eq("is_published", true)
    .order("rating", { ascending: false })
    .limit(6)

  if (error) {
    throw new Error(`Failed to fetch featured tools: ${error.message}`)
  }

  return (data ?? []).map(mapRowToTool)
}

export async function getTools(filters?: ToolFilters): Promise<Tool[]> {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from("tools")
    .select("*, categories(name)")
    .eq("is_published", true)

  if (filters?.category) {
    query = query.eq("categories.slug", filters.category.toLowerCase())
  }

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`)
  }

  if (filters?.pricing) {
    query = query.eq("pricing", filters.pricing)
  }

  if (filters?.minRating) {
    query = query.gte("rating", filters.minRating)
  }

  if (filters?.featured !== undefined) {
    query = query.eq("featured", filters.featured)
  }

  query = query.order("rating", { ascending: false })

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch tools: ${error.message}`)
  }

  return (data ?? []).map(mapRowToTool)
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  slug = slug.toLowerCase()
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("tools")
    .select("*, categories(name)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(`Failed to fetch tool: ${error.message}`)
  }

  return mapRowToTool(data)
}
