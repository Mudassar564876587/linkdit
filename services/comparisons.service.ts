/* eslint-disable @typescript-eslint/no-explicit-any */

import { createServerSupabaseClient } from "@/lib/supabase/server"
import type {
  Comparison, ComparisonFilters, ComparisonWithTools,
  ToolSummary, UseCase, UseCaseResult, WinnerResult,
} from "@/types/comparison"

function mapToolSummary(t: any): ToolSummary {
  return {
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description || "",
    logoUrl: t.logo_url || null,
    websiteUrl: t.website_url || "",
    websiteLabel: "Visit Website",
    pricing: t.pricing || "Free",
    rating: t.rating || 0,
    reviewCount: t.review_count || 0,
    features: t.features ?? [],
    pros: t.pros ?? [],
    cons: t.cons ?? [],
    platforms: ["Web"],
    categoryId: t.category_id || null,
    categoryName: t.categories?.name ?? null,

  }
}

function mapRowToComparison(row: any): Comparison {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description || "",
    toolAId: row.tool_a_id,
    toolBId: row.tool_b_id,
    categoryId: row.category_id || null,
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
    status: "prebuilt",
  }
}

function mapRowToComparisonWithTools(row: any): ComparisonWithTools {
  return {
    ...mapRowToComparison(row),
    toolA: mapToolSummary(row.tool_a),
    toolB: mapToolSummary(row.tool_b),
    categoryName: row.categories?.name ?? null,
  }
}

const TOOL_SELECT = `
  id, name, slug, description, logo_url, website_url,
  pricing, rating, review_count, features, pros, cons,
  category_id, categories(name)
`

export async function getPublishedComparisons(
  filters?: ComparisonFilters
): Promise<ComparisonWithTools[]> {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from("comparisons")
    .select(`*, tool_a:tools!tool_a_id(${TOOL_SELECT}), tool_b:tools!tool_b_id(${TOOL_SELECT}), categories(name)`)
    .eq("is_published", true)

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  if (filters?.category) {
    query = query.eq("categories.slug", filters.category.toLowerCase())
  }
  if (filters?.sort === "popular") {
    query = query.order("views", { ascending: false })
  } else if (filters?.sort === "featured") {
    query = query.eq("is_featured", true).order("views", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch comparisons: ${error.message}`)
  return (data ?? []).map(mapRowToComparisonWithTools)
}

export async function getComparisonBySlug(
  slug: string
): Promise<ComparisonWithTools | null> {
  slug = slug.toLowerCase()
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("comparisons")
    .select(`*, tool_a:tools!tool_a_id(${TOOL_SELECT}), tool_b:tools!tool_b_id(${TOOL_SELECT}), categories(name)`)
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(`Failed to fetch comparison: ${error.message}`)
  }
  return mapRowToComparisonWithTools(data)
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
    .select(`*, tool_a:tools!tool_a_id(id, name, slug, logo_url, pricing, rating, review_count, categories(name)), tool_b:tools!tool_b_id(id, name, slug, logo_url, pricing, rating, review_count, categories(name)), categories(name)`)
    .eq("is_published", true)
    .order("views", { ascending: false })
    .limit(limit)
  if (error) throw new Error(`Failed to fetch popular comparisons: ${error.message}`)
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
    .select(`*, tool_a:tools!tool_a_id(id, name, slug, logo_url, pricing, rating, review_count, categories(name)), tool_b:tools!tool_b_id(id, name, slug, logo_url, pricing, rating, review_count, categories(name)), categories(name)`)
    .eq("is_published", true)
    .neq("id", currentId)
  if (categoryId) query = query.eq("category_id", categoryId)
  const { data, error } = await query
    .order("views", { ascending: false })
    .limit(limit)
  if (error) throw new Error(`Failed to fetch similar comparisons: ${error.message}`)
  return (data ?? []).map(mapRowToComparisonWithTools)
}

export async function incrementComparisonViews(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  await (supabase.rpc as any)("increment_comparison_views", { comparison_id: id })
}

export async function searchTools(query: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("tools")
    .select(`id, name, slug, logo_url, pricing, rating, review_count, features, pros, cons, website_url, category_id, categories(name)`)
    .eq("is_published", true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order("rating", { ascending: false })
    .limit(10)
  if (error) throw new Error(`Failed to search tools: ${error.message}`)
  return (data ?? []).map((t: any) => mapToolSummary(t))
}

export async function generateAutoComparison(slug: string): Promise<ComparisonWithTools | null> {
  const parts = slug.split("-vs-")
  if (parts.length !== 2) return null

  const toolASlug = parts[0]
  const toolBSlug = parts[1]

  const supabase = await createServerSupabaseClient()
  const { data: tools, error } = await supabase
    .from("tools")
    .select(`${TOOL_SELECT}`)
    .in("slug", [toolASlug, toolBSlug])
    .eq("is_published", true)

  if (error || !tools || tools.length !== 2) return null

  const toolA = tools.find((t: any) => t.slug === toolASlug)
  const toolB = tools.find((t: any) => t.slug === toolBSlug)
  if (!toolA || !toolB) return null

  const featuresComp = buildFeaturesComparison(toolA, toolB)
  const pricingComp = buildPricingComparison(toolA, toolB)
  const ratingsComp = buildRatingsComparison(toolA, toolB)

  const now = new Date().toISOString()

  return {
    id: `auto_${slug}`,
    slug,
    title: `${toolA.name} vs ${toolB.name}`,
    description: `Compare ${toolA.name} vs ${toolB.name}: features, pricing, ratings, pros, cons and more. Make an informed decision.`,
    toolAId: toolA.id,
    toolBId: toolB.id,
    categoryId: toolA.category_id === toolB.category_id ? toolA.category_id : null,
    toolANotes: "",
    toolBNotes: "",
    prosA: toolA.pros ?? [],
    prosB: toolB.pros ?? [],
    consA: toolA.cons ?? [],
    consB: toolB.cons ?? [],
    featuresComparison: featuresComp,
    pricingComparison: pricingComp,
    ratingsComparison: ratingsComp,
    views: 0,
    isFeatured: false,
    isPublished: true,
    seoTitle: null,
    seoDescription: null,
    createdAt: now,
    updatedAt: now,
    status: "auto",
    toolA: mapToolSummary(toolA),
    toolB: mapToolSummary(toolB),
    categoryName: toolA.categories?.name || toolB.categories?.name || null,
  }
}

function buildFeaturesComparison(toolA: any, toolB: any) {
  const allFeatures = new Set<string>()
  for (const f of (toolA.features ?? [])) allFeatures.add(f)
  for (const f of (toolB.features ?? [])) allFeatures.add(f)

  return Array.from(allFeatures).map((name) => ({
    name,
    toolAValue: (toolA.features ?? []).includes(name) ? true : false,
    toolBValue: (toolB.features ?? []).includes(name) ? true : false,
  }))
}

function buildPricingComparison(toolA: any, toolB: any) {
  const items: { aspect: string; toolAValue: string | number; toolBValue: string | number }[] = [
    { aspect: "Plan", toolAValue: toolA.pricing || "Free", toolBValue: toolB.pricing || "Free" },
  ]
  return items
}

function buildRatingsComparison(toolA: any, toolB: any) {
  return [
    { aspect: "Overall", toolARating: toolA.rating || 0, toolBRating: toolB.rating || 0 },
  ]
}

export function determineWinners(comparison: ComparisonWithTools): WinnerResult[] {
  const { toolA, toolB, featuresComparison, ratingsComparison } = comparison
  const results: WinnerResult[] = []

  const ratingWinner = toolA.rating > toolB.rating ? "A" as const : toolB.rating > toolA.rating ? "B" as const : "tie" as const
  results.push({
    section: "ratings",
    label: "Better Ratings",
    winner: ratingWinner,
    reason: ratingWinner === "tie" ? "Both tools have equal ratings."
      : `${ratingWinner === "A" ? toolA.name : toolB.name} has a higher overall rating.`,
  })

  const pricingOrder = { Free: 0, Freemium: 1, Paid: 2 }
  const aVal = pricingOrder[toolA.pricing as keyof typeof pricingOrder] ?? 1
  const bVal = pricingOrder[toolB.pricing as keyof typeof pricingOrder] ?? 1
  const pricingWinner = aVal < bVal ? "A" as const : bVal < aVal ? "B" as const : "tie" as const
  results.push({
    section: "pricing",
    label: "Better Pricing",
    winner: pricingWinner,
    reason: pricingWinner === "tie" ? "Both tools have similar pricing models."
      : `${pricingWinner === "A" ? toolA.name : toolB.name} is more affordable.`,
  })

  const aFeatures = featuresComparison.filter((f) => f.toolAValue === true || String(f.toolAValue).toLowerCase() === "yes").length
  const bFeatures = featuresComparison.filter((f) => f.toolBValue === true || String(f.toolBValue).toLowerCase() === "yes").length
  const featuresWinner = aFeatures > bFeatures ? "A" as const : bFeatures > aFeatures ? "B" as const : "tie" as const
  results.push({
    section: "features",
    label: "More Features",
    winner: featuresWinner,
    reason: featuresWinner === "tie" ? "Both tools offer a similar number of features."
      : `${featuresWinner === "A" ? toolA.name : toolB.name} offers more features.`,
  })

  if (ratingsComparison.length > 1) {
    const aTotal = ratingsComparison.reduce((s, r) => s + r.toolARating, 0)
    const bTotal = ratingsComparison.reduce((s, r) => s + r.toolBRating, 0)
    const avgWinner = aTotal > bTotal ? "A" as const : bTotal > aTotal ? "B" as const : "tie" as const
    results.push({
      section: "quality",
      label: "Better Quality",
      winner: avgWinner,
      reason: avgWinner === "tie" ? "Both tools have similar quality ratings."
        : `${avgWinner === "A" ? toolA.name : toolB.name} scores higher across rating categories.`,
    })
  }

  if (toolA.reviewCount > 0 || toolB.reviewCount > 0) {
    const reviewsWinner = toolA.reviewCount > toolB.reviewCount ? "A" as const : toolB.reviewCount > toolA.reviewCount ? "B" as const : "tie" as const
    results.push({
      section: "popularity",
      label: "More Popular",
      winner: reviewsWinner,
      reason: reviewsWinner === "tie" ? "Both tools have similar adoption."
        : `${reviewsWinner === "A" ? toolA.name : toolB.name} has more user reviews.`,
    })
  }

  return results
}

export function generateUseCaseSummary(comparison: ComparisonWithTools): UseCaseResult[] {
  const { toolA, toolB } = comparison
  const results: UseCaseResult[] = []

  const useCases: { useCase: UseCase; label: string; checkA: string[]; checkB: string[] }[] = [
    {
      useCase: "students",
      label: "Students",
      checkA: [toolA.pricing === "Free" ? "free" : "", ...toolA.features],
      checkB: [toolB.pricing === "Free" ? "free" : "", ...toolB.features],
    },
    {
      useCase: "developers",
      label: "Developers",
      checkA: toolA.features,
      checkB: toolB.features,
    },
    {
      useCase: "businesses",
      label: "Businesses",
      checkA: toolA.features,
      checkB: toolB.features,
    },
    {
      useCase: "marketing",
      label: "Marketing",
      checkA: toolA.features,
      checkB: toolB.features,
    },
    {
      useCase: "content-creation",
      label: "Content Creation",
      checkA: toolA.features,
      checkB: toolB.features,
    },
    {
      useCase: "design",
      label: "Design",
      checkA: toolA.features,
      checkB: toolB.features,
    },
    {
      useCase: "video",
      label: "Video",
      checkA: toolA.features,
      checkB: toolB.features,
    },
    {
      useCase: "coding",
      label: "Coding",
      checkA: toolA.features,
      checkB: toolB.features,
    },
    {
      useCase: "research",
      label: "Research",
      checkA: toolA.features,
      checkB: toolB.features,
    },
  ]

  for (const uc of useCases) {
    const aRelevance = uc.checkA.filter(Boolean).length
    const bRelevance = uc.checkB.filter(Boolean).length
    const winner = aRelevance > bRelevance ? "A" as const : bRelevance > aRelevance ? "B" as const : "tie" as const
    results.push({
      useCase: uc.useCase,
      label: uc.label,
      winner,
      reason: winner === "tie"
        ? `Both ${toolA.name} and ${toolB.name} are equally suitable for ${uc.label.toLowerCase()}.`
        : `${winner === "A" ? toolA.name : toolB.name} is better for ${uc.label.toLowerCase()}.`,
    })
  }

  return results
}

export async function searchComparisons(query: string): Promise<{ comparisons: ComparisonWithTools[]; tools: ToolSummary[] }> {
  const [comparisons, tools] = await Promise.all([
    getPublishedComparisons({ search: query, sort: "popular" }),
    searchTools(query),
  ])
  return { comparisons, tools }
}

export async function getTrendingComparisons(limit = 6): Promise<ComparisonWithTools[]> {
  return getPopularComparisons(limit)
}

export async function getRelatedComparisons(
  currentSlug: string,
  toolAId: string,
  toolBId: string,
  limit = 4
): Promise<ComparisonWithTools[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("comparisons")
    .select(`*, tool_a:tools!tool_a_id(id, name, slug, logo_url, pricing, rating, review_count, categories(name)), tool_b:tools!tool_b_id(id, name, slug, logo_url, pricing, rating, review_count, categories(name)), categories(name)`)
    .eq("is_published", true)
    .neq("slug", currentSlug)
    .or(`tool_a_id.eq.${toolAId},tool_a_id.eq.${toolBId},tool_b_id.eq.${toolAId},tool_b_id.eq.${toolBId}`)
    .order("views", { ascending: false })
    .limit(limit)
  if (error) throw new Error(`Failed to fetch related comparisons: ${error.message}`)
  return (data ?? []).map(mapRowToComparisonWithTools)
}

export async function createComparisonFromSlug(
  toolASlug: string,
  toolBSlug: string
): Promise<string | null> {
  const slug = `${toolASlug}-vs-${toolBSlug}`
  const existing = await getComparisonBySlug(slug)
  if (existing) return slug

  const supabase = await createServerSupabaseClient()
  const { data: tools } = await supabase
    .from("tools")
    .select("id, name, slug")
    .in("slug", [toolASlug, toolBSlug])
    .eq("is_published", true)

  if (!tools || tools.length !== 2) return null

  const toolA = tools.find((t: any) => t.slug === toolASlug)
  const toolB = tools.find((t: any) => t.slug === toolBSlug)
  if (!toolA || !toolB) return null

  const title = `${toolA.name} vs ${toolB.name}`
  const description = `Compare ${toolA.name} vs ${toolB.name}: features, pricing, ratings, and more.`

  const categoryCheck = await supabase
    .from("tools")
    .select("category_id")
    .in("id", [toolA.id, toolB.id])

  const categoryIds = [...new Set((categoryCheck.data ?? []).map((t: any) => t.category_id))]
  const categoryId = categoryIds.length === 1 ? categoryIds[0] : null

  const { error } = await supabase.from("comparisons").insert({
    slug,
    title,
    description,
    tool_a_id: toolA.id,
    tool_b_id: toolB.id,
    category_id: categoryId,
    is_published: true,
    is_featured: false,
    views: 0,
    pros_a: [],
    pros_b: [],
    cons_a: [],
    cons_b: [],
    features_comparison: [],
    pricing_comparison: [],
    ratings_comparison: [],
  })

  if (error) {
    if (error.code === "23505") return slug
    return null
  }

  return slug
}
