"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addBookmark(toolId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { error } = await supabase
    .from("bookmarks")
    .insert({ user_id: user.id, tool_id: toolId })

  if (error) {
    if (error.code === "23505") return { error: "Already bookmarked." }
    return { error: error.message }
  }

  revalidatePath("/dashboard/bookmarks")
  return { success: true }
}

export async function removeBookmark(toolId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("tool_id", toolId)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/bookmarks")
  return { success: true }
}

export async function addArticleBookmark(articleId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { error } = await supabase
    .from("bookmarks")
    .insert({ user_id: user.id, article_id: articleId })

  if (error) {
    if (error.code === "23505") return { error: "Already bookmarked." }
    return { error: error.message }
  }

  revalidatePath("/dashboard/bookmarks")
  return { success: true }
}

export async function removeArticleBookmark(articleId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("article_id", articleId)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/bookmarks")
  return { success: true }
}
