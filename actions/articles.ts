"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function searchArticles(query: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("articles")
    .select("id, title, slug, description")
    .eq("is_published", true)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order("published_at", { ascending: false })
    .limit(10)

  return data ?? []
}

export async function searchResources(query: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("resources")
    .select("id, name, slug, description")
    .eq("is_published", true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(10)

  return data ?? []
}
