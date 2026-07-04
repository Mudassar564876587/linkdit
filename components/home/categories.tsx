import { SectionHeader } from "@/components/ui/section-header"
import { CategoryCardSkeleton } from "@/components/ui/skeleton"
import { getCategories } from "@/services/categories.service"
import { getCategoryIcon } from "@/lib/utils"
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
  let error: string | null = null

  try {
    categories = await getCategories()
  } catch {
    error = "Unable to load categories."
  }

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <SectionHeader
          title="Browse by Category"
          description="Find the perfect AI tool for your specific needs across every category."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {error ? (
            <p className="col-span-full text-center text-sm text-muted-foreground">
              {error}
            </p>
          ) : categories.length === 0 ? (
            <p className="col-span-full text-center text-sm text-muted-foreground">
              No categories yet.
            </p>
          ) : (
            categories.map((category) => {
              const Icon = iconMap[category.iconName] ?? PenLine
              const styles =
                categoryStyles[category.slug] ?? categoryStyles["ai-writing"]!

              return (
                <article
                  key={category.id}
                  className={`group cursor-pointer rounded-2xl border border-border bg-gradient-to-br ${styles.gradient} p-6 transition-all duration-200 ${styles.border} hover:shadow-lg`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {category.toolCount} tools
                  </p>
                </article>
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
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mx-auto mt-4 h-5 w-96 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
