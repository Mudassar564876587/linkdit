import type { Metadata } from "next"
export const dynamic = 'force-dynamic'
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ArticleCard from "@/components/articles/article-card"
import Pagination from "@/components/tools/pagination"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { SITE } from "@/constants/site"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug.toLowerCase()
  const supabase = await createServerSupabaseClient()
  const { data: category } = await supabase.from("categories").select("name, description").eq("slug", slug).single()

  if (!category) return { title: "Category not found" }

  return {
    title: `${category.name} Articles`,
    description: category.description || `Browse articles in the ${category.name} category.`,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: `/articles/category/${slug}` },
    openGraph: {
      title: `${category.name} Articles`,
      description: category.description || `Browse articles in the ${category.name} category.`,
      url: `/articles/category/${slug}`,
      siteName: "LinkDit",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} Articles | LinkDit`,
      description: category.description || `Browse articles in the ${category.name} category.`,
    },
  }
}

const PAGE_SIZE = 9

export default async function CategoryArticlesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const slug = (await params).slug.toLowerCase()
  const sp = await searchParams
  const supabase = await createServerSupabaseClient()

  const { data: category } = await supabase.from("categories").select("*").eq("slug", slug).single()
  if (!category) notFound()

  const page = Math.max(1, Number(sp.page) || 1)

  const query = supabase
    .from("articles")
    .select("id, title, slug, description, cover_image_url, read_time, published_at, author_name, featured, categories(name)", { count: "exact" })
    .eq("is_published", true)
    .eq("category_id", category.id)

  query.order("published_at", { ascending: false, nullsFirst: false })
  query.order("created_at", { ascending: false })

  const from = (page - 1) * PAGE_SIZE
  query.range(from, from + PAGE_SIZE - 1)

  const { data: articles, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ChevronLeft className="h-4 w-4" /> All Articles
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{category.name} Articles</h1>
          {category.description && (
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{category.description}</p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            {count ?? 0} article{(count ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>

        {!articles?.length ? (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">No articles in this category yet.</p>
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

        <Pagination currentPage={page} totalPages={totalPages} basePath={`/articles/category/${slug}`} />
      </div>
    </div>
  )
}
