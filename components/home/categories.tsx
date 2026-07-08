import Link from "next/link"
import { SectionHeader } from "@/components/ui/section-header"
import { CategoryCardSkeleton } from "@/components/ui/skeleton"
import { getCategories } from "@/services/categories.service"

import {
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
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
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

const categoryStyles: Record<
  string,
  { iconBg: string; gradient: string; border: string }
> = {
  "ai-writing": {
    iconBg: "bg-blue-100 text-blue-600",
    gradient: "from-blue-500/10 to-blue-600/5",
    border: "hover:border-blue-200",
  },
  "image-generation": {
    iconBg: "bg-violet-100 text-violet-600",
    gradient: "from-violet-500/10 to-violet-600/5",
    border: "hover:border-violet-200",
  },
  video: {
    iconBg: "bg-rose-100 text-rose-600",
    gradient: "from-rose-500/10 to-rose-600/5",
    border: "hover:border-rose-200",
  },
  coding: {
    iconBg: "bg-emerald-100 text-emerald-600",
    gradient: "from-emerald-500/10 to-emerald-600/5",
    border: "hover:border-emerald-200",
  },
  productivity: {
    iconBg: "bg-amber-100 text-amber-600",
    gradient: "from-amber-500/10 to-amber-600/5",
    border: "hover:border-amber-200",
  },
  marketing: {
    iconBg: "bg-cyan-100 text-cyan-600",
    gradient: "from-cyan-500/10 to-cyan-600/5",
    border: "hover:border-cyan-200",
  },
  audio: {
    iconBg: "bg-purple-100 text-purple-600",
    gradient: "from-purple-500/10 to-purple-600/5",
    border: "hover:border-purple-200",
  },
  analytics: {
    iconBg: "bg-orange-100 text-orange-600",
    gradient: "from-orange-500/10 to-orange-600/5",
    border: "hover:border-orange-200",
  },
  education: {
    iconBg: "bg-teal-100 text-teal-600",
    gradient: "from-teal-500/10 to-teal-600/5",
    border: "hover:border-teal-200",
  },
  design: {
    iconBg: "bg-pink-100 text-pink-600",
    gradient: "from-pink-500/10 to-pink-600/5",
    border: "hover:border-pink-200",
  },
}

export default async function Categories() {
  let categories: Awaited<ReturnType<typeof getCategories>> = []

  try {
    categories = await getCategories()
  } catch {
    console.error("Failed to load categories")
  }

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <SectionHeader
          title="Browse by Category"
          description="Find the perfect AI tool for your specific needs across every category."
        />

        <div className="mt-14 sm:mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.length === 0 ? (
            <div className="col-span-full mx-auto max-w-sm rounded-2xl border border-border/60 bg-background p-8 text-center shadow-soft-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5">
                <PenLine className="h-6 w-6 text-primary/40" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">No categories yet</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Categories will appear once tools are added.
              </p>
            </div>
          ) : (
            categories.map((category) => {
              const Icon = iconMap[category.iconName] ?? PenLine
              const styles =
                categoryStyles[category.slug] ?? categoryStyles["ai-writing"]!

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className={`group block rounded-2xl border border-border bg-gradient-to-br ${styles.gradient} p-5 shadow-soft-sm transition-all duration-200 ${styles.border} hover:shadow-premium active:scale-[0.98] sm:p-6`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles.iconBg} sm:h-12 sm:w-12`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground sm:mt-5 sm:text-lg">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {category.toolCount > 0 ? `${category.toolCount} ${category.toolCount === 1 ? "tool" : "tools"}` : "Coming Soon"}
                  </p>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}

export function CategoriesSkeleton() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-7 w-44 animate-pulse rounded bg-muted sm:h-8 sm:w-48" />
          <div className="mx-auto mt-3 h-4 w-72 animate-pulse rounded bg-muted sm:mt-4 sm:h-5 sm:w-96" />
        </div>
        <div className="mt-14 sm:mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
