"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from("users").select("role").eq("id", userId).single()
  return data?.role === "admin"
}

export async function adminApproveReview(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }
  await supabase.from("reviews").update({ is_approved: true }).eq("id", id)
  revalidatePath("/admin/reviews")
  return { success: true }
}

export async function adminDeleteReview(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }
  await supabase.from("reviews").delete().eq("id", id)
  revalidatePath("/admin/reviews")
  return { success: true }
}
