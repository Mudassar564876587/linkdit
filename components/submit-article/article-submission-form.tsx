"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Send, Loader2, CheckCircle2, AlertCircle, X, Globe, Tag } from "lucide-react"
import { motion } from "framer-motion"
import { createArticleSubmission } from "@/actions/article-submissions"
import ImageUpload from "@/components/submit-tool/image-upload"

type ArticleSubmissionFormProps = {
  categories: { id: string; name: string }[]
}

export default function ArticleSubmissionForm({ categories }: ArticleSubmissionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [title, setTitle] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [coverImageUrl, setCoverImageUrl] = useState("")

  const parseTags = useCallback(() => {
    return tags.split(",").map((t) => t.trim()).filter(Boolean)
  }, [tags])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const fd = new FormData()
      fd.set("title", title)
      fd.set("categoryId", categoryId)
      fd.set("description", description)
      fd.set("content", content)
      fd.set("tags", JSON.stringify(parseTags()))
      if (coverImageUrl) fd.set("coverImageUrl", coverImageUrl)

      const result = await createArticleSubmission(fd)

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => { router.push("/dashboard/my-submissions") }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6"
        >
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Article Submitted!</h2>
        <p className="text-sm text-muted-foreground mb-4">Your article has been submitted for review. Redirecting...</p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ duration: 2 }}
          className="h-1.5 rounded-full bg-emerald-500"
        />
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-auto">
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          placeholder="e.g. How to Use AI for Content Creation"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="categoryId" className="text-sm font-medium text-foreground">
          Category <span className="text-destructive">*</span>
        </label>
        <select
          id="categoryId"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-foreground">
          Short Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          placeholder="Brief excerpt of your article (10–500 characters)"
        />
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground">Required</span>
          <span className={description.length > 500 ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>{description.length}/500</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="content" className="text-sm font-medium text-foreground">
          Article Content (Markdown) <span className="text-destructive">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={16}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-y font-mono leading-relaxed"
          placeholder="Write your article content in markdown... (minimum 50 characters)"
        />
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground">Markdown supported</span>
          <span className={content.length < 50 && content.length > 0 ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>{content.length} chars (min 50)</span>
        </div>
      </div>

      <ImageUpload
        label="Cover Image"
        name="coverImageUrl"
        bucket="media"
        onChange={(urls) => setCoverImageUrl(urls[0] || "")}
      />

      <div className="space-y-1.5">
        <label htmlFor="tags" className="text-sm font-medium text-foreground">
          Tags <span className="text-muted-foreground font-normal">(comma-separated)</span>
        </label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="AI, content creation, tutorial"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-10 items-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Submit for Review
        </button>
      </div>
    </form>
  )
}
