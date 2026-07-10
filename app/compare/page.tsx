import type { Metadata } from "next"
export const dynamic = 'force-dynamic'
import { Suspense } from "react"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { SITE } from "@/constants/site"
import { getFeaturedComparisons, getTrendingComparisons } from "@/services/comparisons.service"
import ComparisonCard from "@/components/comparisons/comparison-card"
import CompareSearch from "./compare-search"
import ComparisonList from "./comparison-list"
import RecentlyCompared from "./recently-compared"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Compare AI Tools – Side-by-Side Comparison | LinkDit",
  description: "Compare the best AI tools side-by-side. See pricing, features, ratings, and more to make informed decisions. Find the perfect AI tool for your needs.",
  metadataBase: new URL(SITE.url),
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "Compare AI Tools – Side-by-Side Comparison | LinkDit",
    description: "Compare the best AI tools side-by-side. Find the perfect AI tool for your needs.",
    url: "/compare",
    siteName: "LinkDit",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare AI Tools – Side-by-Side Comparison | LinkDit",
    description: "Compare the best AI tools side-by-side. Find the perfect AI tool for your needs.",
  },
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; a?: string; b?: string }>
}) {
  const sp = searchParams ? await searchParams : undefined
  const searchQuery = sp?.q
  const toolA = sp?.a
  const toolB = sp?.b

  const isComparing = toolA && toolB

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <CompareHero />

          <div className="mt-8">
            <CompareSearch initialQuery={searchQuery || ""} initialToolA={toolA || ""} initialToolB={toolB || ""} />
          </div>

          {isComparing ? (
            <Suspense fallback={<ComparisonGridSkeleton count={3} />}>
              <CompareRedirectSearch toolA={toolA!} toolB={toolB!} />
            </Suspense>
          ) : searchQuery ? (
            <div className="mt-12 animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground">Search Results</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Comparisons matching &ldquo;{searchQuery}&rdquo;
              </p>
              <Suspense fallback={<ComparisonGridSkeleton count={6} />}>
                <ComparisonList search={searchQuery} />
              </Suspense>
            </div>
          ) : (
            <>
              <RecentlyCompared />

              <Suspense fallback={<ComparisonGridSkeleton count={3} />}>
                <FeaturedComparisonsSection />
              </Suspense>

              <Suspense fallback={<ComparisonGridSkeleton count={4} />}>
                <TrendingComparisonsSection />
              </Suspense>

              <div className="mt-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">All Comparisons</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Browse all tool comparisons</p>
                  </div>
                  <Link href="/compare?sort=all" className="btn-secondary text-sm">
                    View All <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <Suspense fallback={<ComparisonGridSkeleton count={6} />}>
                  <ComparisonList />
                </Suspense>
              </div>
            </>
          )}
        </div>

        <CTASection />
      </main>
      <Footer />
    </>
  )
}

function CompareHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-100/50 p-8 sm:p-12">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-200/20 to-transparent rounded-full blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 text-sm font-medium text-primary mb-3">
          <Sparkles className="h-4 w-4" />
          <span>AI Tool Comparisons</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Compare <span className="brand-gradient-text">AI Tools</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Make informed decisions with detailed side-by-side comparisons of the best AI tools.
          Find the perfect tool for your workflow.
        </p>
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Zap className="h-4 w-4" />
            </div>
            <span>Feature comparison</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span>Pricing breakdown</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <span>Winner highlights</span>
          </div>
        </div>
      </div>
    </div>
  )
}

async function CompareRedirectSearch({ toolA, toolB }: { toolA: string; toolB: string }) {
  const { createComparisonFromSlug } = await import("@/services/comparisons.service")
  const slug = await createComparisonFromSlug(toolA, toolB)
  if (slug) {
    const { redirect } = await import("next/navigation")
    redirect(`/compare/${slug}`)
  }
  return (
    <div className="mt-12 rounded-2xl border border-border bg-background p-12 text-center">
      <p className="text-muted-foreground">Could not find tools to compare. Please try again.</p>
    </div>
  )
}

async function FeaturedComparisonsSection() {
  const comparisons = await getFeaturedComparisons()
  if (comparisons.length === 0) return null
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Featured Comparisons</h2>
          <p className="mt-1 text-sm text-muted-foreground">Curated comparisons picked by our team</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {comparisons.length} comparisons
        </span>
      </div>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {comparisons.map((c) => (
          <ComparisonCard key={c.id} comparison={c} />
        ))}
      </div>
    </div>
  )
}

async function TrendingComparisonsSection() {
  const comparisons = await getTrendingComparisons(4)
  if (comparisons.length === 0) return null
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Trending Comparisons</h2>
          <p className="mt-1 text-sm text-muted-foreground">Most popular comparisons right now</p>
        </div>
      </div>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {comparisons.map((c) => (
          <ComparisonCard key={c.id} comparison={c} />
        ))}
      </div>
    </div>
  )
}

function ComparisonGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-background p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
          <Skeleton className="mt-4 h-6 w-3/4" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-2/3" />
          <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  )
}

function CTASection() {
  return (
    <div className="border-t border-border bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground">Can&apos;t find what you&apos;re looking for?</h2>
        <p className="mt-2 text-muted-foreground">
          Use the search above to find any two AI tools and compare them instantly.
        </p>
      </div>
    </div>
  )
}
