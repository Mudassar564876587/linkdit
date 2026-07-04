import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import AdminToolsClient from "./admin-tools-client"

export const metadata: Metadata = { title: "Tools | Admin | LinkDit" }

export default async function AdminToolsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: tools } = await supabase
    .from("tools")
    .select("*, categories(name)")
    .order("created_at", { ascending: false })

  return <AdminToolsClient tools={tools ?? []} />
}
