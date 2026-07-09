"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { logAuditEvent } from "@/lib/audit"

async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from("users").select("role").eq("id", userId).single()
  return data?.role === "admin"
}

export async function adminUpdateSetting(key: string, value: unknown) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() })
  await logAuditEvent({ action: "update", entityType: "site_setting", metadata: { key } })
  revalidatePath("/linkdit-studio-8k92/settings")
  return { success: true }
}

export async function adminUpdateSettings(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }

  const keys = ["site_name", "site_description", "site_logo", "theme_color", "seo_title", "seo_description", "analytics_code", "social_twitter", "social_github", "social_linkedin"]

  for (const key of keys) {
    const val = formData.get(key)
    if (val !== null) {
      await supabase.from("site_settings").upsert({ key, value: val, updated_at: new Date().toISOString() })
    }
  }

  revalidatePath("/linkdit-studio-8k92/settings")
  return { success: true }
}
