"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { logAuditEvent } from "@/lib/audit"

async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from("users").select("role").eq("id", userId).single()
  return data?.role === "admin"
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

export async function adminCreateTag(name: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }

  const slug = slugify(name)
  const { data: created, error } = await supabase
    .from("tags")
    .insert({ name, slug })
    .select("id")
    .single()

  if (error) return { error: error.message }

  await logAuditEvent({ action: "create", entityType: "tag", entityId: created.id, metadata: { name } })
  revalidatePath("/linkdit-studio-8k92/tags")
  return { success: true }
}

export async function adminUpdateTag(id: string, name: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }

  const slug = slugify(name)
  const { error } = await supabase.from("tags").update({ name, slug }).eq("id", id)
  if (error) return { error: error.message }

  await logAuditEvent({ action: "update", entityType: "tag", entityId: id, metadata: { name } })
  revalidatePath("/linkdit-studio-8k92/tags")
  return { success: true }
}

export async function adminDeleteTag(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }

  const { data: tag } = await supabase.from("tags").select("name").eq("id", id).single()
  await supabase.from("tool_tags").delete().eq("tag_id", id)
  await supabase.from("tags").delete().eq("id", id)

  await logAuditEvent({ action: "delete", entityType: "tag", entityId: id, metadata: { name: tag?.name } })
  revalidatePath("/linkdit-studio-8k92/tags")
  return { success: true }
}