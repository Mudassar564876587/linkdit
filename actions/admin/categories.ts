"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from("users").select("role").eq("id", userId).single()
  return data?.role === "admin"
}

export async function adminCreateCategory(data: { name: string; slug: string; description: string; icon_name: string }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }
  const { error } = await supabase.from("categories").insert(data)
  if (error) return { error: error.message }
  revalidatePath("/admin/categories")
  return { success: true }
}

export async function adminUpdateCategory(id: string, data: { name?: string; slug?: string; description?: string; icon_name?: string }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }
  const { error } = await supabase.from("categories").update(data).eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/categories")
  return { success: true }
}

export async function adminDeleteCategory(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }
  await supabase.from("tools").update({ category_id: null as any }).eq("category_id", id)
  await supabase.from("categories").delete().eq("id", id)
  revalidatePath("/admin/categories")
  return { success: true }
}
