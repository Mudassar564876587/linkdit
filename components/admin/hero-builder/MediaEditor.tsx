"use client"

import { useRef, useState } from "react"
import { Upload, Replace, Trash2, Image, Film, Video, Copy, Check, ExternalLink, Loader2, Music, Library } from "lucide-react"
import { toast } from "sonner"
import type { MediaConfig } from "./types"
import { SectionCard, Field, Input, Select, Slider, Toggle, ColorInput } from "./shared"
import MediaLibrary from "./MediaLibrary"

interface Props {
  value: MediaConfig
  onChange: (v: Partial<MediaConfig>) => void
}

const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"]
const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime", "video/mov"]

function extractYoutubeId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return ""
}

function extractVimeoId(url: string): string {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m ? m[1] : ""
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function validateImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = document.createElement("img")
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ width: 0, height: 0 })
    }
    img.src = url
  })
}

export default function MediaEditor({ value, onChange }: Props) {
  const desktopFileRef = useRef<HTMLInputElement>(null)
  const mobileFileRef = useRef<HTMLInputElement>(null)
  const videoFileRef = useRef<HTMLInputElement>(null)
  const [uploadingDesktop, setUploadingDesktop] = useState(false)
  const [uploadingMobile, setUploadingMobile] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [copiedField, setCopiedField] = useState("")
  const [showLibrary, setShowLibrary] = useState(false)
  const [libraryTarget, setLibraryTarget] = useState<"desktop" | "mobile" | "video">("desktop")

  function copyUrl(url: string, field: string) {
    navigator.clipboard.writeText(url)
    setCopiedField(field)
    setTimeout(() => setCopiedField(""), 2000)
    toast.success("URL copied")
  }

  async function uploadFile(file: File, type: "desktop" | "mobile" | "video") {
    const isVideo = type === "video"
    const allowed = isVideo ? allowedVideoTypes : allowedImageTypes

    if (!allowed.includes(file.type)) {
      const msg = isVideo ? "Supported: MP4, WEBM, MOV" : "Supported: JPG, PNG, WEBP, SVG"
      toast.error(`Unsupported format. ${msg}`)
      return
    }

    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      const label = isVideo ? "100 MB" : "10 MB"
      toast.error(`File exceeds ${label} limit.`)
      return
    }

    if (!isVideo) {
      const dims = await validateImageDimensions(file)
      if (dims.width > 0 && dims.height > 0) {
        const minW = type === "mobile" ? 800 : 1600
        const minH = type === "mobile" ? 1200 : 900
        if (dims.width < minW || dims.height < minH) {
          toast.warning(
            `Image is ${dims.width}\u00d7${dims.height}px. Recommended minimum is ${minW}\u00d7${minH}px. It may appear blurry on large screens.`
          )
        }
      }
    }

    const setter = type === "desktop" ? setUploadingDesktop : type === "mobile" ? setUploadingMobile : setUploadingVideo
    setter(true)
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
          if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText))
          else { try { reject(new Error(JSON.parse(xhr.responseText).error)) } catch { reject(new Error("Upload failed")) } }
        })
        xhr.addEventListener("error", () => reject(new Error("Upload failed")))
        xhr.open("POST", "/api/admin/hero-media/upload")
        xhr.send(formData)
      })

      const updates: Record<string, any> = {}
      if (type === "desktop") {
        updates.desktopImageUrl = result.url
        updates.desktopImageFileName = file.name
        updates.desktopImageFileSize = file.size
      } else if (type === "mobile") {
        updates.mobileImageUrl = result.url
        updates.mobileImageFileName = file.name
        updates.mobileImageFileSize = file.size
      } else {
        updates.videoUrl = result.url
        updates.videoFileName = file.name
        updates.videoFileSize = file.size
      }
      onChange(updates)
      toast.success(`${type === "video" ? "Video" : "Image"} uploaded`)
    } catch (err: any) {
      toast.error(err.message || "Upload failed")
    } finally {
      setter(false)
      setUploadProgress(0)
    }
  }

  function handleDesktopFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) uploadFile(f, "desktop")
    e.target.value = ""
  }

  function handleMobileFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) uploadFile(f, "mobile")
    e.target.value = ""
  }

  function handleVideoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) uploadFile(f, "video")
    e.target.value = ""
  }

  function openLibrary(target: "desktop" | "mobile" | "video") {
    setLibraryTarget(target)
    setShowLibrary(true)
  }

  function handleLibrarySelect(url: string) {
    const updates: Record<string, any> = {}
    if (libraryTarget === "desktop") updates.desktopImageUrl = url
    else if (libraryTarget === "mobile") updates.mobileImageUrl = url
    else updates.videoUrl = url
    onChange(updates)
    setShowLibrary(false)
    toast.success("Media selected")
  }

  const hasDesktopImage = !!value.desktopImageUrl
  const hasMobileImage = !!value.mobileImageUrl
  const hasVideo = !!value.videoUrl

  return (
    <>
      <SectionCard title="8. Hero Media">
        {/* --- Banner Type --- */}
        <Field label="Banner Type" hint="Choose what to display in the hero background">
          <Select
            value={value.bannerType}
            onChange={e => onChange({ bannerType: e.target.value as MediaConfig["bannerType"] })}
          >
            <option value="none">None (Text Only)</option>
            <option value="image">Image</option>
            <option value="video">Video Upload</option>
            <option value="youtube">YouTube Video</option>
            <option value="vimeo">Vimeo Video</option>
            <option value="lottie">Lottie Animation</option>
          </Select>
        </Field>

        {/* --- Image Banner --- */}
        {(value.bannerType === "image" || value.bannerType === "none" && value.desktopImageUrl) && (
          <div className="space-y-4 border-t border-border pt-4 mt-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Image className="h-4 w-4" /> Image Banner
            </h4>

            {/* Desktop Image */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-foreground/70">Desktop Banner (1920 × 1080 px)</label>
                <div className="flex gap-1">
                  {hasDesktopImage && (
                    <>
                      <button onClick={() => copyUrl(value.desktopImageUrl, "desktop")} className="rounded p-1 text-muted-foreground hover:bg-muted transition-colors" title="Copy URL">
                        {copiedField === "desktop" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={() => window.open(value.desktopImageUrl, "_blank")} className="rounded p-1 text-muted-foreground hover:bg-muted transition-colors" title="Open">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                  <button onClick={() => openLibrary("desktop")} className="rounded p-1 text-muted-foreground hover:bg-muted transition-colors" title="Media Library">
                    <Library className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <input
                ref={desktopFileRef}
                type="file"
                accept={allowedImageTypes.join(",")}
                className="hidden"
                onChange={handleDesktopFile}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => desktopFileRef.current?.click()}
                  disabled={uploadingDesktop}
                  className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors disabled:opacity-50"
                >
                  {uploadingDesktop ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : hasDesktopImage ? <Replace className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
                  {uploadingDesktop ? `${uploadProgress}%` : hasDesktopImage ? "Replace" : "Upload"}
                </button>
                {hasDesktopImage && (
                  <button
                    onClick={() => onChange({ desktopImageUrl: "", desktopImageFileName: "", desktopImageFileSize: 0 })}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                )}
                <button
                  onClick={() => openLibrary("desktop")}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Library className="h-3.5 w-3.5" /> Browse
                </button>
              </div>
              {uploadingDesktop && uploadProgress > 0 && (
                <div className="mt-1.5 h-1 w-full max-w-[200px] overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
              {value.desktopImageFileName && (
                <p className="mt-1 text-[11px] text-muted-foreground">{value.desktopImageFileName} {value.desktopImageFileSize > 0 && `(${formatFileSize(value.desktopImageFileSize)})`}</p>
              )}
              <p className="mt-0.5 text-[10px] text-muted-foreground/60">Recommended: 1920 × 1080 px &bull; Min: 1600 × 900 px &bull; Max 10 MB</p>
              {hasDesktopImage && (
                <div className="mt-2 overflow-hidden rounded-lg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={value.desktopImageUrl} alt="Desktop banner" className="w-full object-cover" style={{ maxHeight: 120 }} onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                </div>
              )}
            </div>

            {/* Mobile Image */}
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-foreground/70">Mobile Banner (1080 × 1920 px)</label>
                <div className="flex gap-1">
                  {hasMobileImage && (
                    <>
                      <button onClick={() => copyUrl(value.mobileImageUrl, "mobile")} className="rounded p-1 text-muted-foreground hover:bg-muted transition-colors" title="Copy URL">
                        {copiedField === "mobile" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={() => window.open(value.mobileImageUrl, "_blank")} className="rounded p-1 text-muted-foreground hover:bg-muted transition-colors" title="Open">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                  <button onClick={() => openLibrary("mobile")} className="rounded p-1 text-muted-foreground hover:bg-muted transition-colors" title="Media Library">
                    <Library className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <input
                ref={mobileFileRef}
                type="file"
                accept={allowedImageTypes.join(",")}
                className="hidden"
                onChange={handleMobileFile}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => mobileFileRef.current?.click()}
                  disabled={uploadingMobile}
                  className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors disabled:opacity-50"
                >
                  {uploadingMobile ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : hasMobileImage ? <Replace className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
                  {uploadingMobile ? `${uploadProgress}%` : hasMobileImage ? "Replace" : "Upload"}
                </button>
                {hasMobileImage && (
                  <button
                    onClick={() => onChange({ mobileImageUrl: "", mobileImageFileName: "", mobileImageFileSize: 0 })}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                )}
                <button
                  onClick={() => openLibrary("mobile")}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Library className="h-3.5 w-3.5" /> Browse
                </button>
              </div>
              {value.mobileImageFileName && (
                <p className="mt-1 text-[11px] text-muted-foreground">{value.mobileImageFileName} {value.mobileImageFileSize > 0 && `(${formatFileSize(value.mobileImageFileSize)})`}</p>
              )}
              <p className="mt-0.5 text-[10px] text-muted-foreground/60">Recommended: 1080 × 1920 px &bull; Max 10 MB</p>
              {hasMobileImage && (
                <div className="mt-2 overflow-hidden rounded-lg border border-border" style={{ maxWidth: 120 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={value.mobileImageUrl} alt="Mobile banner" className="w-full object-cover" style={{ maxHeight: 160 }} onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Video Upload --- */}
        {value.bannerType === "video" && (
          <div className="space-y-3 border-t border-border pt-4 mt-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Film className="h-4 w-4" /> Video Upload
            </h4>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground/70">Video file (MP4, WEBM, MOV)</label>
              <div className="flex gap-1">
                {hasVideo && (
                  <>
                    <button onClick={() => copyUrl(value.videoUrl, "video")} className="rounded p-1 text-muted-foreground hover:bg-muted transition-colors" title="Copy URL">
                      {copiedField === "video" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => window.open(value.videoUrl, "_blank")} className="rounded p-1 text-muted-foreground hover:bg-muted transition-colors" title="Open">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
                <button onClick={() => openLibrary("video")} className="rounded p-1 text-muted-foreground hover:bg-muted transition-colors">
                  <Library className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <input
              ref={videoFileRef}
              type="file"
              accept={allowedVideoTypes.join(",")}
              className="hidden"
              onChange={handleVideoFile}
            />
            <div className="flex gap-2">
              <button
                onClick={() => videoFileRef.current?.click()}
                disabled={uploadingVideo}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                {uploadingVideo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : hasVideo ? <Replace className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
                {uploadingVideo ? `${uploadProgress}%` : hasVideo ? "Replace" : "Upload"}
              </button>
              {hasVideo && (
                <button
                  onClick={() => onChange({ videoUrl: "", videoFileName: "", videoFileSize: 0, videoPosterUrl: "" })}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              )}
              <button onClick={() => openLibrary("video")} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                <Library className="h-3.5 w-3.5" /> Browse
              </button>
            </div>

            {uploadingVideo && uploadProgress > 0 && (
              <div className="mt-1 h-1.5 w-full max-w-[300px] overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}

            {value.videoFileName && (
              <p className="text-[11px] text-muted-foreground">{value.videoFileName} {value.videoFileSize > 0 && `(${formatFileSize(value.videoFileSize)})`}</p>
            )}
            <p className="text-[10px] text-muted-foreground/60">Max 100 MB &bull; Recommended: 1920 × 1080</p>

            {hasVideo && (
              <div className="overflow-hidden rounded-lg border border-border">
                <video src={value.videoUrl} controls className="w-full" style={{ maxHeight: 200 }} />
              </div>
            )}

            {/* Poster Image */}
            <Field label="Poster Image URL" hint="Preview image before video plays">
              <Input value={value.videoPosterUrl} onChange={e => onChange({ videoPosterUrl: e.target.value })} placeholder="https://..." />
            </Field>
          </div>
        )}

        {/* --- YouTube --- */}
        {value.bannerType === "youtube" && (
          <div className="space-y-3 border-t border-border pt-4 mt-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Video className="h-4 w-4 text-red-500" /> YouTube Video
            </h4>
            <Field label="YouTube URL" hint="Paste any YouTube video URL">
              <Input
                value={value.youtubeUrl}
                onChange={e => {
                  const url = e.target.value
                  const id = extractYoutubeId(url)
                  onChange({ youtubeUrl: url, youtubeVideoId: id })
                }}
                placeholder="https://youtu.be/xxxxx or https://youtube.com/watch?v=xxxxx"
              />
            </Field>
            {value.youtubeVideoId && (
              <div className="overflow-hidden rounded-lg border border-border">
                <iframe
                  src={`https://www.youtube.com/embed/${value.youtubeVideoId}?autoplay=0`}
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube preview"
                />
              </div>
            )}
          </div>
        )}

        {/* --- Vimeo --- */}
        {value.bannerType === "vimeo" && (
          <div className="space-y-3 border-t border-border pt-4 mt-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Film className="h-4 w-4 text-blue-500" /> Vimeo Video
            </h4>
            <Field label="Vimeo URL" hint="Paste a Vimeo video URL">
              <Input
                value={value.vimeoUrl}
                onChange={e => {
                  const url = e.target.value
                  const id = extractVimeoId(url)
                  onChange({ vimeoUrl: url, vimeoVideoId: id })
                }}
                placeholder="https://vimeo.com/xxxxx"
              />
            </Field>
            {value.vimeoVideoId && (
              <div className="overflow-hidden rounded-lg border border-border">
                <iframe
                  src={`https://player.vimeo.com/video/${value.vimeoVideoId}?autoplay=0`}
                  className="w-full aspect-video"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Vimeo preview"
                />
              </div>
            )}
          </div>
        )}

        {/* --- Lottie --- */}
        {value.bannerType === "lottie" && (
          <div className="space-y-3 border-t border-border pt-4 mt-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Music className="h-4 w-4" /> Lottie Animation
            </h4>
            <Field label="Lottie JSON URL" hint="URL to a Lottie JSON animation file">
              <Input value={value.lottieUrl} onChange={e => onChange({ lottieUrl: e.target.value })} placeholder="https://..." />
            </Field>
          </div>
        )}

        {/* --- Responsive URLs --- */}
        <div className="space-y-3 border-t border-border pt-4 mt-4">
          <h4 className="text-sm font-semibold text-foreground">Responsive URLs (Optional)</h4>
          <Field label="Desktop URL" hint="Override for desktop screens">
            <Input value={value.desktopUrl} onChange={e => onChange({ desktopUrl: e.target.value })} placeholder="https://..." />
          </Field>
          <Field label="Tablet URL" hint="Override for tablet screens">
            <Input value={value.tabletUrl} onChange={e => onChange({ tabletUrl: e.target.value })} placeholder="https://..." />
          </Field>
          <Field label="Mobile URL" hint="Override for mobile screens">
            <Input value={value.mobileUrl} onChange={e => onChange({ mobileUrl: e.target.value })} placeholder="https://..." />
          </Field>
        </div>

        {/* --- Media Controls --- */}
        <div className="space-y-3 border-t border-border pt-4 mt-4">
          <h4 className="text-sm font-semibold text-foreground">Media Controls</h4>
          <div className="grid grid-cols-2 gap-3">
            <Toggle label="Autoplay" checked={value.autoplay} onChange={v => onChange({ autoplay: v })} />
            <Toggle label="Loop" checked={value.loop} onChange={v => onChange({ loop: v })} />
            <Toggle label="Muted" checked={value.muted} onChange={v => onChange({ muted: v })} />
            <Toggle label="Controls" checked={value.controls} onChange={v => onChange({ controls: v })} />
            <Toggle label="Play on Hover" checked={value.playOnHover} onChange={v => onChange({ playOnHover: v })} />
            <Toggle label="Lazy Load" checked={value.lazyLoad} onChange={v => onChange({ lazyLoad: v })} />
          </div>
        </div>

        {/* --- Overlay --- */}
        <div className="space-y-3 border-t border-border pt-4 mt-4">
          <h4 className="text-sm font-semibold text-foreground">Overlay</h4>
          <Toggle label="Enable Overlay" checked={value.overlayEnabled} onChange={v => onChange({ overlayEnabled: v })} />
          {value.overlayEnabled && (
            <>
              <Field label="Overlay Color">
                <ColorInput value={value.overlayColor} onChange={v => onChange({ overlayColor: v })} />
              </Field>
              <Field label="Overlay Gradient (CSS gradient)">
                <Input value={value.overlayGradient} onChange={e => onChange({ overlayGradient: e.target.value })} placeholder="linear-gradient(...)" />
              </Field>
              <Field label={`Opacity: ${value.overlayOpacity}%`}>
                <Slider min={0} max={100} step={1} value={value.overlayOpacity} onChange={v => onChange({ overlayOpacity: v })} />
              </Field>
            </>
          )}
        </div>

        {/* --- Banner Height --- */}
        <div className="space-y-3 border-t border-border pt-4 mt-4">
          <h4 className="text-sm font-semibold text-foreground">Banner Height</h4>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Desktop">
              <Input value={value.desktopHeight} onChange={e => onChange({ desktopHeight: e.target.value })} placeholder="600px" />
            </Field>
            <Field label="Laptop">
              <Input value={value.laptopHeight} onChange={e => onChange({ laptopHeight: e.target.value })} placeholder="500px" />
            </Field>
            <Field label="Tablet">
              <Input value={value.tabletHeight} onChange={e => onChange({ tabletHeight: e.target.value })} placeholder="400px" />
            </Field>
            <Field label="Mobile">
              <Input value={value.mobileHeight} onChange={e => onChange({ mobileHeight: e.target.value })} placeholder="300px" />
            </Field>
          </div>
        </div>

        {/* --- Banner Position --- */}
        <div className="space-y-3 border-t border-border pt-4 mt-4">
          <Field label="Banner Position">
            <Select value={value.bannerPosition} onChange={e => onChange({ bannerPosition: e.target.value as MediaConfig["bannerPosition"] })}>
              <option value="center">Center</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </Select>
          </Field>
        </div>

        {/* --- Object Fit --- */}
        <div className="space-y-3 border-t border-border pt-4 mt-4">
          <Field label="Object Fit">
            <Select value={value.objectFit} onChange={e => onChange({ objectFit: e.target.value as MediaConfig["objectFit"] })}>
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </Select>
          </Field>
        </div>

        {/* --- Border Radius --- */}
        <div className="space-y-3 border-t border-border pt-4 mt-4">
          <Field label={`Border Radius: ${value.borderRadius}px`}>
            <Slider min={0} max={50} step={1} value={value.borderRadius} onChange={v => onChange({ borderRadius: v })} />
          </Field>
        </div>

        {/* --- Shadow --- */}
        <div className="space-y-3 border-t border-border pt-4 mt-4">
          <h4 className="text-sm font-semibold text-foreground">Shadow</h4>
          <Toggle label="Enable Shadow" checked={value.shadowEnabled} onChange={v => onChange({ shadowEnabled: v })} />
          {value.shadowEnabled && (
            <div className="grid grid-cols-3 gap-3">
              <Field label={`Blur: ${value.shadowBlur}px`}>
                <Slider min={0} max={100} step={1} value={value.shadowBlur} onChange={v => onChange({ shadowBlur: v })} />
              </Field>
              <Field label={`Spread: ${value.shadowSpread}px`}>
                <Slider min={0} max={50} step={1} value={value.shadowSpread} onChange={v => onChange({ shadowSpread: v })} />
              </Field>
              <Field label={`Opacity: ${value.shadowOpacity}%`}>
                <Slider min={0} max={100} step={1} value={value.shadowOpacity} onChange={v => onChange({ shadowOpacity: v })} />
              </Field>
            </div>
          )}
        </div>

        {/* --- Glow --- */}
        <div className="space-y-3 border-t border-border pt-4 mt-4">
          <h4 className="text-sm font-semibold text-foreground">Glow Effect</h4>
          <Toggle label="Enable Glow" checked={value.glowEnabled} onChange={v => onChange({ glowEnabled: v })} />
          {value.glowEnabled && (
            <>
              <Field label="Glow Color">
                <ColorInput value={value.glowColor} onChange={v => onChange({ glowColor: v })} />
              </Field>
              <Field label={`Intensity: ${value.glowIntensity}%`}>
                <Slider min={0} max={100} step={1} value={value.glowIntensity} onChange={v => onChange({ glowIntensity: v })} />
              </Field>
            </>
          )}
        </div>

        {/* --- Animation --- */}
        <div className="space-y-3 border-t border-border pt-4 mt-4">
          <Field label="Animation Effect">
            <Select value={value.animation} onChange={e => onChange({ animation: e.target.value as MediaConfig["animation"] })}>
              <option value="none">None</option>
              <option value="fade">Fade</option>
              <option value="zoom">Zoom</option>
              <option value="parallax">Parallax</option>
              <option value="floating">Floating</option>
              <option value="scale">Scale</option>
              <option value="kenBurns">Ken Burns</option>
            </Select>
          </Field>
        </div>
      </SectionCard>

      {/* Media Library Modal */}
      {showLibrary && (
        <MediaLibrary
          onSelect={handleLibrarySelect}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </>
  )
}
