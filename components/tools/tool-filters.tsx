"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { SlidersHorizontal, Monitor, Smartphone, Laptop } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ToolPlatform } from "@/types/tool"

const pricingOptions = ["Free", "Freemium", "Paid"] as const

const platformOptions: { value: ToolPlatform; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "Web", label: "Web", icon: Monitor },
  { value: "Mobile", label: "Mobile", icon: Smartphone },
  { value: "Mac", label: "Mac", icon: Laptop },
  { value: "Windows", label: "Windows", icon: Monitor },
  { value: "Linux", label: "Linux", icon: Laptop },
  { value: "iOS", label: "iOS", icon: Smartphone },
  { value: "Android", label: "Android", icon: Smartphone },
  { value: "Chrome", label: "Chrome", icon: Monitor },
  { value: "API", label: "API", icon: Monitor },
]

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
  const currentPlatforms = searchParams.getAll("platform")

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

  const togglePlatform = useCallback(
    (platform: string) => {
      const params = new URLSearchParams(searchParams.toString())
      const current = params.getAll("platform")
      params.delete("platform")
      const exists = current.includes(platform)
      for (const p of current) if (p !== platform) params.append("platform", p)
      if (exists) {
        if (!params.has("platform")) {}
      } else {
        params.append("platform", platform)
      }
      params.delete("page")
      router.push(`/tools?${params.toString()}`)
    },
    [router, searchParams]
  )

  const isAllPlatforms = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("platform")
    params.delete("page")
    router.push(`/tools?${params.toString()}`)
  }, [router, searchParams])

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

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground mr-1">Platform:</span>
        <button
          onClick={isAllPlatforms}
          className={cn(
            "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
            !currentPlatforms.length
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
          aria-pressed={!currentPlatforms.length}
        >
          All
        </button>
        {platformOptions.map((p) => {
          const isActive = currentPlatforms.includes(p.value)
          const Icon = p.icon
          return (
            <button
              key={p.value}
              onClick={() => togglePlatform(p.value)}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              aria-pressed={isActive}
            >
              <Icon className="h-3 w-3" />
              {p.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}