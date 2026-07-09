"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { logAuditEvent } from "@/lib/audit"

async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from("users").select("role").eq("id", userId).single()
  return data?.role === "admin"
}

export async function adminApproveReview(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("reviews").update({ is_approved: true }).eq("id", id)
  await logAuditEvent({ action: "approve", entityType: "review", entityId: id })
  revalidatePath("/linkdit-studio-8k92/reviews")
  return { success: true }
}

export async function adminDeleteReview(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("reviews").delete().eq("id", id)
  await logAuditEvent({ action: "delete", entityType: "review", entityId: id })
  revalidatePath("/linkdit-studio-8k92/reviews")
  return { success: true }
}
