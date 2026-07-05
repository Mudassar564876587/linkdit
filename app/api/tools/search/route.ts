import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")

  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from("tools")
    .select("id, name, slug, logo_url, pricing, rating, review_count")
    .eq("is_published", true)
    .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
    .order("rating", { ascending: false })
    .limit(10)

  return NextResponse.json(data ?? [])
}
