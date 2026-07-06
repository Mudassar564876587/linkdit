import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function AnalyticsScript() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "analytics_code")
    .single()

  const code = data?.value as string | null
  if (!code) return null

  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      id="analytics-script"
    />
  )
}
