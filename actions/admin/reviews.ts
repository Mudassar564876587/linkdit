"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { logAuditEvent } from "@/lib/audit"

async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from("users").select("role").eq("id", userId).single()
  return data?.role === "admin"
}

export async function adminApproveReview(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("reviews").update({ is_approved: true }).eq("id", id)
  await logAuditEvent({ action: "approve", entityType: "review", entityId: id })
  revalidatePath("/linkdit-studio-8k92/reviews")
  return { success: true }
}

export async function adminApproveAllReviews() {
  const admin = getAdminClient()
  const { error } = await admin
    .from("reviews")
    .update({ is_approved: true })
    .eq("is_approved", false)

  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { success: true }
}

const sampleReviews = [
  { rating: 5, title: "Excellent tool for professionals", content: "I've been using this tool for months and it has completely transformed my workflow. Highly recommend it to anyone looking to boost productivity.", pros: ["Easy to use", "Great features", "Excellent support"], cons: ["Could be cheaper"] },
  { rating: 4, title: "Great features, minor drawbacks", content: "Overall a solid tool with great capabilities. A few areas could be improved but definitely worth trying.", pros: ["Powerful features", "Good UI"], cons: ["Learning curve", "Premium pricing"] },
  { rating: 5, title: "Game changer for our team", content: "Our team adopted this tool and saw immediate improvements in efficiency. The AI features are outstanding.", pros: ["AI features", "Team collaboration", "Fast"], cons: ["None so far"] },
  { rating: 4, title: "Good value for money", content: "Compared to alternatives, this offers great value. The free tier is generous and paid plans are reasonable.", pros: ["Affordable", "Regular updates"], cons: ["Missing some advanced features"] },
  { rating: 3, title: "Decent but room for improvement", content: "It does the job but there are better alternatives available. Support response time could be faster.", pros: ["Works as advertised", "Clean interface"], cons: ["Slow support", "Limited integrations"] },
]

export async function adminSeedReviews() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const admin = getAdminClient()

  // Ensure user exists in public.users (trigger may not have fired for old accounts)
  const { data: existingUser } = await admin
    .from("users")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle()

  let userId = user.id
  if (!existingUser) {
    const { error: insertError } = await admin.from("users").insert({
      id: user.id,
      email: user.email ?? "admin@linkdit.com",
      full_name: user.user_metadata?.full_name ?? "Admin",
      role: "admin",
    })
    if (insertError) return { error: `Failed to create user profile: ${insertError.message}` }
  } else if (existingUser.role !== "admin") {
    return { error: "Permission denied. Admin role required." }
  }

  const { data: tools } = await admin.from("tools").select("id, name")
  if (!tools || tools.length === 0) return { error: "No tools found." }

  const { data: existing } = await admin.from("reviews").select("tool_id").not("tool_id", "is", null)
  const existingIds = new Set(existing?.map((r: any) => r.tool_id) ?? [])

  let inserted = 0
  let skipped = 0
  let errors: string[] = []

  for (const tool of tools) {
    if (existingIds.has(tool.id)) { skipped++; continue }

    const count = 2 + Math.floor(Math.random() * 3)
    const selected = [...sampleReviews].sort(() => Math.random() - 0.5).slice(0, count)

    for (const review of selected) {
      const { error } = await admin.from("reviews").insert({
        tool_id: tool.id,
        user_id: userId,
        rating: review.rating,
        title: review.title,
        content: review.content,
        pros: review.pros,
        cons: review.cons,
        is_approved: true,
      })
      if (error) errors.push(error.message)
      else inserted++
    }
  }

  revalidatePath("/", "layout")
  return { success: true, inserted, skipped, total: tools.length, errors: errors.length > 0 ? errors : undefined }
}

export async function adminDeleteReview(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return { error: "Permission denied." }
  await supabase.from("reviews").delete().eq("id", id)
  await logAuditEvent({ action: "delete", entityType: "review", entityId: id })
  revalidatePath("/linkdit-studio-8k92/reviews")
  return { success: true }
}
