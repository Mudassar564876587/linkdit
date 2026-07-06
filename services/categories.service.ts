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

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  const { data: publishedTools } = await supabase
    .from("tools")
    .select("category_id")
    .eq("is_published", true)

  const countMap: Record<string, number> = {}
  for (const t of publishedTools ?? []) {
    countMap[t.category_id] = (countMap[t.category_id] ?? 0) + 1
  }

  return (categories ?? [])
    .map((row) => ({
      ...mapRowToCategory(row),
      toolCount: countMap[row.id] ?? 0,
    }))
    .sort((a, b) => b.toolCount - a.toolCount)
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

  const { count } = await supabase
    .from("tools")
    .select("*", { count: "exact", head: true })
    .eq("category_id", data.id)
    .eq("is_published", true)

  return { ...mapRowToCategory(data), toolCount: count ?? 0 }
}
