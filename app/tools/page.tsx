import type { Metadata } from "next"
import { Suspense } from "react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ToolCard from "@/components/tools/tool-card"
import ToolFilters from "@/components/tools/tool-filters"
import SearchBar from "@/components/tools/search-bar"
import Pagination from "@/components/tools/pagination"

export const metadata: Metadata = {
  title: "AI Tools Directory | LinkDit",
  description: "Browse our curated collection of the best AI tools and software.",
  openGraph: {
    title: "AI Tools Directory | LinkDit",
    description: "Browse our curated collection of the best AI tools and software.",
    type: "website",
    siteName: "LinkDit",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Directory | LinkDit",
    description: "Browse our curated collection of the best AI tools and software.",
  },
}

const PAGE_SIZE = 12

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; pricing?: string; sort?: string; featured?: string; verified?: string; page?: string }>
}) {
  const sp = await searchParams
  const supabase = await createServerSupabaseClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("slug, name")
    .order("name")

  const page = Math.max(1, Number(sp.page) || 1)
  const query = supabase
    .from("tools")
    .select("*, categories(name)", { count: "exact" })
    .eq("is_published", true)

  if (sp.category) {
    query.eq("categories.slug", sp.category)
  }
  if (sp.pricing) {
    query.eq("pricing", sp.pricing as "Free" | "Freemium" | "Paid")
  }
  if (sp.featured === "true") {
    query.eq("featured", true)
  }
  if (sp.verified === "true") {
    query.eq("is_verified", true)
  }
  if (sp.q) {
    query.ilike("name", `%${sp.q}%`)
  }

  switch (sp.sort) {
    case "newest":
      query.order("created_at", { ascending: false })
      break
    case "popular":
      query.order("review_count", { ascending: false })
      break
    default:
      query.order("rating", { ascending: false })
  }

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  query.range(from, to)

  const { data: tools, count } = await query
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

  const searchParamsRecord: Record<string, string> = {}
  if (sp.q) searchParamsRecord.q = sp.q
  if (sp.category) searchParamsRecord.category = sp.category
  if (sp.pricing) searchParamsRecord.pricing = sp.pricing
  if (sp.sort) searchParamsRecord.sort = sp.sort
  if (sp.featured) searchParamsRecord.featured = sp.featured
  if (sp.verified) searchParamsRecord.verified = sp.verified

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Tools</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {count ?? 0} tool{(count ?? 0) !== 1 ? "s" : ""} found
            </p>
          </div>
          <SearchBar />
        </div>

        <Suspense fallback={<div className="h-12 animate-pulse rounded-xl bg-muted" />}>
          <ToolFilters categories={categories ?? []} />
        </Suspense>

        {sp.q && (
          <div className="mt-4 text-sm text-muted-foreground">
            Showing results for &ldquo;<span className="font-medium text-foreground">{sp.q}</span>&rdquo;
          </div>
        )}

        {!tools?.length ? (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">No tools found.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          basePath="/tools"
          searchParams={searchParamsRecord}
        />
      </div>
    </div>
  )
}
