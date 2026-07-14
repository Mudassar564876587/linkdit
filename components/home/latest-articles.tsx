import Link from "next/link"
import { ArrowUpRight, Newspaper } from "lucide-react"
import { SectionHeader } from "@/components/ui/section-header"
import { getLatestArticles } from "@/services/articles.service"
import LatestArticlesClient from "./latest-articles-client"

export default async function LatestArticles() {
  let articles: Awaited<ReturnType<typeof getLatestArticles>> = []

  try {
    articles = await getLatestArticles(3)
  } catch {
    console.error("Failed to load latest articles")
  }

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <SectionHeader
          title="Latest Articles"
          description="Stay ahead with tutorials, comparisons and insights from the AI world."
        />

        {articles.length === 0 ? (
          <div className="mt-14 mx-auto max-w-sm rounded-2xl border border-border/60 bg-white p-8 text-center shadow-premium">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5">
              <Newspaper className="h-6 w-6 text-primary/40" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">No articles published yet</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Articles will appear here once published.
            </p>
            <Link href="/articles" className="btn-primary mt-4 inline-flex">
              Browse articles
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              <LatestArticlesClient articles={articles} />
            </div>
            <div className="mt-10 text-center">
              <Link href="/articles" className="btn-secondary text-base px-8 py-3">
                View All Articles
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export function ArticlesSkeleton() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-7 w-44 animate-pulse rounded bg-muted sm:h-8 sm:w-48" />
          <div className="mx-auto mt-3 h-4 w-72 animate-pulse rounded bg-muted sm:mt-4 sm:h-5 sm:w-96" />
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-white shadow-premium-card overflow-hidden">
              <div className="h-40 animate-pulse bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-28 rounded-full bg-muted animate-pulse" />
                <div className="h-5 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                <div className="flex items-center justify-between border-t border-border/30 pt-4">
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
