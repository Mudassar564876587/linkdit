"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { logAuditEvent } from "@/lib/audit"

async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from("users").select("role").eq("id", userId).single()
  return data?.role === "admin"
}

export async function adminCreateCategory(data: { name: string; slug: string; description: string; icon_name: string }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  const { data: category, error } = await supabase.from("categories").insert(data).select("id").single()
  if (error) return { error: error.message }
  await logAuditEvent({ action: "create", entityType: "category", entityId: category?.id, metadata: { name: data.name, slug: data.slug } })
  revalidatePath("/linkdit-studio-8k92/categories")
  return { success: true }
}

export async function adminUpdateCategory(id: string, data: { name?: string; slug?: string; description?: string; icon_name?: string }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  const { error } = await supabase.from("categories").update(data).eq("id", id)
  if (error) return { error: error.message }
  await logAuditEvent({ action: "update", entityType: "category", entityId: id, metadata: { name: data.name } })
  revalidatePath("/linkdit-studio-8k92/categories")
  return { success: true }
}

export async function adminDeleteCategory(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  const { data: category } = await supabase.from("categories").select("name").eq("id", id).single()
  await supabase.from("tools").update({ category_id: null as unknown as undefined }).eq("category_id", id)
  await supabase.from("categories").delete().eq("id", id)
  await logAuditEvent({ action: "delete", entityType: "category", entityId: id, metadata: { name: category?.name } })
  revalidatePath("/linkdit-studio-8k92/categories")
  return { success: true }
}
