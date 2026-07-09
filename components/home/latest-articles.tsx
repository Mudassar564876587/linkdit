import { Clock, CalendarDays, ArrowUpRight, Newspaper } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/ui/section-header"
import { ArticleCardSkeleton } from "@/components/ui/skeleton"
import { getLatestArticles } from "@/services/articles.service"
import { formatDate } from "@/lib/utils"
import LatestArticlesClient from "./latest-articles-client"

export default async function LatestArticles() {
  let articles: Awaited<ReturnType<typeof getLatestArticles>> = []

  try {
    articles = await getLatestArticles()
  } catch {
    console.error("Failed to load latest articles")
  }

  return (
    <section className="border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <SectionHeader
          title="Latest Articles"
          description="Stay ahead with tutorials, comparisons and insights from the AI world."
        />

        {articles.length === 0 ? (
          <div className="mt-14 sm:mt-16 mx-auto max-w-sm rounded-2xl border border-border/60 bg-background p-8 text-center shadow-soft-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5">
              <Newspaper className="h-6 w-6 text-primary/40" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">No articles published yet</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Articles will appear here once published.
            </p>
            <Link href="/articles" className="btn-primary">
              Browse articles
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="mt-14 sm:mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <LatestArticlesClient articles={articles} />
          </div>
        )}
      </div>
    </section>
  )
}

export function ArticlesSkeleton() {
  return (
    <section className="border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-7 w-44 animate-pulse rounded bg-muted sm:h-8 sm:w-48" />
          <div className="mx-auto mt-3 h-4 w-72 animate-pulse rounded bg-muted sm:mt-4 sm:h-5 sm:w-96" />
        </div>
        <div className="mt-14 sm:mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}