"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { logAuditEvent } from "@/lib/audit"

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from("users").select("role").eq("id", userId).single()
  return data?.role === "admin"
}

async function uploadFile(bucket: string, file: File, userId: string): Promise<string> {
  const supabase = await createServerSupabaseClient()
  const ext = file.name.split(".").pop()
  const path = `admin/${userId}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: "3600" })
  if (error) throw new Error(error.message)
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
  return urlData.publicUrl
}

async function upsertTags(tagNames: string[], toolId: string) {
  if (tagNames.length === 0) return
  const supabase = await createServerSupabaseClient()

  for (const raw of tagNames) {
    const name = raw.trim()
    if (!name) continue

    const { data: existing } = await supabase
      .from("tags")
      .select("id")
      .eq("name", name)
      .maybeSingle()

    let tagId = existing?.id
    if (!tagId) {
      const { data: inserted } = await supabase
        .from("tags")
        .insert({ name, slug: slugify(name) })
        .select("id")
        .single()
      tagId = inserted?.id
    }

    if (tagId) {
      const { error: ttErr } = await supabase
        .from("tool_tags")
        .insert({ tool_id: toolId, tag_id: tagId })
      if (ttErr && ttErr.code !== "23505") {
        console.error("Failed to link tag:", ttErr)
      }
    }
  }
}

export type AdminToolResult = { success: true; slug?: string } | { error: string }

export async function adminCreateTool(formData: FormData): Promise<AdminToolResult> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }

  const name = (formData.get("name") as string)?.trim()
  const description = (formData.get("description") as string)?.trim()
  const categoryId = (formData.get("categoryId") as string)?.trim()
  const websiteUrl = (formData.get("websiteUrl") as string)?.trim()
  const pricing = (formData.get("pricing") as string)?.trim() || "Free"
  const seoTitle = (formData.get("seoTitle") as string)?.trim()
  const seoDescription = (formData.get("seoDescription") as string)?.trim()
  const published = formData.get("published") === "true"
  const featured = formData.get("featured") === "true"
  const sponsored = formData.get("sponsored") === "true"
  const isVerified = formData.get("isVerified") === "true"

  const featuresRaw = (formData.get("features") as string) || ""
  const prosRaw = (formData.get("pros") as string) || ""
  const consRaw = (formData.get("cons") as string) || ""
  const tagsRaw = (formData.get("tags") as string) || ""

  if (!name || name.length < 2) return { error: "Name must be at least 2 characters." }
  if (!categoryId) return { error: "Category is required." }
  if (!websiteUrl) return { error: "Website URL is required." }
  if (!isValidUrl(websiteUrl)) return { error: "Website URL is not valid." }

  const validPricings = ["Free", "Freemium", "Paid"] as const
  if (!validPricings.includes(pricing as "Free" | "Freemium" | "Paid")) return { error: "Invalid pricing value." }

  const featuresArr = featuresRaw.split("\n").map((f) => f.trim()).filter(Boolean)
  const prosArr = prosRaw.split("\n").map((p) => p.trim()).filter(Boolean)
  const consArr = consRaw.split("\n").map((c) => c.trim()).filter(Boolean)
  const tagNames = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)

  let slug = slugify(name)
  let counter = 1
  while (true) {
    const { data: existing } = await supabase.from("tools").select("id").eq("slug", slug).maybeSingle()
    if (!existing) break
    slug = `${slugify(name)}-${counter++}`
  }

  let logoUrl: string | null = null
  const logoField = formData.get("logoUrl") as string | null
  const logoFile = formData.get("logoFile")

  if (logoFile instanceof File && logoFile.size > 0) {
    try {
      logoUrl = await uploadFile("tool-logos", logoFile, user.id)
    } catch {
      return { error: "Failed to upload logo." }
    }
  } else if (logoField?.trim()) {
    logoUrl = logoField.trim()
  }

  const { data: insertedTool, error } = await supabase
    .from("tools")
    .insert({
      name,
      slug,
      description: description || "",
      category_id: categoryId,
      website_url: websiteUrl,
      logo_url: logoUrl,
      pricing: pricing as "Free" | "Freemium" | "Paid",
      features: featuresArr,
      pros: prosArr,
      cons: consArr,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      is_published: published,
      featured,
      sponsored,
      is_verified: isVerified,
    })
    .select("id")
    .single()

  if (error) return { error: error.message }

  const toolId = insertedTool.id

  if (tagNames.length > 0) {
    await upsertTags(tagNames, toolId)
  }

  const screenshotFiles = formData.getAll("screenshotFiles") as File[]
  if (screenshotFiles.length > 0) {
    const screenshotUrls: { url: string; alt: string; sort_order: number }[] = []
    for (let i = 0; i < screenshotFiles.length; i++) {
      const file = screenshotFiles[i]
      if (file instanceof File && file.size > 0) {
        try {
          const url = await uploadFile("tool-galleries", file, user.id)
          screenshotUrls.push({ url, alt: `${name} screenshot ${i + 1}`, sort_order: i })
        } catch {
          continue
        }
      }
    }
    if (screenshotUrls.length > 0) {
      await supabase.from("tool_screenshots").insert(
        screenshotUrls.map((s) => ({ tool_id: toolId, ...s }))
      )
    }
  }

  await logAuditEvent({ action: "create", entityType: "tool", entityId: toolId, metadata: { name, slug } })
  revalidatePath("/linkdit-studio-8k92/tools")
  revalidatePath("/tools")
  return { success: true, slug }
}

export async function adminDeleteTool(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  const { data: tool } = await supabase.from("tools").select("name").eq("id", id).single()
  await supabase.from("tool_screenshots").delete().eq("tool_id", id)
  await supabase.from("tool_tags").delete().eq("tool_id", id)
  await supabase.from("bookmarks").delete().eq("tool_id", id)
  await supabase.from("reviews").delete().eq("tool_id", id)
  await supabase.from("tools").delete().eq("id", id)
  await logAuditEvent({ action: "delete", entityType: "tool", entityId: id, metadata: { name: tool?.name } })
  revalidatePath("/linkdit-studio-8k92/tools")
  return { success: true }
}

export async function adminBulkDeleteTools(ids: string[]) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  for (const id of ids) {
    await supabase.from("tool_screenshots").delete().eq("tool_id", id)
    await supabase.from("tool_tags").delete().eq("tool_id", id)
    await supabase.from("bookmarks").delete().eq("tool_id", id)
    await supabase.from("reviews").delete().eq("tool_id", id)
  }
  await supabase.from("tools").delete().in("id", ids)
  await logAuditEvent({ action: "bulk_delete", entityType: "tool", metadata: { count: ids.length } })
  revalidatePath("/linkdit-studio-8k92/tools")
  return { success: true }
}

export async function adminTogglePublish(id: string, published: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("tools").update({ is_published: published }).eq("id", id)
  await logAuditEvent({ action: "toggle_publish", entityType: "tool", entityId: id, metadata: { published } })
  revalidatePath("/linkdit-studio-8k92/tools")
  return { success: true }
}

export async function adminToggleFeatured(id: string, featured: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("tools").update({ featured }).eq("id", id)
  await logAuditEvent({ action: "toggle_featured", entityType: "tool", entityId: id, metadata: { featured } })
  revalidatePath("/linkdit-studio-8k92/tools")
  return { success: true }
}

export async function adminToggleVerified(id: string, verified: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("tools").update({ is_verified: verified }).eq("id", id)
  await logAuditEvent({ action: "toggle_verified", entityType: "tool", entityId: id, metadata: { verified } })
  revalidatePath("/linkdit-studio-8k92/tools")
  return { success: true }
}

export async function adminBulkVerify(ids: string[]) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("tools").update({ is_verified: true }).in("id", ids)
  await logAuditEvent({ action: "bulk_verify", entityType: "tool", metadata: { count: ids.length } })
  revalidatePath("/linkdit-studio-8k92/tools")
  return { success: true }
}

export async function adminBulkUnverify(ids: string[]) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("tools").update({ is_verified: false }).in("id", ids)
  await logAuditEvent({ action: "bulk_unverify", entityType: "tool", metadata: { count: ids.length } })
  revalidatePath("/linkdit-studio-8k92/tools")
  return { success: true }
}

export async function adminBulkFeature(ids: string[]) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("tools").update({ featured: true }).in("id", ids)
  await logAuditEvent({ action: "bulk_feature", entityType: "tool", metadata: { count: ids.length } })
  revalidatePath("/linkdit-studio-8k92/tools")
  return { success: true }
}

export async function adminBulkUnfeature(ids: string[]) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("tools").update({ featured: false }).in("id", ids)
  await logAuditEvent({ action: "bulk_unfeature", entityType: "tool", metadata: { count: ids.length } })
  revalidatePath("/linkdit-studio-8k92/tools")
  return { success: true }
}

export async function adminBulkPublish(ids: string[]) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("tools").update({ is_published: true }).in("id", ids)
  await logAuditEvent({ action: "bulk_publish", entityType: "tool", metadata: { count: ids.length } })
  revalidatePath("/linkdit-studio-8k92/tools")
  return { success: true }
}

export async function adminBulkUnpublish(ids: string[]) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("tools").update({ is_published: false }).in("id", ids)
  await logAuditEvent({ action: "bulk_unpublish", entityType: "tool", metadata: { count: ids.length } })
  revalidatePath("/linkdit-studio-8k92/tools")
  return { success: true }
}

export async function adminUpdateTool(id: string, formData: FormData): Promise<AdminToolResult> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }

  const name = formData.get("name") as string | null
  const description = formData.get("description") as string | null
  const categoryId = formData.get("categoryId") as string | null
  const websiteUrl = formData.get("websiteUrl") as string | null
  const logoUrl = formData.get("logoUrl") as string | null
  const pricing = formData.get("pricing") as string | null
  const features = formData.get("features") as string | null
  const pros = formData.get("pros") as string | null
  const cons = formData.get("cons") as string | null
  const published = formData.get("published") as string | null
  const featured = formData.get("featured") as string | null
  const sponsored = formData.get("sponsored") as string | null
  const isVerified = formData.get("isVerified") as string | null
  const seoTitle = formData.get("seoTitle") as string | null
  const seoDescription = formData.get("seoDescription") as string | null

  const updates: Record<string, unknown> = {}
  if (name) updates.name = name
  if (description !== null) updates.description = description
  if (categoryId !== null) updates.category_id = categoryId || null
  if (websiteUrl !== null) updates.website_url = websiteUrl || null
  if (logoUrl !== null) updates.logo_url = logoUrl || null
  if (pricing) updates.pricing = pricing
  if (features !== null) {
    updates.features = features ? features.split("\n").map((f) => f.trim()).filter(Boolean) : []
  }
  if (pros !== null) {
    updates.pros = pros ? pros.split("\n").map((p) => p.trim()).filter(Boolean) : []
  }
  if (cons !== null) {
    updates.cons = cons ? cons.split("\n").map((c) => c.trim()).filter(Boolean) : []
  }
  if (published !== null) updates.is_published = published === "true"
  if (featured !== null) updates.featured = featured === "true"
  if (sponsored !== null) updates.sponsored = sponsored === "true"
  if (isVerified !== null) updates.is_verified = isVerified === "true"
  if (seoTitle !== null) updates.seo_title = seoTitle || null
  if (seoDescription !== null) updates.seo_description = seoDescription || null

  const logoFile = formData.get("logoFile")
  if (logoFile instanceof File && logoFile.size > 0) {
    try {
      updates.logo_url = await uploadFile("tool-logos", logoFile, user.id)
    } catch {
      return { error: "Failed to upload logo." }
    }
  }

  const tagsRaw = formData.get("tags") as string | null
  if (tagsRaw !== null) {
    const tagNames = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    await supabase.from("tool_tags").delete().eq("tool_id", id)
    if (tagNames.length > 0) {
      await upsertTags(tagNames, id)
    }
  }

  const { error } = await supabase.from("tools").update(updates as any).eq("id", id)
  if (error) return { error: error.message }
  await logAuditEvent({ action: "update", entityType: "tool", entityId: id })
  revalidatePath("/linkdit-studio-8k92/tools")
  return { success: true }
}
