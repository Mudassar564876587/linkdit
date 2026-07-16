"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  Search,
  PenLine,
  Image,
  Video,
  Code2,
  Zap,
  BarChart3,
  Music,
  TrendingUp,
  BookOpen,
  Palette,
  Layers,
  Grid3X3,
  Clock,
} from "lucide-react"
import { cn, getCategoryIcon, formatDate } from "@/lib/utils"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PenLine,
  Image,
  Video,
  Code2,
  Zap,
  BarChart3,
  Music,
  TrendingUp,
  BookOpen,
  Palette,
}

const defaultIcon = PenLine

const categoryAccents: Record<string, { bg: string; icon: string }> = {
  "ai-writing": { bg: "bg-blue-50/70", icon: "text-blue-600" },
  "image-generation": { bg: "bg-violet-50/70", icon: "text-violet-600" },
  video: { bg: "bg-rose-50/70", icon: "text-rose-600" },
  coding: { bg: "bg-emerald-50/70", icon: "text-emerald-600" },
  productivity: { bg: "bg-amber-50/70", icon: "text-amber-600" },
  marketing: { bg: "bg-cyan-50/70", icon: "text-cyan-600" },
  audio: { bg: "bg-purple-50/70", icon: "text-purple-600" },
  analytics: { bg: "bg-orange-50/70", icon: "text-orange-600" },
  education: { bg: "bg-teal-50/70", icon: "text-teal-600" },
  design: { bg: "bg-pink-50/70", icon: "text-pink-600" },
}

const defaultAccent = { bg: "bg-blue-50/70", icon: "text-blue-600" }

type CategoryItem = {
  id: string
  name: string
  slug: string
  description: string
  iconName: string
  toolCount: number
}

interface CategoriesPageContentProps {
  categories: CategoryItem[]
  totalCategories: number
  totalTools: number
  latestUpdate: string | null
}

export function CategoriesPageContent({
  categories,
  totalCategories,
  totalTools,
  latestUpdate,
}: CategoriesPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const q = searchQuery.toLowerCase()
    return categories.filter((cat) => cat.name.toLowerCase().includes(q))
  }, [categories, searchQuery])

  const hasNoResults = searchQuery.trim() && filtered.length === 0

  return (
    <div className="bg-[#FAFBFF] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-6 lg:px-8 lg:pb-14 lg:pt-44">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <h1 className="text-[28px] font-bold tracking-tight text-foreground sm:text-[32px] lg:text-[36px]">
              Categories
            </h1>
            <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed">
              Browse AI tools by category and find the perfect tool for your workflow.
            </p>
          </div>
          <div className="relative w-full sm:w-72 lg:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-border/50 bg-white pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/8 transition-all duration-[var(--duration-fast)]"
              aria-label="Search categories"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-border/25 bg-white/80 px-6 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50/80">
              <Layers className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">{totalCategories}</p>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">Categories</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50/80">
              <Grid3X3 className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">{totalTools}</p>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">AI Tools</p>
            </div>
          </div>
          {latestUpdate && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50/80">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground leading-tight">{formatDate(latestUpdate)}</p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">Latest Update</p>
              </div>
            </div>
          )}
        </div>

        {hasNoResults ? (
          <div className="mt-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">No categories found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No results for &ldquo;{searchQuery}&rdquo;. Try a different search term.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="btn-primary mt-5 inline-flex"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cat, index) => {
              const Icon = iconMap[getCategoryIcon(cat.slug)] ?? defaultIcon
              const accent = categoryAccents[cat.slug] ?? defaultAccent
              const isEmpty = cat.toolCount === 0

              return (
                <Link
                  key={cat.id}
                  href={isEmpty ? "/submit-tool" : `/categories/${cat.slug}`}
                  className={cn(
                    "group relative flex flex-col rounded-[20px] border bg-white p-6 transition-all duration-[var(--duration-standard)] ease-[var(--ease-default)]",
                    isEmpty
                      ? "border-border/20 opacity-60 cursor-default"
                      : "border-border/30 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] hover:-translate-y-1.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05),0_8px_32px_rgba(0,0,0,0.04)] hover:border-primary/15 focus-visible:shadow-[0_4px_16px_rgba(0,0,0,0.05),0_8px_32px_rgba(0,0,0,0.04)] focus-visible:-translate-y-1.5",
                  )}
                  style={{
                    animation: `fade-in 0.35s ease forwards, slide-up 0.35s ease forwards`,
                    animationDelay: `${index * 40}ms`,
                    opacity: 0,
                  }}
                  aria-label={isEmpty ? `Suggest a tool for ${cat.name}` : `Browse ${cat.name} tools`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-[var(--duration-standard)] group-hover:scale-[1.03]",
                        isEmpty ? "bg-muted text-muted-foreground" : `${accent.bg} ${accent.icon}`,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[15px] font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-[var(--duration-fast)]">
                        {cat.name}
                      </h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {isEmpty ? "No tools yet" : `${cat.toolCount} ${cat.toolCount === 1 ? "tool" : "tools"}`}
                      </p>
                    </div>
                    <div className="shrink-0 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100 transition-all duration-[var(--duration-standard)]">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-border/30 transition-all duration-[var(--duration-standard)] group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                        <ArrowUpRight className="h-3.5 w-3.5 text-foreground" />
                      </div>
                    </div>
                  </div>
                  {cat.description && !isEmpty && (
                    <p className="mt-3.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                  {isEmpty && (
                    <p className="mt-3.5 text-sm text-muted-foreground/60">
                      Be the first to suggest a tool.
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
