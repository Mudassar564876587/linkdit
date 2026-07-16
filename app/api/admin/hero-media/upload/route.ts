import { NextResponse } from "next/server"
import { uploadHeroMedia } from "@/lib/supabase/storage"

export const dynamic = "force-dynamic"

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml", "video/mp4", "video/webm", "video/quicktime", "video/mov"]
const MAX_SIZE_IMAGE = 10 * 1024 * 1024 // 10 MB
const MAX_SIZE_VIDEO = 100 * 1024 * 1024 // 100 MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 })
    }

    const isVideo = file.type.startsWith("video/")
    const maxSize = isVideo ? MAX_SIZE_VIDEO : MAX_SIZE_IMAGE
    if (file.size > maxSize) {
      const label = isVideo ? "100 MB" : "10 MB"
      return NextResponse.json({ error: `File exceeds ${label} limit` }, { status: 400 })
    }

    const timestamp = Date.now()
    const safeName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
    const folder = isVideo ? "videos" : "images"
    const path = `${folder}/${safeName}`

    const url = await uploadHeroMedia(file, path)
    return NextResponse.json({ url, path, name: safeName })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Upload failed" }, { status: 500 })
  }
}
