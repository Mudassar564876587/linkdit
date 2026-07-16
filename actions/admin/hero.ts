"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { logAuditEvent } from "@/lib/audit"

export async function adminSaveHero(config: unknown) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") return { error: "Permission denied." }

  const admin = getAdminClient()
  const { error } = await (admin.from("hero_settings") as any).upsert(
    { id: 1, config, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  )

  if (error) {
    console.error("Failed to save hero config:", error)
    return { error: "Failed to save hero configuration." }
  }

  await logAuditEvent({ action: "update", entityType: "hero_settings", metadata: { updated: true } })
  revalidatePath("/")
  revalidatePath("/linkdit-studio-8k92/hero")
  return { success: true }
}
