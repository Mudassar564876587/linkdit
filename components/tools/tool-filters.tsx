"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { SlidersHorizontal, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ToolPlatform } from "@/types/tool"

const pricingOptions = ["Free", "Preemium", "Paid"] as const

const sortOptions = [
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
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

  const toggleParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (params.get(key) === "true") params.delete(key)
      else params.set(key, "true")
      params.delete("page")
      router.push(`/tools?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearAll = useCallback(() => {
    router.push("/tools")
  }, [router])

  const hasFilters = currentCategory || currentPricing || currentFeatured === "true" || currentVerified === "true"

  return (
    <div className="flex flex-wrap items-center gap-2" role="search" aria-label="Filter AI tools">
      {/* Sort */}
      <select
        value={currentSort}
        onChange={(e) => setParam("sort", e.target.value)}
        className="h-8 rounded-lg border border-input bg-background/80 px-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer max-w-[120px] sm:max-w-none"
        aria-label="Sort tools"
      >
        {sortOptions.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      {/* Category dropdown */}
      <select
        value={currentCategory}
        onChange={(e) => setParam("category", e.target.value)}
        className="h-8 rounded-lg border border-input bg-background/80 px-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer max-w-[120px] sm:max-w-none"
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name}</option>
        ))}
      </select>

      {/* Pricing dropdown */}
      <select
        value={currentPricing}
        onChange={(e) => setParam("pricing", e.target.value)}
        className="h-8 rounded-lg border border-input bg-background/80 px-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer max-w-[100px] sm:max-w-none"
        aria-label="Filter by pricing"
      >
        <option value="">All Pricing</option>
        {pricingOptions.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* Verified toggle chip */}
      <button
        onClick={() => toggleParam("verified")}
        className={cn(
          "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-200",
          currentVerified === "true"
            ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
            : "border-input bg-background/80 text-muted-foreground hover:border-primary/20 hover:text-foreground"
        )}
      >
        {currentVerified === "true" && <Check className="h-3 w-3" />}
        Verified
      </button>

      {/* Featured toggle chip */}
      <button
        onClick={() => toggleParam("featured")}
        className={cn(
          "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-200",
          currentFeatured === "true"
            ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
            : "border-input bg-background/80 text-muted-foreground hover:border-primary/20 hover:text-foreground"
        )}
      >
        {currentFeatured === "true" && <Check className="h-3 w-3" />}
        Featured
      </button>

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-background/80 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-destructive/30 hover:text-destructive"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  )
}
