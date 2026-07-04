"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().max(2000).optional(),
})

export async function updateReview(reviewId: string, formData: FormData) {
  const parsed = reviewSchema.safeParse({
    rating: Number(formData.get("rating")),
    content: formData.get("content") || undefined,
  })

  if (!parsed.success) return { error: "Invalid review data." }

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { error } = await supabase
    .from("reviews")
    .update({
      rating: parsed.data.rating,
      content: parsed.data.content ?? null,
    })
    .eq("id", reviewId)
    .eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/reviews")
  return { success: true }
}

export async function deleteReview(reviewId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/reviews")
  return { success: true }
}
