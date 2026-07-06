import RatingStars from "@/components/tools/rating-stars"
import { formatDate } from "@/lib/utils"

type Review = {
  id: string
  rating: number
  title: string | null
  content: string | null
  pros: string[] | null
  cons: string[] | null
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
          {r.title && (
            <h4 className="mt-3 text-sm font-semibold text-foreground">{r.title}</h4>
          )}
          {r.content && (
            <p className="mt-1 text-sm text-muted-foreground">{r.content}</p>
          )}
          {(r.pros && r.pros.length > 0) || (r.cons && r.cons.length > 0) ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {r.pros && r.pros.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-emerald-600">Pros</p>
                  <ul className="mt-1 space-y-0.5">
                    {r.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <span className="mt-0.5 text-emerald-500">+</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {r.cons && r.cons.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-red-600">Cons</p>
                  <ul className="mt-1 space-y-0.5">
                    {r.cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <span className="mt-0.5 text-red-500">-</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
