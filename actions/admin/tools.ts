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

export async function adminUpdateTool(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }

  const updates: any = {}
  const name = formData.get("name") as string
  if (name) updates.name = name
  const description = formData.get("description") as string | null
  if (description !== null) updates.description = description
  const categoryId = formData.get("categoryId") as string | null
  if (categoryId !== null) updates.category_id = categoryId || null
  const websiteUrl = formData.get("websiteUrl") as string | null
  if (websiteUrl !== null) updates.website_url = websiteUrl || null
  const logoUrl = formData.get("logoUrl") as string | null
  if (logoUrl !== null) updates.logo_url = logoUrl || null
  const pricing = formData.get("pricing") as string | null
  if (pricing) updates.pricing = pricing
  const features = formData.get("features") as string | null
  if (features !== null) {
    updates.features = features ? features.split("\n").map((f: string) => f.trim()).filter(Boolean) : []
  }
  const pros = formData.get("pros") as string | null
  if (pros !== null) {
    updates.pros = pros ? pros.split("\n").map((p: string) => p.trim()).filter(Boolean) : []
  }
  const cons = formData.get("cons") as string | null
  if (cons !== null) {
    updates.cons = cons ? cons.split("\n").map((c: string) => c.trim()).filter(Boolean) : []
  }
  const published = formData.get("published") as string | null
  if (published !== null) updates.is_published = published === "true"
  const featured = formData.get("featured") as string | null
  if (featured !== null) updates.featured = featured === "true"
  const sponsored = formData.get("sponsored") as string | null
  if (sponsored !== null) updates.sponsored = sponsored === "true"
  const isVerified = formData.get("isVerified") as string | null
  if (isVerified !== null) updates.is_verified = isVerified === "true"
  const seoTitle = formData.get("seoTitle") as string | null
  if (seoTitle !== null) updates.seo_title = seoTitle || null
  const seoDescription = formData.get("seoDescription") as string | null
  if (seoDescription !== null) updates.seo_description = seoDescription || null

  const { error } = await supabase.from("tools").update(updates).eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/tools")
  return { success: true }
}
