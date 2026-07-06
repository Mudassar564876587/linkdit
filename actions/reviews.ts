"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitReview(toolId: string, rating: number, content: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  if (rating < 1 || rating > 5) return { error: "Rating must be between 1 and 5." }

  const { error } = await supabase.from("reviews").insert({
    user_id: user.id,
    tool_id: toolId,
    rating,
    content: content || null,
  })

  if (error) {
    if (error.code === "23505") return { error: "You have already reviewed this tool." }
    return { error: error.message }
  }

  revalidatePath(`/tools/[slug]`)
  return { success: true }
}
