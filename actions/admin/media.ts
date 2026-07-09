"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { logAuditEvent } from "@/lib/audit"

async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from("users").select("role").eq("id", userId).single()
  return data?.role === "admin"
}

export async function adminUploadMedia(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }

  const file = formData.get("file") as File
  if (!file) return { error: "No file provided." }

  const ext = file.name.split(".").pop()
  const path = `admin/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "3600" })
  if (error) return { error: error.message }

  const { data: urlData } = supabase.storage.from("media").getPublicUrl(path)
  revalidatePath("/linkdit-studio-8k92/media")
  return { success: true, url: urlData.publicUrl }
}

export async function adminDeleteMedia(path: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  const { error } = await supabase.storage.from("media").remove([path])
  if (error) return { error: error.message }
  await logAuditEvent({ action: "delete", entityType: "media", metadata: { path } })
  revalidatePath("/linkdit-studio-8k92/media")
  return { success: true }
}
