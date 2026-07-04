import RatingStars from "@/components/tools/rating-stars"
import { formatDate } from "@/lib/utils"

type Review = {
  id: string
  rating: number
  content: string | null
  created_at: string
  users: { full_name: string; avatar_url: string | null } | null
}

export default function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) {
    return <p className="text-sm text-muted-foreground">No reviews yet.</p>
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-xl border border-border bg-background p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {(r.users?.full_name ?? "A").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {r.users?.full_name ?? "Anonymous"}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(r.created_at)}</p>
              </div>
            </div>
            <RatingStars rating={r.rating} size={3.5} />
          </div>
          {r.content && (
            <p className="mt-3 text-sm text-muted-foreground">{r.content}</p>
          )}
        </div>
      ))}
    </div>
  )
}
