import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import AdminTagsClient from "./admin-tags-client"

export const metadata: Metadata = { title: "Tags | Admin | LinkDit" }

export default async function AdminTagsPage() {
  const admin = getAdminClient()
  const { data: tags } = await admin
    .from("tags")
    .select("id, name, slug, created_at")
    .order("name", { ascending: true })

  const { data: tagCounts } = await admin
    .from("tool_tags")
    .select("tag_id")

  const countMap = new Map<string, number>()
  tagCounts?.forEach((tt) => {
    countMap.set(tt.tag_id, (countMap.get(tt.tag_id) || 0) + 1)
  })

  const tagsWithCounts = (tags ?? []).map((t) => ({
    ...t,
    tool_count: countMap.get(t.id) || 0,
  }))

  return <AdminTagsClient tags={tagsWithCounts} />
}