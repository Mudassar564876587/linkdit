"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitReview(
  toolId: string,
  title: string,
  content: string,
  rating: number,
  pros: string[],
  cons: string[]
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  if (rating < 1 || rating > 5) return { error: "Rating must be between 1 and 5." }
  if (!title?.trim()) return { error: "Review title is required." }
  if (!content?.trim()) return { error: "Review content is required." }

  const { error } = await supabase.from("reviews").insert({
    user_id: user.id,
    tool_id: toolId,
    rating,
    title: title.trim(),
    content: content.trim(),
    pros: pros.length > 0 ? pros : null,
    cons: cons.length > 0 ? cons : null,
  })

  if (error) {
    if (error.code === "23505") return { error: "You have already reviewed this tool." }
    return { error: error.message }
  }

  revalidatePath(`/tools/[slug]`)
  return { success: true }
}

export async function updateReview(
  reviewId: string,
  title: string,
  content: string,
  rating: number,
  pros: string[],
  cons: string[]
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  if (rating < 1 || rating > 5) return { error: "Rating must be between 1 and 5." }
  if (!title?.trim()) return { error: "Review title is required." }
  if (!content?.trim()) return { error: "Review content is required." }

  const { error } = await supabase
    .from("reviews")
    .update({
      rating,
      title: title.trim(),
      content: content.trim(),
      pros: pros.length > 0 ? pros : null,
      cons: cons.length > 0 ? cons : null,
    })
    .eq("id", reviewId)
    .eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath(`/tools/[slug]`)
  return { success: true }
}

export async function deleteToolReview(reviewId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath(`/tools/[slug]`)
  return { success: true }
}
