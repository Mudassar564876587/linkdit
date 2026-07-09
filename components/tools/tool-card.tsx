"use client"

import Link from "next/link"
import { ExternalLink, Zap, ShieldCheck, Sparkles } from "lucide-react"
import TiltCard from "@/components/ui/tilt-card"
import RatingStars from "@/components/tools/rating-stars"

type ToolCardProps = {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string | null
  websiteUrl: string
  pricing: string
  rating: number
  reviewCount: number
  featured: boolean
  sponsored?: boolean
  isVerified?: boolean
  categoryName: string
  isBookmarked?: boolean
}

export default function ToolCard({
  name,
  slug,
  description,
  logoUrl,
  pricing,
  rating,
  reviewCount,
  featured,
  sponsored,
  isVerified,
  categoryName,
}: ToolCardProps) {
  return (
    <TiltCard maxTilt={6}>
      <Link
        href={`/tools/${slug}`}
        className="group card-depth p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary block"
        aria-label={`View details for ${name}`}
      >
        {/* Badges */}
        <div className="absolute -top-2.5 right-4 flex items-center gap-1.5">
          {sponsored && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-semibold text-white" aria-label="Sponsored tool">
              <Sparkles className="h-3 w-3" />
              Sponsored
            </span>
          )}
          {featured && !sponsored && (
            <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground" aria-label="Featured tool">
              <Zap className="h-3 w-3" />
              Featured
            </span>
          )}
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary" aria-hidden="true">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-full w-full rounded-xl object-cover" loading="lazy" />
            ) : (
              name.charAt(0)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="flex items-center gap-1.5 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
              {isVerified && (
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" aria-label="Verified tool" />
              )}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <RatingStars rating={rating} size={3.5} />
            <span className="text-xs text-muted-foreground" aria-label={`${rating.toFixed(1)} out of 5 stars, ${reviewCount} reviews`}>
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {categoryName}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
              pricing === "Free"
                ? "bg-emerald-50 text-emerald-700"
                : pricing === "Freemium"
                ? "bg-amber-50 text-amber-700"
                : "bg-violet-50 text-violet-700"
            }`}
          >
            {pricing}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
          <span className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="h-3 w-3" />
            Visit website
          </span>
        </div>
      </Link>
    </TiltCard>
  )
}