import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Category } from "@/types/category"

function mapRowToCategory(row: {
  id: string
  name: string
  slug: string
  description: string
  icon_name: string
  tool_count: number
  created_at: string
  updated_at: string
}): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    iconName: row.icon_name,
    toolCount: row.tool_count,
    createdAt: row.created_at,
  }
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("tool_count", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  return (data ?? []).map(mapRowToCategory)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  slug = slug.toLowerCase()
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(`Failed to fetch category: ${error.message}`)
  }

  return mapRowToCategory(data)
}
