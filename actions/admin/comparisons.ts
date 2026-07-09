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

export async function adminCreateComparison(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const toolAId = formData.get("toolAId") as string
  const toolBId = formData.get("toolBId") as string
  const categoryId = formData.get("categoryId") as string
  const seoTitle = formData.get("seoTitle") as string
  const seoDescription = formData.get("seoDescription") as string
  const published = formData.get("published") === "true"
  const featured = formData.get("featured") === "true"

  if (!title || title.length < 2) return { error: "Title must be at least 2 characters." }
  if (!toolAId || !toolBId) return { error: "Both tools are required." }
  if (toolAId === toolBId) return { error: "Cannot compare a tool with itself." }

  let slug = slugify(title)
  let counter = 1
  while (true) {
    const { data: existing } = await supabase.from("comparisons").select("id").eq("slug", slug).maybeSingle()
    if (!existing) break
    slug = `${slugify(title)}-${counter++}`
  }

  const { data: comparison, error } = await supabase.from("comparisons").insert({
    title,
    slug,
    description,
    tool_a_id: toolAId,
    tool_b_id: toolBId,
    category_id: categoryId || null,
    seo_title: seoTitle || null,
    seo_description: seoDescription || null,
    is_published: published,
    is_featured: featured,
  }).select("id").single()

  if (error) return { error: error.message }
  await logAuditEvent({ action: "create", entityType: "comparison", entityId: comparison?.id, metadata: { title, slug } })
  revalidatePath("/linkdit-studio-8k92/comparisons")
  return { success: true, slug }
}

export async function adminUpdateComparison(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const categoryId = formData.get("categoryId") as string
  const toolAId = formData.get("toolAId") as string
  const toolBId = formData.get("toolBId") as string
  const toolANotes = formData.get("toolANotes") as string
  const toolBNotes = formData.get("toolBNotes") as string
  const seoTitle = formData.get("seoTitle") as string
  const seoDescription = formData.get("seoDescription") as string
  const published = formData.get("published") === "true"
  const featured = formData.get("featured") === "true"

  const prosA = parseArray(formData.get("prosA") as string)
  const prosB = parseArray(formData.get("prosB") as string)
  const consA = parseArray(formData.get("consA") as string)
  const consB = parseArray(formData.get("consB") as string)

  const featuresComparison = parseJson(formData.get("featuresComparison") as string)
  const pricingComparison = parseJson(formData.get("pricingComparison") as string)
  const ratingsComparison = parseJson(formData.get("ratingsComparison") as string)

  const { error } = await supabase.from("comparisons").update({
    title,
    description,
    category_id: categoryId || null,
    tool_a_id: toolAId,
    tool_b_id: toolBId,
    tool_a_notes: toolANotes || "",
    tool_b_notes: toolBNotes || "",
    pros_a: prosA,
    pros_b: prosB,
    cons_a: consA,
    cons_b: consB,
    features_comparison: featuresComparison,
    pricing_comparison: pricingComparison,
    ratings_comparison: ratingsComparison,
    seo_title: seoTitle || null,
    seo_description: seoDescription || null,
    is_published: published,
    is_featured: featured,
  }).eq("id", id)
  if (error) return { error: error.message }
  await logAuditEvent({ action: "update", entityType: "comparison", entityId: id })
  revalidatePath("/linkdit-studio-8k92/comparisons")
  return { success: true }
}

export async function adminDeleteComparison(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  const { data: comparison } = await supabase.from("comparisons").select("title").eq("id", id).single()
  await supabase.from("comparisons").delete().eq("id", id)
  await logAuditEvent({ action: "delete", entityType: "comparison", entityId: id, metadata: { title: comparison?.title } })
  revalidatePath("/linkdit-studio-8k92/comparisons")
  return { success: true }
}

export async function adminToggleComparisonPublish(id: string, isPublished: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("comparisons").update({ is_published: isPublished }).eq("id", id)
  await logAuditEvent({ action: "toggle_publish", entityType: "comparison", entityId: id, metadata: { isPublished } })
  revalidatePath("/linkdit-studio-8k92/comparisons")
  return { success: true }
}

export async function adminToggleComparisonFeatured(id: string, featured: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("comparisons").update({ is_featured: featured }).eq("id", id)
  await logAuditEvent({ action: "toggle_featured", entityType: "comparison", entityId: id, metadata: { featured } })
  revalidatePath("/linkdit-studio-8k92/comparisons")
  return { success: true }
}

function parseArray(value: string): string[] {
  if (!value) return []
  return value.split("\n").map((s) => s.trim()).filter(Boolean)
}

function parseJson(value: string): Record<string, unknown>[] {
  if (!value) return []
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}
