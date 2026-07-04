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

export async function adminCreateArticle(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const description = formData.get("description") as string
  const categoryId = formData.get("categoryId") as string
  const coverUrl = formData.get("coverUrl") as string
  const readTime = formData.get("readTime") as string
  const seoTitle = formData.get("seoTitle") as string
  const seoDescription = formData.get("seoDescription") as string
  const published = formData.get("published") === "true"

  if (!title || title.length < 2) return { error: "Title must be at least 2 characters." }

  let slug = slugify(title)
  let counter = 1
  while (true) {
    const { data: existing } = await supabase.from("articles").select("id").eq("slug", slug).maybeSingle()
    if (!existing) break
    slug = `${slugify(title)}-${counter++}`
  }

  const { error } = await supabase.from("articles").insert({
    title, slug, content, description, category_id: categoryId,
    cover_image_url: coverUrl || null, read_time: readTime || "5 min",
    author_id: user.id, author_name: user.email || "Admin",
    seo_title: seoTitle || null, seo_description: seoDescription || null,
    is_published: published, published_at: published ? new Date().toISOString() : null,
  })

  if (error) return { error: error.message }
  revalidatePath("/admin/articles")
  return { success: true, slug }
}

export async function adminUpdateArticle(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }

  const updates: any = {}
  const title = formData.get("title")
  if (title) updates.title = title
  const content = formData.get("content")
  if (content) updates.content = content
  const description = formData.get("description")
  if (description) updates.description = description
  const categoryId = formData.get("categoryId")
  if (categoryId) updates.category_id = categoryId
  const coverUrl = formData.get("coverUrl")
  if (coverUrl) updates.cover_image_url = coverUrl
  const readTime = formData.get("readTime")
  if (readTime) updates.read_time = readTime
  const seoTitle = formData.get("seoTitle")
  if (seoTitle) updates.seo_title = seoTitle
  const seoDescription = formData.get("seoDescription")
  if (seoDescription) updates.seo_description = seoDescription
  const published = formData.get("published")
  if (published !== null) {
    updates.is_published = published === "true"
    if (published === "true") updates.published_at = new Date().toISOString()
  }

  const { error } = await supabase.from("articles").update(updates).eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/articles")
  return { success: true }
}

export async function adminDeleteArticle(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Not authorized." }
  await supabase.from("articles").delete().eq("id", id)
  revalidatePath("/admin/articles")
  return { success: true }
}
