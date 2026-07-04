import { Star, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/ui/section-header"
import { ToolCardSkeleton } from "@/components/ui/skeleton"
import { getFeaturedTools } from "@/services/tools.service"
import { getAvatarColor, formatNumber } from "@/lib/utils"

export default async function FeaturedTools() {
  let tools: Awaited<ReturnType<typeof getFeaturedTools>> = []
  let error: string | null = null

  try {
    tools = await getFeaturedTools()
  } catch {
    error = "Unable to load featured tools."
  }

  return (
    <section className="border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <SectionHeader
          title="Featured AI Tools"
          description="Hand-picked tools that are shaping the future of artificial intelligence."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {error ? (
            <p className="col-span-full text-center text-sm text-muted-foreground">
              {error}
            </p>
          ) : tools.length === 0 ? (
            <p className="col-span-full text-center text-sm text-muted-foreground">
              No featured tools yet.
            </p>
          ) : (
            tools.map((tool) => (
              <article
                key={tool.id}
                className="group rounded-2xl border border-border bg-background p-6 transition-all duration-200 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${getAvatarColor(tool.name)} text-lg font-bold text-white shadow-sm`}
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

                <div className="mt-4">
                  <div className="mb-1.5">
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {tool.categoryName}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {tool.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
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
                    className="gap-1 text-xs opacity-0 transition-opacity group-hover:opacity-100"
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
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mx-auto mt-4 h-5 w-96 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ToolCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
