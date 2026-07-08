"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { adminCreateArticle, adminUpdateArticle } from "@/actions/admin/articles"

type InitialData = {
  id: string
  title?: string
  content?: string
  description?: string
  category_id?: string
  cover_image_url?: string | null
  read_time?: string
  seo_title?: string | null
  seo_description?: string | null
  tags?: string[]
  is_published?: boolean
  featured?: boolean
}

type Props = {
  categories: { id: string; name: string }[]
  initial?: InitialData
}

export default function ArticleForm({ categories, initial }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setError(null)
    const fd = new FormData(e.currentTarget)

    const result = initial
      ? await adminUpdateArticle(initial.id, fd)
      : await adminCreateArticle(fd)

    setLoading(false)
    if (result.error) setError(result.error)
    else router.push("/linkdit-studio-8k92/articles")
  }

  const initialTags = initial?.tags ? initial.tags.join(", ") : ""

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium text-foreground">Title *</label>
        <input id="title" name="title" defaultValue={initial?.title} required
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="categoryId" className="text-sm font-medium text-foreground">Category</label>
          <select id="categoryId" name="categoryId" defaultValue={initial?.category_id}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">None</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="readTime" className="text-sm font-medium text-foreground">Read Time</label>
          <input id="readTime" name="readTime" defaultValue={initial?.read_time || "5 min"}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium text-foreground">Description</label>
        <textarea id="description" name="description" defaultValue={initial?.description} rows={3}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
      </div>

      <div className="space-y-1">
        <label htmlFor="coverUrl" className="text-sm font-medium text-foreground">Cover Image URL</label>
        <input id="coverUrl" name="coverUrl" defaultValue={initial?.cover_image_url || ""}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      <div className="space-y-1">
        <label htmlFor="tags" className="text-sm font-medium text-foreground">Tags (comma separated)</label>
        <input id="tags" name="tags" defaultValue={initialTags}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      <div className="space-y-1">
        <label htmlFor="content" className="text-sm font-medium text-foreground">Content *</label>
        <textarea id="content" name="content" defaultValue={initial?.content} required rows={15}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y" />
      </div>

      <fieldset className="rounded-xl border border-border p-4 space-y-3">
        <legend className="text-sm font-medium text-foreground px-1">SEO</legend>
        <div className="space-y-1">
          <label htmlFor="seoTitle" className="text-xs text-muted-foreground">SEO Title</label>
          <input id="seoTitle" name="seoTitle" defaultValue={initial?.seo_title ?? ""}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="space-y-1">
          <label htmlFor="seoDescription" className="text-xs text-muted-foreground">SEO Description</label>
          <textarea id="seoDescription" name="seoDescription" defaultValue={initial?.seo_description ?? ""} rows={2}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
        </div>
      </fieldset>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="published" value="true" defaultChecked={initial?.is_published}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
          Publish immediately
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {initial ? "Update Article" : "Create Article"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="h-10 rounded-lg border border-border px-5 text-sm font-medium text-muted-foreground hover:bg-accent">
          Cancel
        </button>
      </div>
    </form>
  )
}
