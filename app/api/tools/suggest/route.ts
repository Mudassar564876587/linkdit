import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("tools")
    .select("name, slug")
    .eq("is_published", true)
    .ilike("name", `%${q}%`)
    .order("rating", { ascending: false })
    .limit(6)

  return NextResponse.json(data ?? [])
}
