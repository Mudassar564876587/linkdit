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

  const updates: any = {}
  const name = formData.get("name")
  if (name) updates.name = name
  const description = formData.get("description") as string | null
  if (description !== null) updates.description = description
  const content = formData.get("content") as string | null
  if (content !== null) updates.content = content
  const categoryId = formData.get("categoryId") as string | null
  if (categoryId !== null) updates.category_id = categoryId || null
  const websiteUrl = formData.get("websiteUrl") as string | null
  if (websiteUrl !== null) updates.website_url = websiteUrl || null
  const downloadUrl = formData.get("downloadUrl") as string | null
  if (downloadUrl !== null) updates.download_url = downloadUrl || null
  const coverUrl = formData.get("coverUrl") as string | null
  if (coverUrl !== null) updates.cover_image_url = coverUrl || null
  const pricing = formData.get("pricing") as string | null
  if (pricing) updates.pricing = pricing
  const features = formData.get("features") as string | null
  if (features !== null) {
    updates.features = features ? features.split("\n").map((f: string) => f.trim()).filter(Boolean) : []
  }
  const tags = formData.get("tags") as string | null
  if (tags !== null) {
    updates.tags = tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []
  }
  const published = formData.get("published") as string | null
  if (published !== null) {
    updates.is_published = published === "true"
  }
  const featured = formData.get("featured") as string | null
  if (featured !== null) {
    updates.featured = featured === "true"
  }

  const { error } = await supabase.from("resources").update(updates).eq("id", id)
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
  await supabase.from("resources").update({ is_published: isPublished } as any).eq("id", id)
  revalidatePath("/linkdit-studio-8k92/resources")
  return { success: true }
}

export async function adminToggleResourceFeatured(id: string, featured: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("resources").update({ featured } as any).eq("id", id)
  revalidatePath("/linkdit-studio-8k92/resources")
  return { success: true }
}
