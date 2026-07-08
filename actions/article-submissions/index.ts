"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ArticleSubmissionSchema } from "@/lib/schemas/article-submission"
import { revalidatePath } from "next/cache"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function safeJsonParse(val: unknown, fallback: unknown) {
  if (!val) return fallback
  if (typeof val === "string") {
    try { return JSON.parse(val) } catch { return fallback }
  }
  return val
}

export async function createArticleSubmission(formData: FormData) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: uData, error: authErr } = await supabase.auth.getUser()
    if (authErr) return { error: `Authentication error: ${authErr.message}` }
    if (!uData?.user) return { error: "Not authenticated." }
    const user = uData.user

    const raw = {
      title: formData.get("title"),
      categoryId: formData.get("categoryId"),
      description: formData.get("description"),
      content: formData.get("content"),
      coverImageUrl: formData.get("coverImageUrl") || "",
      tags: safeJsonParse(formData.get("tags"), []),
    }

    const parsed = ArticleSubmissionSchema.safeParse(raw)
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      return { error: `${first.path.join(".")}: ${first.message}` }
    }

    let slug = slugify(parsed.data.title)
    let counter = 1
    while (true) {
      const { data: existing } = await supabase
        .from("article_submissions")
        .select("id")
        .eq("slug", slug)
        .maybeSingle()
      if (!existing) break
      slug = `${slugify(parsed.data.title)}-${counter++}`
    }

    const { error: insertErr } = await supabase.from("article_submissions").insert({
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      content: parsed.data.content,
      category_id: parsed.data.categoryId,
      cover_image_url: parsed.data.coverImageUrl || null,
      tags: parsed.data.tags,
      user_id: user.id,
      submitter_email: user.email!,
      status: "pending",
    })

    if (insertErr) return { error: `Insert error: ${insertErr.message}` }

    revalidatePath("/dashboard/my-submissions")
    return { success: true, slug }
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred."
    return { error: `[createArticleSubmission] ${message}` }
  }
}

export async function adminApproveArticleSubmission(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { data: adminUser } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") return { error: "Permission denied." }

  const { data: sub } = await supabase
    .from("article_submissions")
    .select("*")
    .eq("id", id)
    .single()

  if (!sub) return { error: "Submission not found." }

  const articleSlug = sub.slug || slugify(sub.title)

  const { error: articleErr } = await supabase.from("articles").insert({
    title: sub.title,
    slug: articleSlug,
    description: sub.description,
    content: sub.content,
    category_id: sub.category_id || "",
    cover_image_url: sub.cover_image_url,
    read_time: "5 min",
    author_id: sub.user_id,
    author_name: sub.submitter_email || "Guest",
    tags: sub.tags,
    is_published: true,
    published_at: new Date().toISOString(),
  })

  if (articleErr) return { error: articleErr.message }

  await supabase
    .from("article_submissions")
    .update({
      status: "approved",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)

  await supabase.from("notifications").insert({
    user_id: sub.user_id!,
    type: "submission_status",
    title: `"${sub.title}" has been approved`,
    body: "Your article submission has been approved and published on LinkDit.",
    link: `/articles/${articleSlug}`,
  })

  revalidatePath("/linkdit-studio-8k92/article-submissions")
  revalidatePath("/articles")
  return { success: true }
}

export async function adminRejectArticleSubmission(id: string, reason: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { data: adminUser } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") return { error: "Permission denied." }

  const { data: sub } = await supabase
    .from("article_submissions")
    .select("user_id, title, slug")
    .eq("id", id)
    .single()

  if (!sub) return { error: "Submission not found." }

  await supabase
    .from("article_submissions")
    .update({
      status: "rejected",
      admin_notes: reason,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)

  await supabase.from("notifications").insert({
    user_id: sub.user_id!,
    type: "submission_status",
    title: `"${sub.title}" was rejected`,
    body: reason || "Your article submission did not meet our guidelines.",
  })

  revalidatePath("/linkdit-studio-8k92/article-submissions")
  return { success: true }
}

export async function adminDeleteArticleSubmission(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { data: adminUser } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") return { error: "Permission denied." }

  await supabase.from("article_submissions").delete().eq("id", id)
  revalidatePath("/linkdit-studio-8k92/article-submissions")
  return { success: true }
}
