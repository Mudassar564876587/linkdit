"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Upload, Trash2, Copy, Check, FileIcon, Image, Film, ExternalLink, Loader2, X, Search, FileVideo } from "lucide-react"
import { toast } from "sonner"

interface MediaItem {
  name: string
  url: string
  updatedAt: string
}

interface MediaLibraryProps {
  onSelect: (url: string) => void
  onClose: () => void
}

const acceptedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"]
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".mp4", ".webm", ".mov"]

type MediaFilter = "all" | "images" | "videos"

function isVideoFile(name: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(name)
}

export default function MediaLibrary({ onSelect, onClose }: MediaLibraryProps) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [copiedUrl, setCopiedUrl] = useState("")
  const [filter, setFilter] = useState<MediaFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  async function loadMedia() {
    try {
      const res = await fetch("/api/admin/hero-media/list")
      const data = await res.json()
      setItems(data.items ?? [])
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadMedia() }, [])

  const filteredItems = useMemo(() => {
    let result = items
    if (filter === "images") result = result.filter(i => !isVideoFile(i.name))
    if (filter === "videos") result = result.filter(i => isVideoFile(i.name))
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(i => i.name.toLowerCase().includes(q))
    }
    return result
  }, [items, filter, searchQuery])

  async function handleUpload(file: File) {
    const ext = "." + file.name.split(".").pop()?.toLowerCase()
    if (!allowedExtensions.includes(ext)) {
      toast.error(`Unsupported format: ${ext}. Allowed: ${allowedExtensions.join(", ")}`)
      return
    }

    const isVideo = file.type.startsWith("video/")
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      const label = isVideo ? "100 MB" : "10 MB"
      toast.error(`File exceeds ${label} limit.`)
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100))
      })

      const result = await new Promise<{ url: string }>((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText))
          } else {
            try { reject(new Error(JSON.parse(xhr.responseText).error)) }
            catch { reject(new Error("Upload failed")) }
          }
        })
        xhr.addEventListener("error", () => reject(new Error("Upload failed")))
        xhr.open("POST", "/api/admin/hero-media/upload")
        xhr.send(formData)
      })

      toast.success("Uploaded successfully")
      setUploadProgress(0)
      await loadMedia()
    } catch (err: any) {
      toast.error(err.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(name: string) {
    const ok = window.confirm(`Delete "${name}"?`)
    if (!ok) return
    try {
      const res = await fetch("/api/admin/hero-media/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error("Delete failed")
      toast.success("Deleted")
      await loadMedia()
    } catch {
      toast.error("Failed to delete")
    }
  }

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(""), 2000)
    toast.success("URL copied")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">Media Library</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Upload area */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept={[...acceptedImageTypes, "video/mp4", "video/webm", "video/quicktime"].join(",")}
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = "" }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-border px-5 py-3 text-sm font-medium text-muted-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors disabled:opacity-50 shrink-0"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? `Uploading ${uploadProgress}%` : "Upload files"}
            </button>
          </div>
          {uploading && uploadProgress > 0 && (
            <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
          <p className="mt-1.5 text-xs text-muted-foreground">
            JPG, PNG, WEBP, SVG (max 10 MB) &bull; MP4, WEBM, MOV (max 100 MB)
          </p>
        </div>

        {/* Filter + Search */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-3">
          <div className="flex gap-1 rounded-lg bg-muted p-0.5">
            {(["all", "images", "videos"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "All" : f === "images" ? "Images" : "Videos"}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="h-8 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Media grid */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: "50vh" }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {searchQuery ? "No files match your search." : "No media uploaded yet. Upload an image or video above."}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
              {filteredItems.map((item) => {
                const isVideo = isVideoFile(item.name)
                return (
                  <div key={item.name} className="group relative overflow-hidden rounded-lg border border-border bg-muted/30">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {isVideo ? (
                        <>
                          <video src={item.url} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="rounded-full bg-black/40 p-2">
                              <Film className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        </>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.url} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 truncate px-2 py-1.5 text-[11px] text-muted-foreground">
                      {isVideo ? <FileVideo className="h-3 w-3 shrink-0" /> : <Image className="h-3 w-3 shrink-0" />}
                      <span className="truncate">{item.name}</span>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => onSelect(item.url)}
                        className="rounded-md bg-white/90 p-1.5 text-foreground shadow-sm hover:bg-white transition-colors"
                        title="Select"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(item.url)}
                        className="rounded-md bg-white/90 p-1.5 text-foreground shadow-sm hover:bg-white transition-colors"
                        title="Copy URL"
                      >
                        {copiedUrl === item.url ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => window.open(item.url, "_blank")}
                        className="rounded-md bg-white/90 p-1.5 text-foreground shadow-sm hover:bg-white transition-colors"
                        title="Open"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.name)}
                        className="rounded-md bg-red-500/90 p-1.5 text-white shadow-sm hover:bg-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
