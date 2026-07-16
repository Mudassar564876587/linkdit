import { NextResponse } from "next/server"
import { deleteHeroMedia } from "@/lib/supabase/storage"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { name } = await req.json()
    if (!name) return NextResponse.json({ error: "No file name provided" }, { status: 400 })

    const isVideo = /\.(mp4|webm|mov)$/i.test(name)
    const path = name.startsWith("images/") || name.startsWith("videos/") ? name : isVideo ? `videos/${name}` : `images/${name}`
    await deleteHeroMedia(path)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Delete failed" }, { status: 500 })
  }
}
