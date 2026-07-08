"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, ArrowRightLeft } from "lucide-react"

type RecentComparison = {
  slug: string
  title: string
  toolAName: string
  toolBName: string
}

export default function RecentlyCompared() {
  const [recent] = useState<RecentComparison[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem("recentlyCompared")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  if (recent.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-foreground">Recently Compared</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Your recently viewed comparisons
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recent.slice(0, 4).map((r) => (
          <Link
            key={r.slug}
            href={`/compare/${r.slug}`}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-accent hover:border-primary/30"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {r.toolAName.charAt(0)}
            </div>
            <ArrowRightLeft className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {r.toolBName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {r.title || `${r.toolAName} vs ${r.toolBName}`}
              </p>
            </div>
            <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  )
}
