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

export async function adminCreateArticle(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const description = formData.get("description") as string
  const categoryId = formData.get("categoryId") as string
  const coverUrl = formData.get("coverUrl") as string
  const readTime = formData.get("readTime") as string
  const seoTitle = formData.get("seoTitle") as string
  const seoDescription = formData.get("seoDescription") as string
  const tags = (formData.get("tags") as string) || ""
  const published = formData.get("published") === "true"

  if (!title || title.length < 2) return { error: "Title must be at least 2 characters." }

  let slug = slugify(title)
  let counter = 1
  while (true) {
    const { data: existing } = await supabase.from("articles").select("id").eq("slug", slug).maybeSingle()
    if (!existing) break
    slug = `${slugify(title)}-${counter++}`
  }

  const tagsArr = tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []

  const { data: article, error } = await supabase.from("articles").insert({
    title, slug, content, description, category_id: categoryId,
    cover_image_url: coverUrl || null, read_time: readTime || "5 min",
    author_id: user.id, author_name: user.email || "Admin",
    seo_title: seoTitle || null, seo_description: seoDescription || null,
    tags: tagsArr,
    is_published: published, published_at: published ? new Date().toISOString() : null,
  }).select("id").single()

  if (error) return { error: error.message }
  await logAuditEvent({ action: "create", entityType: "article", entityId: article?.id, metadata: { title, slug } })
  revalidatePath("/linkdit-studio-8k92/articles")
  return { success: true, slug }
}

export async function adminUpdateArticle(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }

  const title = formData.get("title") as string | null
  const content = formData.get("content") as string | null
  const description = formData.get("description") as string | null
  const categoryId = formData.get("categoryId") as string | null
  const coverUrl = formData.get("coverUrl") as string | null
  const readTime = formData.get("readTime") as string | null
  const seoTitle = formData.get("seoTitle") as string | null
  const seoDescription = formData.get("seoDescription") as string | null
  const tags = formData.get("tags") as string | null
  const published = formData.get("published") as string | null

  const { error } = await supabase.from("articles").update({
    ...(title ? { title } : {}),
    ...(content ? { content } : {}),
    ...(description ? { description } : {}),
    ...(categoryId ? { category_id: categoryId } : {}),
    ...(coverUrl !== null ? { cover_image_url: coverUrl || null } : {}),
    ...(readTime ? { read_time: readTime } : {}),
    ...(seoTitle ? { seo_title: seoTitle } : {}),
    ...(seoDescription ? { seo_description: seoDescription } : {}),
    ...(tags !== null ? { tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [] } : {}),
    ...(published !== null ? { is_published: published === "true", ...(published === "true" ? { published_at: new Date().toISOString() } : {}) } : {}),
  }).eq("id", id)

  if (error) return { error: error.message }
  await logAuditEvent({ action: "update", entityType: "article", entityId: id })
  revalidatePath("/linkdit-studio-8k92/articles")
  return { success: true }
}

export async function adminDeleteArticle(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  const { data: article } = await supabase.from("articles").select("title").eq("id", id).single()
  await supabase.from("articles").delete().eq("id", id)
  await logAuditEvent({ action: "delete", entityType: "article", entityId: id, metadata: { title: article?.title } })
  revalidatePath("/linkdit-studio-8k92/articles")
  return { success: true }
}

export async function adminToggleArticlePublish(id: string, isPublished: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  const payload = { is_published: isPublished, ...(isPublished ? { published_at: new Date().toISOString() } : {}) }
  await supabase.from("articles").update(payload).eq("id", id)
  await logAuditEvent({ action: "toggle_publish", entityType: "article", entityId: id, metadata: { isPublished } })
  revalidatePath("/linkdit-studio-8k92/articles")
  return { success: true }
}

export async function adminToggleArticleFeatured(id: string, featured: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("articles").update({ featured }).eq("id", id)
  await logAuditEvent({ action: "toggle_featured", entityType: "article", entityId: id, metadata: { featured } })
  revalidatePath("/linkdit-studio-8k92/articles")
  return { success: true }
}
