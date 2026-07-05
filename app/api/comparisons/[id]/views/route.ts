import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  await (supabase.rpc as any)("increment_comparison_views", {
    comparison_id: id,
  })

  return NextResponse.json({ success: true })
}
