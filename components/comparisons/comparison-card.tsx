"use client"

import Link from "next/link"
import { ArrowRightLeft, Eye, Star, Trophy } from "lucide-react"
import type { ComparisonWithTools } from "@/types/comparison"

export default function ComparisonCard({
  comparison,
}: {
  comparison: ComparisonWithTools
}) {
  const aRating = comparison.toolA.rating
  const bRating = comparison.toolB.rating
  const winner = aRating > bRating ? "A" : bRating > aRating ? "B" : "tie"

  return (
    <Link
      href={`/compare/${comparison.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-border/80 bg-background p-6 shadow-soft transition-all duration-200 hover:shadow-premium hover:border-primary/20 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={`Compare ${comparison.toolA.name} vs ${comparison.toolB.name}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/[0.03] to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <LogoCircle src={comparison.toolA.logoUrl} name={comparison.toolA.name} />
            <ArrowRightLeft className="h-4 w-4 shrink-0 text-muted-foreground/60" aria-hidden="true" />
            <LogoCircle src={comparison.toolB.logoUrl} name={comparison.toolB.name} />
          </div>
          {comparison.isFeatured && (
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 shrink-0">
              Featured
            </span>
          )}
        </div>

        <h3 className="mt-4 text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {comparison.title || `${comparison.toolA.name} vs ${comparison.toolB.name}`}
        </h3>

        {comparison.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {comparison.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-lg bg-muted/70 px-2 py-0.5 font-medium">
            {comparison.toolA.pricing}
          </span>
          <span className="text-muted-foreground/40">&middot;</span>
          <span className="rounded-lg bg-muted/70 px-2 py-0.5 font-medium">
            {comparison.toolB.pricing}
          </span>
          {comparison.categoryName && (
            <>
              <span className="text-muted-foreground/40">&middot;</span>
              <span className="text-muted-foreground">{comparison.categoryName}</span>
            </>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4 border-t border-border/50 pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            {comparison.views.toLocaleString()} views
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            {aRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            {bRating.toFixed(1)}
          </div>
          {winner !== "tie" && (
            <div className="ml-auto flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
              <Trophy className="h-3 w-3" />
              {winner === "A" ? comparison.toolA.name : comparison.toolB.name}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

function LogoCircle({ src, name }: { src: string | null; name: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-primary overflow-hidden ring-1 ring-border/50 shadow-soft transition-transform group-hover:scale-105">
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        name.charAt(0)
      )}
    </div>
  )
}
