import { NextResponse } from "next/server"
import { listHeroMedia } from "@/lib/supabase/storage"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const items = await listHeroMedia()
    return NextResponse.json({ items })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to list media" }, { status: 500 })
  }
}
