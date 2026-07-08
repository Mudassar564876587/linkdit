import { Clock, CalendarDays, ArrowUpRight, Newspaper } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/ui/section-header"
import { ArticleCardSkeleton } from "@/components/ui/skeleton"
import { getLatestArticles } from "@/services/articles.service"
import { formatDate } from "@/lib/utils"

const articleStyles = [
  {
    gradient: "from-violet-500/20 to-purple-600/10",
    badge: "bg-violet-100 text-violet-700",
  },
  {
    gradient: "from-blue-500/20 to-indigo-600/10",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    gradient: "from-emerald-500/20 to-emerald-600/10",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    gradient: "from-amber-500/20 to-amber-600/10",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    gradient: "from-rose-500/20 to-rose-600/10",
    badge: "bg-rose-100 text-rose-700",
  },
  {
    gradient: "from-cyan-500/20 to-cyan-600/10",
    badge: "bg-cyan-100 text-cyan-700",
  },
]

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

        <div className="mt-14 sm:mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {articles.length === 0 ? (
            <div className="col-span-full mx-auto max-w-sm rounded-2xl border border-border/60 bg-background p-8 text-center shadow-soft-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5">
                <Newspaper className="h-6 w-6 text-primary/40" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">No articles published yet</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Articles will appear here once published.
              </p>
              <Link
                href="/articles"
                className="btn-primary"
              >
                Browse articles
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            articles.map((article, index) => {
              const style = articleStyles[index % articleStyles.length]
              return (
                <article
                  key={article.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-background shadow-soft-sm transition-all duration-200 hover:border-primary/20 hover:shadow-premium"
                >
                  <div
                    className={`flex h-40 items-center justify-center bg-gradient-to-br ${style.gradient} sm:h-48`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background/60 backdrop-blur-sm sm:h-16 sm:w-16">
                      <CalendarDays className="h-6 w-6 text-muted-foreground sm:h-7 sm:w-7" />
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${style.badge}`}
                    >
                      {article.categoryName}
                    </span>
                    <h3 className="mt-3 text-base font-semibold leading-snug text-foreground sm:text-lg">
                      {article.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground sm:mt-2">
                      {article.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3 sm:mt-4 sm:pt-4">
                      <div className="flex items-center gap-2.5 text-xs text-muted-foreground sm:gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {article.readTime}
                        </span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 transition-all group-hover:opacity-100"
                        asChild
                      >
                        <Link href={`/articles/${article.slug}`}>
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>
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
