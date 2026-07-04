"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Pencil, Trash2, Loader2, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateReview, deleteReview } from "@/actions/dashboard/reviews"

type Review = {
  id: string
  rating: number
  content: string | null
  is_approved: boolean
  created_at: string
  updated_at: string
  tools: { name: string; slug: string }
}

function EditForm({ review, onDone }: { review: Review; onDone: () => void }) {
  const [rating, setRating] = useState(review.rating)
  const [content, setContent] = useState(review.content ?? "")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const fd = new FormData()
    fd.set("rating", String(rating))
    fd.set("content", content)
    const res = await updateReview(review.id, fd)
    setSubmitting(false)
    if (res?.error) { setError(res.error); return }
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)}
            className={`h-8 w-8 rounded-lg text-sm font-bold transition-colors ${n <= rating ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            {n}
          </button>
        ))}
      </div>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3}
        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="Write your review..." />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Save
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onDone}>
          <X className="h-4 w-4" /> Cancel
        </Button>
      </div>
    </form>
  )
}

export default function ReviewsList({ reviews }: { reviews: Review[] }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  if (!reviews.length) {
    return (
      <div className="rounded-xl border border-border p-8 text-center">
        <p className="text-muted-foreground">No reviews yet.</p>
        <Link href="/" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
          Browse AI tools
        </Link>
      </div>
    )
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    await deleteReview(id)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id}>
          {editingId === r.id ? (
            <EditForm review={r} onDone={() => { setEditingId(null); router.refresh() }} />
          ) : (
            <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <Link href={`/tools/${r.tools.slug}`} className="text-sm font-medium text-foreground hover:underline">
                  {r.tools.name}
                </Link>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{r.rating}/5</span>
                  {!r.is_approved && (
                    <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Pending</span>
                  )}
                </div>
              </div>
              {r.content && <p className="mt-2 text-sm text-muted-foreground">{r.content}</p>}
              <div className="mt-3 flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditingId(r.id)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)} disabled={deletingId === r.id} className="text-destructive hover:text-destructive">
                  {deletingId === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
