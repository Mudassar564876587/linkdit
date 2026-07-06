import { Clock, CalendarDays, ArrowUpRight } from "lucide-react"
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
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <SectionHeader
          title="Latest Articles"
          description="Stay ahead with tutorials, comparisons and insights from the AI world."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {articles.length === 0 ? (
            <p className="col-span-full text-center text-sm text-muted-foreground">
              No articles published yet.
            </p>
          ) : (
            articles.map((article, index) => {
              const style = articleStyles[index % articleStyles.length]
              return (
                <article
                  key={article.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-background transition-all duration-200 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div
                    className={`flex h-48 items-center justify-center bg-gradient-to-br ${style.gradient}`}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/60 backdrop-blur-sm">
                      <CalendarDays className="h-7 w-7 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="p-5">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${style.badge}`}
                    >
                      {article.categoryName}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground">
                      {article.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {article.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {article.readTime}
                        </span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
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
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mx-auto mt-4 h-5 w-96 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
