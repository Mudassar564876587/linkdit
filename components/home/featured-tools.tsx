import { ArrowUpRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { SectionHeader } from "@/components/ui/section-header"
import { ToolCardSkeleton } from "@/components/ui/skeleton"
import { getFeaturedTools } from "@/services/tools.service"
import FeaturedToolsClient from "./featured-tools-client"

export default async function FeaturedTools() {
  let tools: Awaited<ReturnType<typeof getFeaturedTools>> = []

  try {
    tools = await getFeaturedTools()
  } catch {
    console.error("Failed to load featured tools")
  }

  const displayTools = tools.slice(0, 8)

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <SectionHeader
          title="Featured AI Tools"
          description="Hand-picked tools that are shaping the future of artificial intelligence."
        />

        {displayTools.length === 0 ? (
          <div className="mt-14 mx-auto max-w-sm rounded-2xl border border-border/60 bg-white p-8 text-center shadow-premium">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5">
              <Sparkles className="h-6 w-6 text-primary/40" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">No featured tools yet</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Featured tools will appear here once they are curated.
            </p>
            <Link href="/tools" className="btn-primary mt-4 inline-flex">
              Browse all tools
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <FeaturedToolsClient tools={displayTools} />
            </div>
            <div className="mt-10 text-center">
              <Link href="/tools" className="btn-secondary text-base px-8 py-3">
                View All Tools
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export function FeaturedToolsSkeleton() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-7 w-44 animate-pulse rounded bg-muted sm:h-8 sm:w-48" />
          <div className="mx-auto mt-3 h-4 w-72 animate-pulse rounded bg-muted sm:mt-4 sm:h-5 sm:w-96" />
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ToolCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
