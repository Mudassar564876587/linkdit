"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SubmissionSchema } from "@/lib/schemas/submission"
import { revalidatePath } from "next/cache"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function createSubmission(formData: FormData) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr) {
      console.error("createSubmission: auth error", authErr)
      return { error: `Authentication error: ${authErr.message}` }
    }
    if (!user) return { error: "Not authenticated." }

    const raw = {
      toolName: formData.get("toolName"),
      websiteUrl: formData.get("websiteUrl"),
      shortDescription: formData.get("shortDescription"),
      fullDescription: formData.get("fullDescription") || "",
      pricing: formData.get("pricing"),
      categoryId: formData.get("categoryId"),
      tags: safeJsonParse(formData.get("tags"), []),
      features: safeJsonParse(formData.get("features"), []),
      pros: safeJsonParse(formData.get("pros"), []),
      cons: safeJsonParse(formData.get("cons"), []),
      faqs: safeJsonParse(formData.get("faqs"), []),
      contactEmail: formData.get("contactEmail") || user.email,
      logoFile: formData.get("logoFile"),
      coverFile: formData.get("coverFile"),
      galleryFiles: safeJsonParse(formData.get("galleryFiles"), []),
    }

    const parsed = SubmissionSchema.safeParse(raw)
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      console.error("createSubmission: validation error", first)
      return { error: `${first.path.join(".")}: ${first.message}` }
    }

    const logoUrl = raw.logoFile instanceof File ? await uploadStorage("tool-logos", raw.logoFile, user.id) : null
    const coverUrl = raw.coverFile instanceof File ? await uploadStorage("tool-covers", raw.coverFile, user.id) : null
    let galleryUrls: string[] = []
    if (Array.isArray(raw.galleryFiles)) {
      for (const f of raw.galleryFiles) {
        if (f instanceof File) {
          const url = await uploadStorage("tool-galleries", f, user.id)
          if (url) galleryUrls.push(url)
        }
      }
    }

    const baseSlug = slugify(parsed.data.toolName)
    let slug = baseSlug
    let counter = 1
    while (true) {
      const { data: existing, error: slugErr } = await supabase
        .from("tools")
        .select("id")
        .eq("slug", slug)
        .maybeSingle()
      if (slugErr) {
        console.error("createSubmission: slug check error", slugErr)
        return { error: `Slug check error: ${slugErr.message}` }
      }
      if (!existing) break
      slug = `${baseSlug}-${counter++}`
    }

    const { error: insertErr } = await supabase.from("tool_submissions").insert({
      submitter_email: user.email!,
      user_id: user.id,
      tool_name: parsed.data.toolName,
      tool_url: parsed.data.websiteUrl,
      description: parsed.data.shortDescription,
      full_description: parsed.data.fullDescription,
      category_id: parsed.data.categoryId,
      pricing: parsed.data.pricing,
      tags: parsed.data.tags,
      features: parsed.data.features,
      pros: parsed.data.pros,
      cons: parsed.data.cons,
      faqs: parsed.data.faqs,
      contact_email: parsed.data.contactEmail,
      logo_url: logoUrl,
      cover_image_url: coverUrl,
      gallery_images: galleryUrls,
      slug,
      submission_status: "submitted",
      status: "pending",
    })

    if (insertErr) {
      console.error("createSubmission: insert error", insertErr)
      return { error: `Insert error: ${insertErr.message}` }
    }

    revalidatePath("/dashboard/my-submissions")
    return { success: true, slug }
  } catch (err) {
    console.error("createSubmission: unexpected error", err)
    const message = err instanceof Error ? err.message : "An unexpected error occurred while submitting your tool."
    return { error: message }
  }
}

export async function saveDraft(formData: FormData) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated." }

    const submissionId = formData.get("submissionId") as string | null

    const base = {
      submitter_email: user.email!,
      user_id: user.id,
      submission_status: "draft" as const,
    }

    const toolName = formData.get("toolName")
    const websiteUrl = formData.get("websiteUrl")
    const desc = formData.get("shortDescription")
    const fullDesc = formData.get("fullDescription")
    const pricing = formData.get("pricing")
    const categoryId = formData.get("categoryId")
    const tags = formData.get("tags")
    const features = formData.get("features")
    const pros = formData.get("pros")
    const cons = formData.get("cons")
    const faqs = formData.get("faqs")
    const contactEmail = formData.get("contactEmail")

    if (submissionId) {
      const updates: any = { ...base }
      if (toolName) updates.tool_name = toolName
      if (websiteUrl) updates.tool_url = websiteUrl
      if (desc) updates.description = desc
      if (fullDesc) updates.full_description = fullDesc
      if (pricing) updates.pricing = pricing
      if (categoryId) updates.category_id = categoryId
      if (tags) updates.tags = safeJsonParse(tags, [])
      if (features) updates.features = safeJsonParse(features, [])
      if (pros) updates.pros = safeJsonParse(pros, [])
      if (cons) updates.cons = safeJsonParse(cons, [])
      if (faqs) updates.faqs = safeJsonParse(faqs, [])
      if (contactEmail) updates.contact_email = contactEmail

      const { error } = await supabase.from("tool_submissions").update(updates).eq("id", submissionId).eq("user_id", user.id)
      if (error) return { error: error.message }
    } else {
      const insert: any = { ...base }
      if (toolName) insert.tool_name = toolName
      if (websiteUrl) insert.tool_url = websiteUrl
      if (desc) insert.description = desc
      if (fullDesc) insert.full_description = fullDesc
      if (pricing) insert.pricing = pricing
      if (categoryId) insert.category_id = categoryId
      if (tags) insert.tags = safeJsonParse(tags, [])
      if (features) insert.features = safeJsonParse(features, [])
      if (pros) insert.pros = safeJsonParse(pros, [])
      if (cons) insert.cons = safeJsonParse(cons, [])
      if (faqs) insert.faqs = safeJsonParse(faqs, [])
      if (contactEmail) insert.contact_email = contactEmail

      const { error } = await supabase.from("tool_submissions").insert(insert)
      if (error) return { error: error.message }
    }

    revalidatePath("/dashboard/my-submissions")
    return { success: true }
  } catch (err) {
    console.error("saveDraft: unexpected error", err)
    const message = err instanceof Error ? err.message : "An unexpected error occurred while saving draft."
    return { error: message }
  }
}

export async function deleteSubmission(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { error } = await supabase
    .from("tool_submissions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .in("submission_status", ["draft"])

  if (error) return { error: error.message }
  revalidatePath("/dashboard/my-submissions")
  return { success: true }
}

export async function submitForReview(id: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated." }

    const { error } = await supabase
      .from("tool_submissions")
      .update({ submission_status: "submitted", status: "pending" })
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) return { error: error.message }
    revalidatePath("/dashboard/my-submissions")
    return { success: true }
  } catch (err) {
    console.error("submitForReview: unexpected error", err)
    const message = err instanceof Error ? err.message : "An unexpected error occurred."
    return { error: message }
  }
}

// ─── Admin actions ───

export async function adminApproveSubmission(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { data: adminUser } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") return { error: "Not authorized." }

  const { data: sub } = await supabase.from("tool_submissions").select("*").eq("id", id).single()
  if (!sub) return { error: "Submission not found." }

  const { data: newTool, error: toolErr } = await supabase
    .from("tools")
    .insert({
      name: sub.tool_name,
      slug: sub.slug || slugify(sub.tool_name),
      description: sub.description,
      category_id: sub.category_id!,
      logo_url: sub.logo_url,
      cover_image_url: sub.cover_image_url,
      website_url: sub.tool_url,
      pricing: (sub.pricing as "Free" | "Freemium" | "Paid") || "Free",
      features: Array.isArray(sub.features) ? sub.features : [],
      pros: Array.isArray(sub.pros) ? sub.pros : [],
      cons: Array.isArray(sub.cons) ? sub.cons : [],
      faqs: sub.faqs,
      screenshots: sub.gallery_images,
      is_published: true,
    })
    .select("id")
    .single()

  if (toolErr) return { error: toolErr.message }

  if (Array.isArray(sub.gallery_images) && sub.gallery_images.length > 0) {
    await supabase.from("tool_screenshots").insert(
      sub.gallery_images.map((url: string, i: number) => ({
        tool_id: newTool.id,
        url,
        alt: `${sub.tool_name} screenshot ${i + 1}`,
        sort_order: i,
      }))
    )
  }

  await supabase
    .from("tool_submissions")
    .update({
      submission_status: "approved",
      status: "approved",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      publish_status: "published",
    })
    .eq("id", id)

  await supabase.from("notifications").insert({
    user_id: sub.user_id!,
    type: "tool_approved",
    title: `"${sub.tool_name}" has been approved`,
    body: "Your tool submission has been approved and published on LinkDit.",
    link: `/tools/${sub.slug}`,
  })

  revalidatePath("/admin/submissions")
  return { success: true }
}

export async function adminRejectSubmission(id: string, reason: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { data: adminUser } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") return { error: "Not authorized." }

  const sub = await supabase.from("tool_submissions").select("user_id, tool_name, slug").eq("id", id).single()
  if (!sub.data) return { error: "Submission not found." }

  await supabase
    .from("tool_submissions")
    .update({
      submission_status: "rejected",
      status: "rejected",
      admin_notes: reason,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)

  await supabase.from("notifications").insert({
    user_id: sub.data.user_id!,
    type: "tool_rejected",
    title: `"${sub.data.tool_name}" was rejected`,
    body: reason || "Your tool submission did not meet our guidelines.",
  })

  revalidatePath("/admin/submissions")
  return { success: true }
}

export async function adminRequestChanges(id: string, notes: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { data: adminUser } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") return { error: "Not authorized." }

  await supabase
    .from("tool_submissions")
    .update({ admin_notes: notes, submission_status: "submitted" })
    .eq("id", id)

  revalidatePath("/admin/submissions")
  return { success: true }
}

export async function adminDeleteSubmission(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { data: adminUser } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") return { error: "Not authorized." }

  await supabase.from("tool_submissions").delete().eq("id", id)
  revalidatePath("/admin/submissions")
  return { success: true }
}

export async function adminPublishTool(toolId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { data: adminUser } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") return { error: "Not authorized." }

  await supabase.from("tools").update({ is_published: true }).eq("id", toolId)

  revalidatePath("/admin/submissions")
  return { success: true }
}

export async function adminUnpublishTool(toolId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { data: adminUser } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") return { error: "Not authorized." }

  await supabase.from("tools").update({ is_published: false }).eq("id", toolId)

  revalidatePath("/admin/submissions")
  return { success: true }
}

// ─── Helpers ───

function safeJsonParse(val: any, fallback: any) {
  if (!val) return fallback
  if (typeof val === "string") {
    try { return JSON.parse(val) } catch { return fallback }
  }
  return val
}

async function uploadStorage(bucket: string, file: File, userId: string): Promise<string | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const ext = file.name.split(".").pop()
    const path = `${userId}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: "3600" })
    if (error) {
      console.error(`uploadStorage: upload to ${bucket} failed`, error)
      return null
    }
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
    return urlData.publicUrl
  } catch (err) {
    console.error(`uploadStorage: unexpected error for ${bucket}`, err)
    return null
  }
}
