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

// ── Random review generators ──────────────────────────────────
const FIRST_NAMES = [
  "Michael", "James", "Emma", "Olivia", "Ava", "Sophia", "Liam", "Noah", "Ethan", "Mason",
  "Sarah", "David", "John", "Lisa", "Alex", "Maria", "Chris", "Rachel", "Tom", "Aisha",
]
const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Anderson",
]

const TITLE_PREFIXES = [
  "Honest Review of", "My Experience with", "Why I Love", "Why I Switched to",
  "A Deep Dive into", "Everything You Need to Know About", "Getting Started with",
  "After 6 Months with", "3 Months Using", "Real Talk About", "Daily Driver:",
  "The Truth About", "Unbiased Review of", "Detailed Look at",
]
const TITLE_SUFFIXES = [
  "– A Practical Review", "– Pros and Cons", "– My Verdict",
  "– What You Need to Know", "– The Good, The Bad", "– An Honest Take",
]

const BODY_OPENERS = [
  "I've been using this tool daily for the past few months and I'm honestly impressed.",
  "After testing several alternatives, I finally settled on this one.",
  "I was skeptical at first, but decided to give it a try.",
  "A colleague recommended this to me and I'm glad they did.",
  "I've spent considerable time evaluating this and here's my verdict.",
  "Let me share my honest experience with this tool.",
]
const BODY_MIDDLES = [
  "The interface is clean and intuitive, making it easy to get started right away.",
  "Setup was straightforward and I was productive within minutes.",
  "Performance has been consistently reliable with fast response times.",
  "The quality of output is impressive and often requires minimal editing.",
  "The pricing is reasonable considering the value it provides.",
]
const BODY_ENDERS = [
  "Overall, I highly recommend giving this tool a try.",
  "It has become an essential part of my daily toolkit.",
  "I've already recommended it to several colleagues.",
  "For the price point, this offers exceptional value.",
  "Worth every penny for the productivity gains alone.",
  "I'm glad I made the switch and don't see myself going back.",
]
const PROS_POOL = [
  "Excellent output quality", "Fast performance", "Clean interface", "Great value for money",
  "Reliable uptime", "Easy to learn", "Powerful features", "Regular updates",
  "Good documentation", "Responsive customer support", "Intuitive design",
  "High accuracy", "Affordable pricing", "User-friendly interface",
]
const CONS_POOL = [
  "Premium features require upgrade", "Could be faster for large tasks", "Steep learning curve",
  "Mobile experience needs work", "Limited free tier", "Customer support can be slow",
  "Occasional bugs after updates", "No offline mode", "Price increase on renewal",
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateReview(toolName: string) {
  const rating = randomInt(2, 5)
  const prefix = pick(TITLE_PREFIXES)
  const suffix = Math.random() > 0.5 ? ` ${pick(TITLE_SUFFIXES)}` : ""
  const title = `${prefix} ${toolName}${suffix}`
  const content = `${pick(BODY_OPENERS)} ${pick(BODY_MIDDLES)} ${pick(BODY_ENDERS)}`
  const pros = pickN(PROS_POOL, randomInt(2, 3))
  const cons = pickN(CONS_POOL, randomInt(1, 2))
  return { rating, title, content, pros, cons }
}

export async function adminSeedReviews() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated." }

    const admin = getAdminClient()

    // Ensure admin user exists in public.users
    const { data: existingUser } = await admin
      .from("users")
      .select("id, role")
      .eq("id", user.id)
      .maybeSingle()

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

    // Delete all existing reviews
    const { data: existing } = await admin.from("reviews").select("id")
    if (existing && existing.length > 0) {
      const ids = existing.map((r: { id: string }) => r.id)
      for (let i = 0; i < ids.length; i += 100) {
        await admin.from("reviews").delete().in("id", ids.slice(i, i + 100))
      }
    }

    // Create a pool of reviewer auth users so we can have multiple reviews per tool
    const REVIEWER_COUNT = 20
    const reviewerIds: string[] = []

    // Find existing seed reviewer users
    const { data: existingReviewers } = await admin
      .from("users")
      .select("id, email")
      .like("email", "seed.reviewer.%@linkdit-seed.com")

    const existingReviewerMap = new Map(
      (existingReviewers ?? []).map((r: { email: string; id: string }) => [r.email, r.id])
    )

    for (let i = 0; i < REVIEWER_COUNT; i++) {
      const first = pick(FIRST_NAMES)
      const last = pick(LAST_NAMES)
      const name = `${first} ${last}`
      const email = `seed.reviewer.${i}@linkdit-seed.com`
      let rid = existingReviewerMap.get(email)

      if (!rid) {
        try {
          const { data: authData, error: authError } = await admin.auth.admin.createUser({
            email,
            password: "SeedPass123!",
            email_confirm: true,
            user_metadata: { full_name: name },
          })
          if (!authError && authData?.user) {
            rid = authData.user.id
            await admin.from("users").insert({
              id: rid, email, full_name: name, role: "user",
            }).maybeSingle()
          }
        } catch {
          // Ignore individual failures
        }
      }
      if (rid) reviewerIds.push(rid)
    }

    // If no reviewer users could be created, fall back to using admin user
    if (reviewerIds.length === 0) {
      reviewerIds.push(user.id)
    }

    let inserted = 0
    const errors: string[] = []

    // Seed 3-5 reviews per tool with different reviewers
    for (const tool of tools) {
      const count = randomInt(3, 5)
      for (let i = 0; i < count; i++) {
        const review = generateReview(tool.name)
        const reviewerId = reviewerIds[i % reviewerIds.length]

        const { error } = await admin.from("reviews").insert({
          tool_id: tool.id,
          user_id: reviewerId,
          rating: review.rating,
          title: review.title,
          content: review.content,
          pros: review.pros,
          cons: review.cons,
          is_approved: true,
        })
        if (error) {
          if (error.code === "23505") continue // unique violation, skip
          errors.push(error.message)
        } else inserted++
      }
    }

    // Update tool ratings
    for (const tool of tools) {
      const { data: ratings } = await admin
        .from("reviews")
        .select("rating")
        .eq("tool_id", tool.id)
        .eq("is_approved", true)
      if (ratings && ratings.length > 0) {
        const avg = parseFloat(
          (ratings.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / ratings.length).toFixed(2)
        )
        await admin.from("tools").update({ rating: avg, review_count: ratings.length }).eq("id", tool.id)
      }
    }

    revalidatePath("/", "layout")
    return { success: true, inserted, skipped: 0, total: tools.length, errors: errors.length > 0 ? errors : undefined }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Unknown error occurred." }
  }
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
