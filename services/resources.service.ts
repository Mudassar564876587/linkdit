import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Resource } from "@/types/resource"

function mapRowToResource(row: any): Resource {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    content: row.content,
    categoryId: row.category_id,
    categoryName: row.categories?.name ?? null,
    logoUrl: row.logo_url,
    coverImageUrl: row.cover_image_url,
    websiteUrl: row.website_url,
    downloadUrl: row.download_url,
    pricing: row.pricing ?? "Free",
    features: Array.isArray(row.features) ? row.features : [],
    tags: Array.isArray(row.tags) ? row.tags.map((t: any) => typeof t === "string" ? t : t.name || t) : [],
    featured: row.featured ?? false,
    isPublished: row.is_published ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getResources(options: {
  search?: string
  category?: string
  featured?: boolean
  pricing?: string
  page?: number
  pageSize?: number
} = {}) {
  const supabase = await createServerSupabaseClient()
  const { search, category, featured, pricing, page = 1, pageSize = 12 } = options

  const query = supabase
    .from("resources")
    .select("*, categories(name)", { count: "exact" })
    .eq("is_published", true)

   if (category) {
    query.eq("categories.slug", category.toLowerCase())
  }
  if (featured) {
    query.eq("featured", true)
  }
  if (pricing) {
    query.eq("pricing", pricing)
  }
  if (search) {
    query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  query.order("featured", { ascending: false })
  query.order("created_at", { ascending: false })

  const from = (page - 1) * pageSize
  query.range(from, from + pageSize - 1)

  const { data, count, error } = await query
  if (error) throw new Error(`Failed to fetch resources: ${error.message}`)

  return {
    resources: (data ?? []).map(mapRowToResource),
    total: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  slug = slug.toLowerCase()
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("resources")
    .select("*, categories(name)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(`Failed to fetch resource: ${error.message}`)
  }
  return mapRowToResource(data)
}

export async function getRelatedResources(currentId: string, categoryId: string | null, limit = 3): Promise<Resource[]> {
  const supabase = await createServerSupabaseClient()
  let query = supabase
    .from("resources")
    .select("*, categories(name)")
    .eq("is_published", true)
    .neq("id", currentId)
    .limit(limit)

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  query.order("created_at", { ascending: false })

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch related resources: ${error.message}`)
  return (data ?? []).map(mapRowToResource)
}

export async function getResourcesByCategory(categorySlug: string, limit = 12): Promise<Resource[]> {
  categorySlug = categorySlug.toLowerCase()
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("resources")
    .select("*, categories(name)")
    .eq("categories.slug", categorySlug)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch resources by category: ${error.message}`)
  return (data ?? []).map(mapRowToResource)
}

export async function getFeaturedResources(limit = 6): Promise<Resource[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("resources")
    .select("*, categories(name)")
    .eq("featured", true)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch featured resources: ${error.message}`)
  return (data ?? []).map(mapRowToResource)
}
