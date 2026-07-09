"use client"

import Link from "next/link"
import { ExternalLink, Zap, ShieldCheck, Sparkles, Monitor, Smartphone, Laptop } from "lucide-react"
import TiltCard from "@/components/ui/tilt-card"
import RatingStars from "@/components/tools/rating-stars"
import type { ToolPlatform } from "@/types/tool"

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Web: Monitor, Mobile: Smartphone, Mac: Laptop, Windows: Monitor, Linux: Laptop, iOS: Smartphone, Android: Smartphone, Chrome: Monitor, API: Monitor,
}

type ToolCardProps = {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string | null
  websiteUrl: string
  pricing: string
  platforms?: ToolPlatform[]
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
  platforms,
  categoryName,
}: ToolCardProps) {
return (
    <TiltCard maxTilt={6}>
      <Link
        href={`/tools/${slug}`}
        className="group card-depth p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary block"
        aria-label={`View details for ${name}`}
      >
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

        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <RatingStars rating={rating} size={3.5} />
            <span className="text-xs text-muted-foreground" aria-label={`${rating.toFixed(1)} out of 5 stars, ${reviewCount} reviews`}>
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
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

        {platforms && platforms.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1">
            {platforms.map((p) => {
              const Icon = platformIcons[p] ?? Monitor
              return (
                <span key={p} className="inline-flex items-center gap-0.5 rounded-md bg-secondary/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  <Icon className="h-2.5 w-2.5" />
                  {p}
                </span>
              )
            })}
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="h-3 w-3" />
            Visit website
          </span>
        </div>
      </Link>
    </TiltCard>
  )
}