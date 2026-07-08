"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from("users").select("role").eq("id", userId).single()
  return data?.role === "admin"
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

export async function adminCreateResource(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const content = formData.get("content") as string
  const categoryId = formData.get("categoryId") as string
  const websiteUrl = formData.get("websiteUrl") as string
  const downloadUrl = formData.get("downloadUrl") as string
  const coverUrl = formData.get("coverUrl") as string
  const pricing = formData.get("pricing") as string
  const features = (formData.get("features") as string) || ""
  const tags = (formData.get("tags") as string) || ""
  const published = formData.get("published") === "true"
  const featured = formData.get("featured") === "true"

  if (!name || name.length < 2) return { error: "Name must be at least 2 characters." }

  let slug = slugify(name)
  let counter = 1
  while (true) {
    const { data: existing } = await supabase.from("resources").select("id").eq("slug", slug).maybeSingle()
    if (!existing) break
    slug = `${slugify(name)}-${counter++}`
  }

  const featuresArr = features ? features.split("\n").map((f: string) => f.trim()).filter(Boolean) : []
  const tagsArr = tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []

  const { error } = await supabase.from("resources").insert({
    name, slug, description, content,
    category_id: categoryId || null,
    website_url: websiteUrl || null,
    download_url: downloadUrl || null,
    cover_image_url: coverUrl || null,
    pricing: pricing || "Free",
    features: featuresArr,
    tags: tagsArr,
    is_published: published,
    featured,
  })

  if (error) return { error: error.message }
  revalidatePath("/linkdit-studio-8k92/resources")
  return { success: true, slug }
}

export async function adminUpdateResource(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }

  const name = formData.get("name") as string | null
  const description = formData.get("description") as string | null
  const content = formData.get("content") as string | null
  const categoryId = formData.get("categoryId") as string | null
  const websiteUrl = formData.get("websiteUrl") as string | null
  const downloadUrl = formData.get("downloadUrl") as string | null
  const coverUrl = formData.get("coverUrl") as string | null
  const pricing = formData.get("pricing") as string | null
  const features = formData.get("features") as string | null
  const tags = formData.get("tags") as string | null
  const published = formData.get("published") as string | null
  const featured = formData.get("featured") as string | null

  const { error } = await supabase.from("resources").update({
    ...(name ? { name } : {}),
    ...(description !== null ? { description } : {}),
    ...(content !== null ? { content } : {}),
    ...(categoryId !== null ? { category_id: categoryId || null } : {}),
    ...(websiteUrl !== null ? { website_url: websiteUrl || null } : {}),
    ...(downloadUrl !== null ? { download_url: downloadUrl || null } : {}),
    ...(coverUrl !== null ? { cover_image_url: coverUrl || null } : {}),
    ...(pricing ? { pricing } : {}),
    ...(features !== null ? { features: features ? features.split("\n").map((f) => f.trim()).filter(Boolean) : [] } : {}),
    ...(tags !== null ? { tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [] } : {}),
    ...(published !== null ? { is_published: published === "true" } : {}),
    ...(featured !== null ? { featured: featured === "true" } : {}),
  }).eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/linkdit-studio-8k92/resources")
  return { success: true }
}

export async function adminDeleteResource(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("resources").delete().eq("id", id)
  revalidatePath("/linkdit-studio-8k92/resources")
  return { success: true }
}

export async function adminToggleResourcePublish(id: string, isPublished: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("resources").update({ is_published: isPublished }).eq("id", id)
  revalidatePath("/linkdit-studio-8k92/resources")
  return { success: true }
}

export async function adminToggleResourceFeatured(id: string, featured: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("resources").update({ featured }).eq("id", id)
  revalidatePath("/linkdit-studio-8k92/resources")
  return { success: true }
}
