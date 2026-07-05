"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from("users").select("role").eq("id", userId).single()
  return data?.role === "admin"
}

export async function adminUpdateUserRole(id: string, role: "admin" | "user") {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }
  await supabase.from("users").update({ role }).eq("id", id)
  revalidatePath("/admin/users")
  return { success: true }
}

export async function adminDeleteUser(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }
  if (id === user.id) return { error: "Cannot delete yourself." }
  await supabase.from("users").delete().eq("id", id)
  revalidatePath("/admin/users")
  return { success: true }
}

export async function adminBanUser(id: string, banned: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }
  // Soft ban: set role to "banned" if banning, "user" if unbanning
  await supabase.from("users").update({ role: banned ? "banned" as any : "user" as const }).eq("id", id)
  revalidatePath("/admin/users")
  return { success: true }
}
