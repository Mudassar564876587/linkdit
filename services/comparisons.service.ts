import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Comparison, ComparisonFilters, ComparisonWithTools } from "@/types/comparison"

function mapRowToComparison(row: any): Comparison {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    toolAId: row.tool_a_id,
    toolBId: row.tool_b_id,
    categoryId: row.category_id,
    toolANotes: row.tool_a_notes ?? "",
    toolBNotes: row.tool_b_notes ?? "",
    prosA: row.pros_a ?? [],
    prosB: row.pros_b ?? [],
    consA: row.cons_a ?? [],
    consB: row.cons_b ?? [],
    featuresComparison: row.features_comparison ?? [],
    pricingComparison: row.pricing_comparison ?? [],
    ratingsComparison: row.ratings_comparison ?? [],
    views: row.views ?? 0,
    isFeatured: row.is_featured ?? false,
    isPublished: row.is_published ?? false,
    seoTitle: row.seo_title ?? null,
    seoDescription: row.seo_description ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getPublishedComparisons(
  filters?: ComparisonFilters
): Promise<ComparisonWithTools[]> {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from("comparisons")
    .select("*, tool_a:tools!tool_a_id(id, name, slug, description, logo_url, website_url, website_label, pricing, rating, review_count, features, pros, cons, categories(name)), tool_b:tools!tool_b_id(id, name, slug, description, logo_url, website_url, website_label, pricing, rating, review_count, features, pros, cons, categories(name)), categories(name)")
    .eq("is_published", true)

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.category) {
    query = query.eq("categories.slug", filters.category)
  }

  if (filters?.sort === "popular") {
    query = query.order("views", { ascending: false })
  } else if (filters?.sort === "featured") {
    query = query.eq("is_featured", true).order("views", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch comparisons: ${error.message}`)
  }

  return (data ?? []).map(mapRowToComparisonWithTools)
}

export async function getComparisonBySlug(
  slug: string
): Promise<ComparisonWithTools | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("comparisons")
    .select("*, tool_a:tools!tool_a_id(id, name, slug, description, logo_url, website_url, website_label, pricing, rating, review_count, features, pros, cons, categories(name)), tool_b:tools!tool_b_id(id, name, slug, description, logo_url, website_url, website_label, pricing, rating, review_count, features, pros, cons, categories(name)), categories(name)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(`Failed to fetch comparison: ${error.message}`)
  }

  return mapRowToComparisonWithTools(data)
}

function mapRowToComparisonWithTools(row: any): ComparisonWithTools {
  const mapTool = (t: any) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    logoUrl: t.logo_url,
    websiteUrl: t.website_url,
    websiteLabel: t.website_label ?? "Visit Website",
    pricing: t.pricing,
    rating: t.rating,
    reviewCount: t.review_count,
    features: t.features ?? [],
    pros: t.pros ?? [],
    cons: t.cons ?? [],
    categoryName: t.categories?.name ?? null,
  })

  return {
    ...mapRowToComparison(row),
    toolA: mapTool(row.tool_a),
    toolB: mapTool(row.tool_b),
    categoryName: row.categories?.name ?? null,
  }
}

export async function getFeaturedComparisons(): Promise<ComparisonWithTools[]> {
  return getPublishedComparisons({ sort: "featured" })
}

export async function getPopularComparisons(
  limit = 6
): Promise<ComparisonWithTools[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("comparisons")
    .select("*, tool_a:tools!tool_a_id(id, name, slug, logo_url, pricing, rating, categories(name)), tool_b:tools!tool_b_id(id, name, slug, logo_url, pricing, rating, categories(name)), categories(name)")
    .eq("is_published", true)
    .order("views", { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch popular comparisons: ${error.message}`)
  }

  return (data ?? []).map(mapRowToComparisonWithTools)
}

export async function getSimilarComparisons(
  currentId: string,
  categoryId: string | null,
  limit = 4
): Promise<ComparisonWithTools[]> {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from("comparisons")
    .select("*, tool_a:tools!tool_a_id(id, name, slug, logo_url, pricing, rating, categories(name)), tool_b:tools!tool_b_id(id, name, slug, logo_url, pricing, rating, categories(name)), categories(name)")
    .eq("is_published", true)
    .neq("id", currentId)

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  const { data, error } = await query
    .order("views", { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch similar comparisons: ${error.message}`)
  }

  return (data ?? []).map(mapRowToComparisonWithTools)
}

export async function incrementComparisonViews(
  id: string
): Promise<void> {
  const supabase = await createServerSupabaseClient()

  await (supabase.rpc as any)("increment_comparison_views", {
    comparison_id: id,
  })
}

export async function searchTools(query: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("tools")
    .select("id, name, slug, logo_url, pricing, rating, review_count, features, pros, cons, website_url, categories(name)")
    .eq("is_published", true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order("rating", { ascending: false })
    .limit(10)

  if (error) {
    throw new Error(`Failed to search tools: ${error.message}`)
  }

  return (data ?? []).map((t: any) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    logoUrl: t.logo_url,
    pricing: t.pricing,
    rating: t.rating,
    reviewCount: t.review_count,
    features: t.features ?? [],
    pros: t.pros ?? [],
    cons: t.cons ?? [],
    websiteUrl: t.website_url,
    categoryName: t.categories?.name ?? null,
  }))
}
