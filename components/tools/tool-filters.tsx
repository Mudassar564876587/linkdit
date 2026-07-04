"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

const pricingOptions = ["Free", "Freemium", "Paid"]
const sortOptions = [
  { value: "rating", label: "Highest rated" },
  { value: "newest", label: "Newest first" },
  { value: "popular", label: "Most popular" },
]

export default function ToolFilters({ categories }: { categories: { slug: string; name: string }[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category") ?? ""
  const currentPricing = searchParams.get("pricing") ?? ""
  const currentSort = searchParams.get("sort") ?? "rating"
  const currentFeatured = searchParams.get("featured") ?? ""
  const currentVerified = searchParams.get("verified") ?? ""

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      params.delete("page")
      router.push(`/tools?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="space-y-4" role="search" aria-label="Filter AI tools">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Filters
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Category filter">
        <button
          onClick={() => setParam("category", "")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            !currentCategory
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
          aria-pressed={!currentCategory}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setParam("category", c.slug)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              currentCategory === c.slug
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            aria-pressed={currentCategory === c.slug}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={currentPricing}
          onChange={(e) => setParam("pricing", e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="Filter by pricing"
        >
          <option value="">All pricing</option>
          {pricingOptions.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={currentSort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="Sort tools"
        >
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={currentFeatured === "true"}
            onChange={(e) => setParam("featured", e.target.checked ? "true" : "")}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-2"
            aria-label="Show featured tools only"
          />
          Featured only
        </label>

        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={currentVerified === "true"}
            onChange={(e) => setParam("verified", e.target.checked ? "true" : "")}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-2"
            aria-label="Show verified tools only"
          />
          Verified only
        </label>
      </div>
    </div>
  )
}
