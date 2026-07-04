"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from("users").select("role").eq("id", userId).single()
  return data?.role === "admin"
}

export async function adminDeleteTool(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }
  await supabase.from("tool_screenshots").delete().eq("tool_id", id)
  await supabase.from("tool_tags").delete().eq("tool_id", id)
  await supabase.from("bookmarks").delete().eq("tool_id", id)
  await supabase.from("reviews").delete().eq("tool_id", id)
  await supabase.from("tools").delete().eq("id", id)
  revalidatePath("/admin/tools")
  return { success: true }
}

export async function adminBulkDeleteTools(ids: string[]) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }
  for (const id of ids) {
    await supabase.from("tool_screenshots").delete().eq("tool_id", id)
    await supabase.from("tool_tags").delete().eq("tool_id", id)
    await supabase.from("bookmarks").delete().eq("tool_id", id)
    await supabase.from("reviews").delete().eq("tool_id", id)
  }
  await supabase.from("tools").delete().in("id", ids)
  revalidatePath("/admin/tools")
  return { success: true }
}

export async function adminTogglePublish(id: string, published: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }
  await supabase.from("tools").update({ is_published: published }).eq("id", id)
  revalidatePath("/admin/tools")
  return { success: true }
}

export async function adminToggleFeatured(id: string, featured: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }
  await supabase.from("tools").update({ featured }).eq("id", id)
  revalidatePath("/admin/tools")
  return { success: true }
}

export async function adminToggleVerified(id: string, verified: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }
  await supabase.from("tools").update({ is_verified: verified }).eq("id", id)
  revalidatePath("/admin/tools")
  return { success: true }
}

export async function adminUpdateTool(id: string, data: any) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }
  const { error } = await supabase.from("tools").update(data).eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/tools")
  return { success: true }
}
