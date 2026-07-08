import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ToolCard from "@/components/tools/tool-card"
import Pagination from "@/components/tools/pagination"

const PAGE_SIZE = 12

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug.toLowerCase()
  const supabase = await createServerSupabaseClient()
  const { data: cat } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single()

  if (!cat) return { title: "Category not found" }

  return {
    title: `${cat.name} AI Tools`,
    description: cat.description,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: {
      title: `${cat.name} AI Tools`,
      description: cat.description,
      type: "website",
      siteName: "LinkDit",
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.name} AI Tools | LinkDit`,
      description: cat.description,
    },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const slug = (await params).slug.toLowerCase()
  const sp = await searchParams
  const supabase = await createServerSupabaseClient()

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!category) notFound()

  const page = Math.max(1, Number(sp.page) || 1)
  const from = (page - 1) * PAGE_SIZE

  const { data: tools, count } = await supabase
    .from("tools")
    .select("*, categories(name)", { count: "exact" })
    .eq("is_published", true)
    .eq("category_id", category.id)
    .order("rating", { ascending: false })
    .range(from, from + PAGE_SIZE - 1)

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  const { data: { user } } = await supabase.auth.getUser()
  let bookmarkedIds = new Set<string>()
  if (user) {
    const { data: bm } = await supabase
      .from("bookmarks")
      .select("tool_id")
      .eq("user_id", user.id)
    bookmarkedIds = new Set((bm ?? []).map((b) => b.tool_id!))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {category.description} &mdash; {count ?? 0} tool{(count ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>

        {!tools?.length ? (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">No tools in this category yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <ToolCard
                key={t.id}
                id={t.id}
                name={t.name}
                slug={t.slug}
                description={t.description}
                logoUrl={t.logo_url}
                websiteUrl={t.website_url}
                pricing={t.pricing}
                rating={t.rating}
                reviewCount={t.review_count}
                featured={t.featured}
                sponsored={t.sponsored}
                isVerified={t.is_verified}
                categoryName={t.categories?.name ?? ""}
                isBookmarked={bookmarkedIds.has(t.id)}
              />
            ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/categories/${slug}`}
        />
      </div>
    </div>
  )
}
