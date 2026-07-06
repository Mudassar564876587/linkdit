import { Star, ArrowUpRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/ui/section-header"
import { ToolCardSkeleton } from "@/components/ui/skeleton"
import { getFeaturedTools } from "@/services/tools.service"
import { getAvatarColor, formatNumber } from "@/lib/utils"

export default async function FeaturedTools() {
  let tools: Awaited<ReturnType<typeof getFeaturedTools>> = []

  try {
    tools = await getFeaturedTools()
  } catch {
    console.error("Failed to load featured tools")
  }

  return (
    <section className="border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <SectionHeader
          title="Featured AI Tools"
          description="Hand-picked tools that are shaping the future of artificial intelligence."
        />

        <div className="mt-14 sm:mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.length === 0 ? (
            <div className="col-span-full mx-auto max-w-sm rounded-2xl border border-border/60 bg-background p-8 text-center shadow-soft-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5">
                <Sparkles className="h-6 w-6 text-primary/40" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">No featured tools yet</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Featured tools will appear here once they are curated.
              </p>
              <Link
                href="/tools"
                className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
              >
                Browse all tools
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            tools.map((tool) => (
              <article
                key={tool.id}
                className="group rounded-2xl border border-border bg-background p-5 shadow-soft-sm transition-all duration-200 hover:border-primary/20 hover:shadow-premium sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${getAvatarColor(tool.name)} text-base font-bold text-white shadow-sm sm:h-12 sm:w-12 sm:text-lg`}
                  >
                    {tool.name[0]}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      tool.pricing === "Free"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {tool.pricing}
                  </span>
                </div>

                <div className="mt-3.5 sm:mt-4">
                  <div className="mb-1.5">
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {tool.categoryName}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">
                    {tool.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4 sm:mt-5">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-foreground">
                      {tool.rating}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({formatNumber(tool.reviewCount)})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs opacity-0 transition-all group-hover:opacity-100"
                    asChild
                  >
                    <Link href={tool.websiteUrl} target="_blank">
                      Visit Tool
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export function FeaturedToolsSkeleton() {
  return (
    <section className="border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-7 w-44 animate-pulse rounded bg-muted sm:h-8 sm:w-48" />
          <div className="mx-auto mt-3 h-4 w-72 animate-pulse rounded bg-muted sm:mt-4 sm:h-5 sm:w-96" />
        </div>
        <div className="mt-14 sm:mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ToolCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
