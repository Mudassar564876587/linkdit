"use client"

import Link from "next/link"
import { ArrowRightLeft, Eye } from "lucide-react"
import TiltCard from "@/components/ui/tilt-card"
import type { ComparisonWithTools } from "@/types/comparison"

export default function ComparisonCard({
  comparison,
}: {
  comparison: ComparisonWithTools
}) {
  return (
    <TiltCard maxTilt={6}>
      <Link
        href={`/compare/${comparison.slug}`}
        className="group card-depth p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary block"
        aria-label={`Compare ${comparison.toolA.name} vs ${comparison.toolB.name}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary overflow-hidden">
              {comparison.toolA.logoUrl ? (
                <img src={comparison.toolA.logoUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
              ) : (
                comparison.toolA.name.charAt(0)
              )}
            </div>
            <ArrowRightLeft className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary overflow-hidden">
              {comparison.toolB.logoUrl ? (
                <img src={comparison.toolB.logoUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
              ) : (
                comparison.toolB.name.charAt(0)
              )}
            </div>
          </div>
          {comparison.isFeatured && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
              Featured
            </span>
          )}
        </div>

        <h3 className="mt-4 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
          {comparison.title || `${comparison.toolA.name} vs ${comparison.toolB.name}`}
        </h3>

        {comparison.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {comparison.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-md bg-muted px-2 py-0.5 font-medium">
            {comparison.toolA.pricing}
          </span>
          <span className="text-muted-foreground/50">&middot;</span>
          <span className="rounded-md bg-muted px-2 py-0.5 font-medium">
            {comparison.toolB.pricing}
          </span>
          {comparison.categoryName && (
            <>
              <span className="text-muted-foreground/50">&middot;</span>
              <span>{comparison.categoryName}</span>
            </>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" aria-hidden="true" />
            {comparison.views} views
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-500" aria-hidden="true">★</span>
            {comparison.toolA.rating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-500" aria-hidden="true">★</span>
            {comparison.toolB.rating.toFixed(1)}
          </div>
        </div>
      </Link>
    </TiltCard>
  )
}