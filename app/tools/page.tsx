import type { Metadata } from "next"
export const dynamic = 'force-dynamic'
import { Suspense } from "react"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { ArrowUpRight, Sparkles, Search, ChevronRight, Star, Layers, Check, ShieldCheck } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ToolCard from "@/components/tools/tool-card"
import ToolFilters from "@/components/tools/tool-filters"
import SearchBar from "@/components/tools/search-bar"
import Pagination from "@/components/tools/pagination"
import type { ToolPlatform } from "@/types/tool"
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll"
import { ToolsFeaturesGrid } from "@/components/tools/tools-features-grid"

export const metadata: Metadata = {
  title: "AI Tools Directory",
  description: "Browse 1,000+ curated AI tools across every category. Compare features, read reviews, and find the perfect AI software for your needs.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "AI Tools Directory | LinkDit",
    description: "Browse 1,000+ curated AI tools across every category. Compare features, read reviews, and find the perfect AI software for your needs.",
    type: "website",
    siteName: "LinkDit",
    url: "/tools",
    images: [{ url: "/images/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Directory | LinkDit",
    description: "Browse 1,000+ curated AI tools across every category. Compare features, read reviews, and find the perfect AI software for your needs.",
    images: ["/images/og-default.png"],
  },
}

const PAGE_SIZE = 12

const faqItems = [
  {
    q: "What are AI tools?",
    a: "AI tools are software applications powered by artificial intelligence that automate tasks, generate content, analyze data, and enhance productivity across various domains."
  },
  {
    q: "How are tools verified on LinkDit?",
    a: "Each tool undergoes a manual review process. We verify functionality, security, pricing transparency, and user experience before marking a tool as verified."
  },
  {
    q: "Can I submit a tool for listing?",
    a: "Yes! Anyone can submit an AI tool for review. Simply use the Submit Tool form, and our team will evaluate it for inclusion in the directory."
  },
  {
    q: "What pricing models do tools have?",
    a: "Tools are categorized as Free, Freemium (free tier with paid upgrades), or Paid. Each tool's pricing badge reflects its primary model."
  }
]

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; pricing?: string; sort?: string; featured?: string; verified?: string; platform?: string | string[]; page?: string }>
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
    query.eq("categories.slug", sp.category.toLowerCase())
  }
  if (sp.pricing) {
    query.eq("pricing", sp.pricing as "Free" | "Preemium" | "Paid")
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
  if (sp.platform) {
    const platforms = Array.isArray(sp.platform) ? sp.platform : [sp.platform]
    if (platforms.length > 0) {
      query.overlaps("platforms", platforms)
    }
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

  const paginationParams = new URLSearchParams()
  if (sp.q) paginationParams.set("q", sp.q)
  if (sp.category) paginationParams.set("category", sp.category)
  if (sp.pricing) paginationParams.set("pricing", sp.pricing)
  if (sp.sort) paginationParams.set("sort", sp.sort)
  if (sp.featured) paginationParams.set("featured", sp.featured)
  if (sp.verified) paginationParams.set("verified", sp.verified)
  if (sp.platform) {
    const platforms = Array.isArray(sp.platform) ? sp.platform : [sp.platform]
    platforms.forEach(p => paginationParams.append("platform", p))
  }

  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-300/15 via-indigo-200/8 to-transparent blur-3xl" />
          <div className="absolute -left-40 top-1/3 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-violet-400/10 to-indigo-300/5 blur-3xl" />
          <div className="absolute -right-40 top-1/4 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-cyan-300/8 to-sky-200/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-white/70 backdrop-blur-xl px-4 py-1.5 text-xs font-medium text-primary shadow-sm">
              <Sparkles className="h-3 w-3" />
              Curated AI Tools Directory
            </div>

            <h1 className="text-[1.75rem] font-bold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-[2.25rem] lg:text-[3.25rem] xl:text-[4rem] xl:leading-[1.02]">
              One Platform.
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                Everything AI.
              </span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground max-w-xl mx-auto sm:text-lg lg:text-xl">
              Discover, compare, and master the world&apos;s most powerful AI tools. 
              Curated for creators, developers, and businesses.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/submit-tool" className="btn-primary text-base px-8 py-3.5 shadow-lg hover:shadow-xl">
                <Sparkles className="h-5 w-5" />
                Submit Your Tool
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/categories" className="btn-secondary text-base px-8 py-3.5 shadow-sm hover:shadow-md">
                <Layers className="h-5 w-5" />
                Browse Categories
              </Link>
            </div>

            <div className="mx-auto mt-8 max-w-xl">
              <SearchBar />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                {(count ?? 0).toLocaleString()} Tools
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-amber-400" />
                {categories?.length ?? 0} Categories
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Verified Listings
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Featured Tool Banner */}
        <RevealOnScroll>
        <div className="relative -mt-6 mb-10 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 shadow-xl">
          <div className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-blue-600/0 via-indigo-500/20 to-violet-600/0 animate-gradient opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          <div className="relative flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md shadow-lg ring-1 ring-white/20">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/15 backdrop-blur-sm px-3 py-0.5 text-[11px] font-semibold text-white/90 border border-white/10">
                  Featured
                </span>
                <span className="rounded-full bg-emerald-500/20 backdrop-blur-sm px-3 py-0.5 text-[11px] font-semibold text-emerald-200 border border-emerald-400/20">
                  Top Rated
                </span>
              </div>
              <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">Discover the Best AI Tools</h3>
              <p className="mt-1 text-sm text-blue-100/80 max-w-lg">
                Our team curates and reviews the top AI tools across every category. 
                Each listing includes verified ratings, pricing details, and in-depth comparisons.
              </p>
            </div>
            <Link href="/compare" className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 backdrop-blur-md px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-white/25 hover:-translate-y-0.5 active:translate-y-0 border border-white/10">
              Compare Tools
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        </RevealOnScroll>

        {/* Sticky Filter Bar */}
        <div className="sticky top-[calc(4rem+env(safe-area-inset-top,0px))] lg:top-[calc(4.5rem+env(safe-area-inset-top,0px))] z-30 -mx-4 px-4 py-3 backdrop-blur-2xl bg-white/80 border-y border-border/30 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-base font-semibold text-foreground whitespace-nowrap">AI Tools</h2>
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {count ?? 0}
              </span>
            </div>
            <Suspense fallback={<div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />}>
              <ToolFilters categories={categories ?? []} />
            </Suspense>
          </div>

          {sp.q && (
            <div className="mt-2 text-sm text-muted-foreground">
              Showing results for &ldquo;<span className="font-medium text-foreground">{sp.q}</span>&rdquo;
            </div>
          )}
        </div>

        {/* Tool Grid */}
        {!tools?.length ? (
          <div className="mt-20 mb-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No tools found</h3>
            <p className="mt-1.5 text-sm text-muted-foreground max-w-xs mx-auto">
              {sp.q ? `No results for "${sp.q}". Try a different search term or clear filters.` : "Try adjusting your filters to discover more tools."}
            </p>
            <Link href="/tools" className="btn-primary mt-5 inline-flex">
              Clear Filters
            </Link>
          </div>
        ) : (
          <div className="mt-6 mb-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                platforms={(t.platforms ?? []) as ToolPlatform[]}
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

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/tools"
          searchParams={paginationParams}
        />
      </div>

      {/* SEO Content Section */}
      <RevealOnScroll>
      <section className="border-t border-border/30 bg-gradient-to-b from-secondary/20 to-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[2.25rem] lg:text-[2.75rem] lg:leading-[1.1]">
              The Ultimate AI Tools Directory
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg max-w-lg mx-auto">
              LinkDit helps you navigate the rapidly expanding AI landscape with confidence.
            </p>
          </div>

          <ToolsFeaturesGrid />
        </div>
      </section>
      </RevealOnScroll>

      {/* FAQ Section */}
      <RevealOnScroll>
      <section className="border-t border-border/30">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[2.25rem] lg:text-[2.75rem] lg:leading-[1.1]">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base max-w-lg mx-auto">
              Everything you need to know about LinkDit&apos;s AI tools directory.
            </p>
          </div>

          <div className="mt-12 space-y-3">
            {faqItems.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-border/40 bg-white shadow-sm transition-all duration-200 hover:shadow-md open:shadow-md">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-foreground">
                  {item.q}
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-open:rotate-90" />
                </summary>
                <div className="border-t border-border/30 px-6 py-4 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              Still have questions?{" "}
              <Link href="/contact" className="font-medium text-primary hover:underline">
                Contact our team
              </Link>
            </p>
          </div>
        </div>
      </section>
      </RevealOnScroll>
    </div>
      <Footer />
    </>
  )
}
