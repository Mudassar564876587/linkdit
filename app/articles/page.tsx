import type { Metadata } from "next"
export const dynamic = 'force-dynamic'
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ArticleCard from "@/components/articles/article-card"
import Pagination from "@/components/tools/pagination"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Articles",
  description: "Stay ahead with tutorials, comparisons and insights from the AI world.",
  openGraph: {
    title: "Articles",
    description: "Stay ahead with tutorials, comparisons and insights from the AI world.",
    type: "website",
    siteName: "LinkDit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Articles | LinkDit",
    description: "Stay ahead with tutorials, comparisons and insights from the AI world.",
  },
}

const PAGE_SIZE = 9

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>
}) {
  const sp = await searchParams
  const supabase = await createServerSupabaseClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("slug, name")
    .order("name")

  const page = Math.max(1, Number(sp.page) || 1)

  const query = supabase
    .from("articles")
    .select("id, title, slug, description, cover_image_url, read_time, published_at, author_name, featured, categories(name), category_id", { count: "exact" })
    .eq("is_published", true)

  if (sp.category) {
    query.eq("categories.slug", sp.category.toLowerCase())
  }
  if (sp.q) {
    query.or(`title.ilike.%${sp.q}%,description.ilike.%${sp.q}%`)
  }

  query.order("featured", { ascending: false })
  query.order("published_at", { ascending: false, nullsFirst: false })
  query.order("created_at", { ascending: false })

  const from = (page - 1) * PAGE_SIZE
  query.range(from, from + PAGE_SIZE - 1)

  const { data: articles, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  const searchParamsRecord: Record<string, string> = {}
  if (sp.q) searchParamsRecord.q = sp.q
  if (sp.category) searchParamsRecord.category = sp.category

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Articles</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {count ?? 0} article{(count ?? 0) !== 1 ? "s" : ""} found
            </p>
          </div>
          <form action="/articles" method="GET" className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="text" name="q" defaultValue={sp.q || ""}
              placeholder="Search articles..."
              className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Search articles"
            />
          </form>
        </div>

        <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Category filter">
          <a
            href={buildUrl("/articles", { ...searchParamsRecord, category: "" })}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              !sp.category
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            All
          </a>
          {categories?.map((c) => (
            <a
              key={c.slug}
              href={buildUrl("/articles", { ...searchParamsRecord, category: sp.category === c.slug ? "" : c.slug })}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                sp.category === c.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {c.name}
            </a>
          ))}
        </div>

        {sp.q && (
          <div className="mb-6 text-sm text-muted-foreground">
            Showing results for &ldquo;<span className="font-medium text-foreground">{sp.q}</span>&rdquo;
          </div>
        )}

        {!articles?.length ? (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">No articles found.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard
                key={a.id}
                title={a.title}
                slug={a.slug}
                description={a.description}
                coverImageUrl={a.cover_image_url}
                readTime={a.read_time}
                publishedAt={a.published_at}
                authorName={a.author_name}
                featured={a.featured}
                categoryName={a.categories?.name}
              />
            ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/articles"
          searchParams={searchParamsRecord}
        />
      </div>
    </div>
  )
}

function buildUrl(base: string, params: Record<string, string>): string {
  const filtered = Object.entries(params).filter(([, v]) => v)
  if (filtered.length === 0) return base
  return `${base}?${new URLSearchParams(Object.fromEntries(filtered)).toString()}`
}
