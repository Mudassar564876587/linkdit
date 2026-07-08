"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, X } from "lucide-react"
import { adminUpdateTool, adminCreateTool } from "@/actions/admin/tools"
import { validateImage, compressImage } from "@/lib/upload"
import { Toast } from "@/components/ui/toast"

type Props = {
  categories: { id: string; name: string }[]
  initial?: any
  isNew?: boolean
}

export default function ToolForm({ categories, initial, isNew }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([])
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([])
  const [tagInput, setTagInput] = useState("")
  const logoInputRef = useRef<HTMLInputElement>(null)
  const screenshotInputRef = useRef<HTMLInputElement>(null)

  const initialFeatures = initial?.features ? (Array.isArray(initial.features) ? initial.features.join("\n") : "") : ""
  const initialPros = initial?.pros ? (Array.isArray(initial.pros) ? initial.pros.join("\n") : "") : ""
  const initialCons = initial?.cons ? (Array.isArray(initial.cons) ? initial.cons.join("\n") : "") : ""

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setError(null)
    const fd = new FormData(e.currentTarget)

    if (logoFile) {
      fd.set("logoFile", logoFile)
    }
    for (const f of screenshotFiles) {
      fd.append("screenshotFiles", f)
    }
    fd.set("tags", tagInput)

    if (isNew) {
      const result = await adminCreateTool(fd)
      setLoading(false)
      if ("error" in result) {
        setError(result.error)
        setToast({ message: result.error, type: "error" })
      } else {
        setToast({ message: "Tool created successfully!", type: "success" })
        setLogoFile(null)
        setLogoPreview(null)
        setScreenshotFiles([])
        setScreenshotPreviews([])
        setTagInput("")
        setTimeout(() => router.push("/linkdit-studio-8k92/tools"), 1000)
      }
    } else if (initial) {
      fd.set("tags", tagInput)
      const result = await adminUpdateTool(initial.id, fd)
      setLoading(false)
      if ("error" in result) {
        setError(result.error)
        setToast({ message: result.error, type: "error" })
      } else {
        setToast({ message: "Tool updated successfully!", type: "success" })
        setTimeout(() => router.push("/linkdit-studio-8k92/tools"), 1000)
      }
    }
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const err = validateImage(file)
    if (err) { setError(err); return }
    try {
      const compressed = await compressImage(file)
      const finalFile = new File([compressed], file.name, { type: file.type })
      setLogoFile(finalFile)
      setLogoPreview(URL.createObjectURL(compressed))
    } catch {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  function removeLogo() {
    setLogoFile(null)
    setLogoPreview(null)
    if (logoInputRef.current) logoInputRef.current.value = ""
  }

  async function handleScreenshotsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    for (const file of files) {
      const err = validateImage(file)
      if (err) { setError(err); return }
    }
    const newFiles: File[] = []
    const newPreviews: string[] = []
    for (const file of files) {
      try {
        const compressed = await compressImage(file)
        const finalFile = new File([compressed], file.name, { type: file.type })
        newFiles.push(finalFile)
        newPreviews.push(URL.createObjectURL(compressed))
      } catch {
        newFiles.push(file)
        newPreviews.push(URL.createObjectURL(file))
      }
    }
    setScreenshotFiles((prev) => [...prev, ...newFiles])
    setScreenshotPreviews((prev) => [...prev, ...newPreviews])
  }

  function removeScreenshot(i: number) {
    setScreenshotFiles((prev) => prev.filter((_, idx) => idx !== i))
    setScreenshotPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-foreground">Tool Name *</label>
          <input
            id="name" name="name" defaultValue={initial?.name} required
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="categoryId" className="text-sm font-medium text-foreground">Category *</label>
            <select
              id="categoryId" name="categoryId" defaultValue={initial?.category_id}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="pricing" className="text-sm font-medium text-foreground">Pricing</label>
            <select
              id="pricing" name="pricing" defaultValue={initial?.pricing || "Free"}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Free">Free</option>
              <option value="Freemium">Freemium</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="description" className="text-sm font-medium text-foreground">Description</label>
          <textarea
            id="description" name="description" defaultValue={initial?.description} rows={3}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="websiteUrl" className="text-sm font-medium text-foreground">Website URL *</label>
            <input
              id="websiteUrl" name="websiteUrl" type="url" defaultValue={initial?.website_url} required
              placeholder="https://example.com"
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="logoUrl" className="text-sm font-medium text-foreground">Logo URL</label>
            <input
              id="logoUrl" name="logoUrl" defaultValue={initial?.logo_url || ""}
              placeholder="https://example.com/logo.png"
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Upload Logo</label>
            <div className="flex items-center gap-3">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-input bg-background px-4 text-sm text-muted-foreground transition-colors hover:bg-accent"
              >
                <Upload className="h-4 w-4" />
                Choose file
              </button>
              {logoPreview && (
                <div className="relative">
                  <img src={logoPreview} alt="Logo preview" className="h-10 w-10 rounded-lg border object-cover" />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Screenshots</label>
            <div className="flex items-center gap-3">
              <input
                ref={screenshotInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleScreenshotsChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => screenshotInputRef.current?.click()}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-input bg-background px-4 text-sm text-muted-foreground transition-colors hover:bg-accent"
              >
                <Upload className="h-4 w-4" />
                Choose files
              </button>
            </div>
            {screenshotPreviews.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {screenshotPreviews.map((src, i) => (
                  <div key={i} className="group relative h-16 w-16 overflow-hidden rounded-lg border border-border">
                    <img src={src} alt={`Screenshot ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeScreenshot(i)}
                      className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="tags" className="text-sm font-medium text-foreground">Tags (comma-separated)</label>
          <input
            id="tags" name="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            defaultValue={initial?.id ? "" : undefined}
            placeholder="chatgpt, ai-writing, text-generation"
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="features" className="text-sm font-medium text-foreground">Features (one per line)</label>
          <textarea
            id="features" name="features" defaultValue={initialFeatures} rows={4}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="pros" className="text-sm font-medium text-foreground">Pros (one per line)</label>
            <textarea
              id="pros" name="pros" defaultValue={initialPros} rows={4}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="cons" className="text-sm font-medium text-foreground">Cons (one per line)</label>
            <textarea
              id="cons" name="cons" defaultValue={initialCons} rows={4}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="seoTitle" className="text-sm font-medium text-foreground">SEO Title</label>
            <input
              id="seoTitle" name="seoTitle" defaultValue={initial?.seo_title || ""}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="seoDescription" className="text-sm font-medium text-foreground">SEO Description</label>
            <input
              id="seoDescription" name="seoDescription" defaultValue={initial?.seo_description || ""}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="published" value="true" defaultChecked={initial?.is_published ?? true}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="featured" value="true" defaultChecked={initial?.featured}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="sponsored" value="true" defaultChecked={initial?.sponsored}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
            Sponsored
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="isVerified" value="true" defaultChecked={initial?.is_verified}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
            Verified
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-blue-500/15 transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : isNew ? "Create Tool" : "Update Tool"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="h-10 rounded-xl border border-input bg-background px-5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}
