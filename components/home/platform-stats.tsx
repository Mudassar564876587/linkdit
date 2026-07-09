import { createServerSupabaseClient } from "@/lib/supabase/server"
import PlatformStatsClient from "./platform-stats-client"

export default async function PlatformStats() {
  const supabase = await createServerSupabaseClient()

  const [{ count: toolCount }, { count: reviewCount }, { count: userCount }, { count: categoryCount }] =
    await Promise.all([
      supabase.from("tools").select("*", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_approved", true),
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
    ])

  return <PlatformStatsClient values={[toolCount ?? 0, reviewCount ?? 0, userCount ?? 0, categoryCount ?? 0]} />
}
