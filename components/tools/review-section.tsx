"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { submitReview, updateReview, deleteToolReview } from "@/actions/reviews"
import { Star, Loader2, Pencil, Trash2, X, Check, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"

type UserReview = {
  id: string
  rating: number
  title: string | null
  content: string | null
  pros: string[] | null
  cons: string[] | null
  is_approved: boolean
  created_at: string
  updated_at: string
} | null

export default function ReviewSection({
  toolId,
  isAuthenticated,
  existingReview,
}: {
  toolId: string
  isAuthenticated: boolean
  existingReview: UserReview
}) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!isAuthenticated) {
    const loginHref = typeof window !== "undefined"
      ? `/login?redirectTo=${encodeURIComponent(window.location.pathname)}`
      : "/login"
    return (
      <div className="rounded-xl border border-border bg-background p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Please sign in to submit a review.
        </p>
        <Link
          href={loginHref}
          className="mt-3 inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <LogIn className="h-4 w-4" />
          Sign In
        </Link>
      </div>
    )
  }

  if (existingReview && !editing) {
    return (
      <div className="rounded-xl border border-border bg-background p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Your review</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "h-4 w-4",
                      s <= existingReview.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              {!existingReview.is_approved && (
                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                  Pending approval
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setEditing(true)}
              className="flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={async () => {
                if (!confirm("Delete your review?")) return
                setDeleting(true)
                await deleteToolReview(existingReview.id)
                router.refresh()
              }}
              disabled={deleting}
              className="flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Delete
            </button>
          </div>
        </div>

        {existingReview.title && (
          <h4 className="mt-3 text-sm font-semibold text-foreground">{existingReview.title}</h4>
        )}
        {existingReview.content && (
          <p className="mt-1 text-sm text-muted-foreground">{existingReview.content}</p>
        )}

        {existingReview.pros && existingReview.pros.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-emerald-600">Pros</p>
            <ul className="mt-1 space-y-0.5">
              {existingReview.pros.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-0.5 text-emerald-500">+</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
        {existingReview.cons && existingReview.cons.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-medium text-red-600">Cons</p>
            <ul className="mt-1 space-y-0.5">
              {existingReview.cons.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-0.5 text-red-500">-</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <h3 className="text-base font-semibold text-foreground">
        {existingReview ? "Edit your review" : "Write a review"}
      </h3>
      <ReviewForm
        toolId={toolId}
        existingReview={existingReview}
        onSuccess={() => {
          setEditing(false)
          router.refresh()
        }}
      />
    </div>
  )
}

function ReviewForm({
  toolId,
  existingReview,
  onSuccess,
}: {
  toolId: string
  existingReview: UserReview
  onSuccess: () => void
}) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState(existingReview?.title ?? "")
  const [content, setContent] = useState(existingReview?.content ?? "")
  const [prosText, setProsText] = useState(existingReview?.pros?.join("\n") ?? "")
  const [consText, setConsText] = useState(existingReview?.cons?.join("\n") ?? "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (rating === 0) {
      setError("Please select a rating.")
      return
    }
    if (!title.trim()) {
      setError("Review title is required.")
      return
    }
    if (!content.trim()) {
      setError("Review content is required.")
      return
    }

    setLoading(true)

    const pros = prosText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
    const cons = consText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)

    let result: { error?: string; success?: boolean } | undefined

    if (existingReview) {
      result = await updateReview(existingReview.id, title.trim(), content.trim(), rating, pros, cons)
    } else {
      result = await submitReview(toolId, title.trim(), content.trim(), rating, pros, cons)
    }

    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      onSuccess()
    }
  }

  if (success) {
    return (
      <p className="text-sm text-emerald-600 font-medium">
        Review submitted! It will appear after approval.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Rating *
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star === rating ? 0 : star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  "h-7 w-7",
                  star <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="review-title" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Review Title *
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={200}
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="review-content" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Review *
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience with this tool in detail..."
          rows={4}
          maxLength={2000}
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
      </div>

      <div>
        <label htmlFor="review-pros" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Pros <span className="font-normal normal-case text-muted-foreground/60">(one per line)</span>
        </label>
        <textarea
          id="review-pros"
          value={prosText}
          onChange={(e) => setProsText(e.target.value)}
          placeholder="Easy to use&#10;Great customer support&#10;Fast performance"
          rows={3}
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
      </div>

      <div>
        <label htmlFor="review-cons" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Cons <span className="font-normal normal-case text-muted-foreground/60">(one per line)</span>
        </label>
        <textarea
          id="review-cons"
          value={consText}
          onChange={(e) => setConsText(e.target.value)}
          placeholder="Steep learning curve&#10;Limited integrations&#10;Expensive"
          rows={3}
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {existingReview ? "Update review" : "Submit review"}
        </button>
        {existingReview && (
          <button
            type="button"
            onClick={onSuccess}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-input px-5 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
