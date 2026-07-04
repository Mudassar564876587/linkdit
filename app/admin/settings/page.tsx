import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import AdminSettingsClient from "./admin-settings-client"

export const metadata: Metadata = { title: "Settings | Admin | LinkDit" }

export default async function AdminSettingsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: settings } = await supabase.from("site_settings").select("*")
  const map: Record<string, string> = {}
  for (const s of settings ?? []) {
    map[s.key] = typeof s.value === "string" ? s.value : JSON.stringify(s.value)
  }

  return <AdminSettingsClient initial={map} />
}
