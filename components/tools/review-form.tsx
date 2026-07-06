"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitReview } from "@/actions/reviews"
import { Star, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ReviewForm({ toolId, isAuthenticated }: { toolId: string; isAuthenticated: boolean }) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isAuthenticated) {
      router.push("/login?redirectTo=" + encodeURIComponent(window.location.pathname))
      return
    }
    if (rating === 0) {
      setError("Please select a rating.")
      return
    }
    setLoading(true); setError(null)
    const result = await submitReview(toolId, rating, content)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setRating(0)
      setContent("")
      router.refresh()
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-border bg-background p-5">
        <p className="text-sm text-emerald-600 font-medium">Review submitted! It will appear after approval.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-background p-5 space-y-4">
      <h3 className="text-base font-semibold text-foreground">Write a review</h3>

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-colors"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                "h-6 w-6",
                star <= (hoverRating || rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your experience with this tool..."
        rows={3}
        maxLength={2000}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit review
      </button>
    </form>
  )
}
