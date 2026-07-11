"use client"

import RatingStars from "@/components/tools/rating-stars"
import { formatDate } from "@/lib/utils"
import { ThumbsUp, ShieldCheck, CheckCircle, Clock, Briefcase, MapPin, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

type ReviewerProfile = {
  id: string
  full_name: string
  username: string
  avatar_url: string | null
  country: string
  city: string | null
  job_title: string
  industry: string | null
  experience_level: string
  years_of_experience: number | null
  helpful_count: number | null
}

type ReviewUser = {
  full_name: string | null
  avatar_url: string | null
}

type Review = {
  id: string
  rating: number
  title: string | null
  content: string | null
  pros: string[] | null
  cons: string[] | null
  best_for: string | null
  would_recommend: boolean | null
  helpful_count: number | null
  usage_duration: string | null
  primary_use_case: string | null
  verified_user: boolean | null
  verified_purchase: boolean | null
  created_at: string
  users: ReviewUser | null
  reviewer_profiles: ReviewerProfile | null
}

export default function ReviewCard({ review }: { review: Review }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count ?? 0)
  const [helpfulClicked, setHelpfulClicked] = useState(false)

  const profile = review.reviewer_profiles
  const displayName = profile?.full_name ?? review.users?.full_name ?? "Anonymous"
  const avatarUrl = profile?.avatar_url ?? review.users?.avatar_url ?? null
  const initials = displayName
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-muted-foreground/20">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-2 ring-border">
                {initials}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">{displayName}</span>
              {profile?.job_title && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Briefcase className="h-3 w-3" />
                  {profile.job_title}
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
              {profile?.country && (
                <span className="inline-flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  {profile.country}
                </span>
              )}
              <span>{formatDate(review.created_at)}</span>
              {review.usage_duration && (
                <span className="inline-flex items-center gap-0.5">
                  <Clock className="h-3 w-3" />
                  {review.usage_duration}
                </span>
              )}
            </div>
          </div>
        </div>
        <RatingStars rating={review.rating} size={3.5} />
      </div>

      {/* Badges */}
      <div className="mt-3 flex flex-wrap gap-2">
        {review.verified_purchase && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="h-3 w-3" />
            Verified Purchase
          </span>
        )}
        {review.verified_user && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/20 px-2.5 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <ShieldCheck className="h-3 w-3" />
            Verified User
          </span>
        )}
        {review.would_recommend && (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 dark:bg-violet-900/20 px-2.5 py-0.5 text-[11px] font-medium text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
            <ThumbsUp className="h-3 w-3" />
            Recommends
          </span>
        )}
      </div>

      {/* Primary use case */}
      {review.primary_use_case && (
        <div className="mt-2">
          <span className="text-xs text-muted-foreground">
            Used for: <span className="font-medium text-foreground">{review.primary_use_case}</span>
          </span>
        </div>
      )}

      {/* Title */}
      {review.title && (
        <h4 className="mt-3 text-sm font-semibold text-foreground">{review.title}</h4>
      )}

      {/* Content */}
      {review.content && (
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{review.content}</p>
      )}

      {/* Best for */}
      {review.best_for && (
        <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary">
          <Star className="h-3 w-3" />
          Best for: {review.best_for}
        </div>
      )}

      {/* Pros & Cons */}
      {(review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0) ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {review.pros && review.pros.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Pros</p>
              <ul className="mt-1.5 space-y-1">
                {review.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <span className="mt-0.5 shrink-0 text-emerald-500">+</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons && review.cons.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-600 dark:text-red-400">Cons</p>
              <ul className="mt-1.5 space-y-1">
                {review.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <span className="mt-0.5 shrink-0 text-red-500">-</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}

      {/* Helpful button */}
      <div className="mt-4 flex items-center gap-3 border-t border-border pt-3">
        <button
          onClick={() => {
            if (!helpfulClicked) {
              setHelpfulCount((c) => c + 1)
              setHelpfulClicked(true)
            }
          }}
          disabled={helpfulClicked}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            helpfulClicked
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <ThumbsUp className={cn("h-3.5 w-3.5", helpfulClicked && "fill-primary")} />
          Helpful ({helpfulCount})
        </button>
      </div>
    </div>
  )
}
