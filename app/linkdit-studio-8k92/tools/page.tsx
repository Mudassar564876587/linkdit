import type { Metadata } from "next"
import { getAdminClient } from "@/lib/supabase/admin"
import AdminToolsClient from "./admin-tools-client"

export const metadata: Metadata = { title: "Tools | Admin | LinkDit" }

export default async function AdminToolsPage() {
  const supabase = getAdminClient()

  const { data: tools, error } = await supabase
    .from("tools")
    .select("id, name, slug, website_url, is_published, featured, rating, review_count, created_at, category_id")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Admin tools fetch error:", error)
  }

  let toolsWithCategories = tools ?? []

  if (tools && tools.length > 0) {
    const { data: categories } = await supabase
      .from("categories")
      .select("id, name")

    const catMap = new Map(categories?.map((c) => [c.id, c.name]) ?? [])
    toolsWithCategories = tools.map((t) => ({
      ...t,
      is_verified: false,
      categories: t.category_id ? { name: catMap.get(t.category_id) ?? null } : null,
    }))
  }

  return <AdminToolsClient tools={toolsWithCategories as any} />
}
