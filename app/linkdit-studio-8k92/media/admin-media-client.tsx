"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, Search, Trash2, ImageIcon, Loader2 } from "lucide-react"
import { adminUploadMedia, adminDeleteMedia } from "@/actions/admin/media"
import { getBrowserClient } from "@/lib/supabase/client"

export default function AdminMediaClient() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [images, setImages] = useState<string[]>([])

  function loadImages() {
    const supabase = getBrowserClient()
    supabase.storage.from("media").list("admin").then(({ data }) => {
      if (data) {
        setImages(data.map((f) => {
          const { data: urlData } = supabase.storage.from("media").getPublicUrl(`admin/${f.name}`)
          return urlData.publicUrl
        }))
      }
    })
  }

  useEffect(() => { loadImages() }, [])

  const filtered = images.filter((url) => !search || url.toLowerCase().includes(search.toLowerCase()))

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    const fd = new FormData()
    fd.set("file", file)
    await adminUploadMedia(fd)
    setLoading(false)
    loadImages()
    router.refresh()
    if (fileRef.current) fileRef.current.value = ""
  }

  async function handleDelete(url: string) {
    if (!confirm("Delete this image?")) return
    const parts = url.split("/")
    const path = parts.slice(-2).join("/")
    await adminDeleteMedia(path)
    loadImages()
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={loading}
            className="btn-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload
          </button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search images..."
          className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
          <ImageIcon className="mb-3 h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">No images found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((url) => (
            <div key={url} className="group relative overflow-hidden rounded-xl border border-border">
              <img src={url} alt="" className="h-40 w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(url)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-red-600 hover:bg-white">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
