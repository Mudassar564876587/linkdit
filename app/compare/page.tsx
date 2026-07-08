import type { Metadata } from "next"
import { Suspense } from "react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { SITE } from "@/constants/site"
import { SectionHeader } from "@/components/ui/section-header"
import { getFeaturedComparisons, getPopularComparisons } from "@/services/comparisons.service"
import ComparisonCard from "@/components/comparisons/comparison-card"
import ComparisonSearch from "./comparison-search"
import ComparisonList from "./comparison-list"
import RecentlyCompared from "./recently-compared"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Compare AI Tools – Side-by-Side Comparison",
  description: "Compare the best AI tools side-by-side. See pricing, features, ratings, and more to make informed decisions.",
  metadataBase: new URL(SITE.url),
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "Compare AI Tools – Side-by-Side Comparison",
    description: "Compare the best AI tools side-by-side. See pricing, features, ratings, and more to make informed decisions.",
    url: "/compare",
    siteName: "LinkDit",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare AI Tools – Side-by-Side Comparison | LinkDit",
    description: "Compare the best AI tools side-by-side. See pricing, features, ratings, and more to make informed decisions.",
  },
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>
}) {
  const sp = searchParams ? await searchParams : undefined
  const searchQuery = sp?.q

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <SectionHeader
            title="Compare AI Tools"
            description="Make informed decisions with detailed side-by-side comparisons of the best AI tools."
          />

          <div className="mt-8">
            <ComparisonSearch initialQuery={searchQuery || ""} />
          </div>

          {searchQuery ? (
            <div className="mt-12">
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

              <div className="mt-12">
                <h2 className="text-2xl font-bold text-foreground">All Comparisons</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse all tool comparisons
                </p>
                <Suspense fallback={<ComparisonGridSkeleton count={6} />}>
                  <ComparisonList />
                </Suspense>
              </div>

              <Suspense fallback={<ComparisonGridSkeleton count={4} />}>
                <PopularComparisonsSection />
              </Suspense>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

async function FeaturedComparisonsSection() {
  const comparisons = await getFeaturedComparisons()

  if (comparisons.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-foreground">Featured Comparisons</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {comparisons.map((c) => (
          <ComparisonCard key={c.id} comparison={c} />
        ))}
      </div>
    </div>
  )
}

async function PopularComparisonsSection() {
  const comparisons = await getPopularComparisons(4)

  if (comparisons.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-foreground">Popular Comparisons</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Most viewed comparisons
      </p>
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
        <div key={i} className="rounded-xl border border-border bg-background p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          <Skeleton className="mt-4 h-5 w-3/4" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-4 h-4 w-1/2" />
          <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  )
}
