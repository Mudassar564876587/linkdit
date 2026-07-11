import type { Metadata } from "next"
import { getAdminClient } from "@/lib/supabase/admin"
import AdminToolsClient from "./admin-tools-client"

export const metadata: Metadata = { title: "Tools | Admin | LinkDit" }

export default async function AdminToolsPage() {
  const supabase = getAdminClient()
  const { data: tools } = await supabase
    .from("tools")
    .select("id, name, slug, website_url, is_published, featured, is_verified, rating, review_count, created_at, categories(name)")
    .order("created_at", { ascending: false })

  return <AdminToolsClient tools={tools ?? []} />
}
