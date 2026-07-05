"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { adminCreateResource, adminUpdateResource } from "@/actions/admin/resources"

type Props = {
  categories: { id: string; name: string }[]
  initial?: any
}

export default function ResourceForm({ categories, initial }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setError(null)
    const fd = new FormData(e.currentTarget)

    const result = initial
      ? await adminUpdateResource(initial.id, fd)
      : await adminCreateResource(fd)

    setLoading(false)
    if (result.error) setError(result.error)
    else router.push("/admin/resources")
  }

  const initialFeatures = initial?.features ? (Array.isArray(initial.features) ? initial.features.join("\n") : "") : ""
  const initialTags = initial?.tags ? (Array.isArray(initial.tags) ? initial.tags.join(", ") : "") : ""

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-foreground">Name *</label>
        <input id="name" name="name" defaultValue={initial?.name} required
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="categoryId" className="text-sm font-medium text-foreground">Category</label>
          <select id="categoryId" name="categoryId" defaultValue={initial?.category_id || ""}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">None</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="pricing" className="text-sm font-medium text-foreground">Pricing</label>
          <select id="pricing" name="pricing" defaultValue={initial?.pricing || "Free"}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="Free">Free</option>
            <option value="Freemium">Freemium</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium text-foreground">Description</label>
        <textarea id="description" name="description" defaultValue={initial?.description || ""} rows={3}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
      </div>

      <div className="space-y-1">
        <label htmlFor="content" className="text-sm font-medium text-foreground">Content</label>
        <textarea id="content" name="content" defaultValue={initial?.content || ""} rows={10}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="websiteUrl" className="text-sm font-medium text-foreground">Website URL</label>
          <input id="websiteUrl" name="websiteUrl" type="url" defaultValue={initial?.website_url || ""}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="space-y-1">
          <label htmlFor="downloadUrl" className="text-sm font-medium text-foreground">Download URL</label>
          <input id="downloadUrl" name="downloadUrl" type="url" defaultValue={initial?.download_url || ""}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="coverUrl" className="text-sm font-medium text-foreground">Cover Image URL</label>
        <input id="coverUrl" name="coverUrl" defaultValue={initial?.cover_image_url || ""}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      <div className="space-y-1">
        <label htmlFor="features" className="text-sm font-medium text-foreground">Features (one per line)</label>
        <textarea id="features" name="features" defaultValue={initialFeatures} rows={4}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y" />
      </div>

      <div className="space-y-1">
        <label htmlFor="tags" className="text-sm font-medium text-foreground">Tags (comma separated)</label>
        <input id="tags" name="tags" defaultValue={initialTags}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="published" value="true" defaultChecked={initial?.is_published}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
          Publish
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {initial ? "Update Resource" : "Create Resource"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="h-10 rounded-lg border border-border px-5 text-sm font-medium text-muted-foreground hover:bg-accent">
          Cancel
        </button>
      </div>
    </form>
  )
}
