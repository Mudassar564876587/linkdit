import type { Metadata } from "next"
import { Suspense } from "react"
import { SITE } from "@/constants/site"

export const dynamic = 'force-dynamic'
import Navbar from "@/components/layout/navbar"
import Hero from "@/components/home/hero"
import TrustedBy from "@/components/home/trusted-by"
import PlatformStats from "@/components/home/platform-stats"
import FeaturedTools, {
  FeaturedToolsSkeleton,
} from "@/components/home/featured-tools"
import Categories, { CategoriesSkeleton } from "@/components/home/categories"
import TrendingTools from "@/components/home/trending-tools"
import LatestArticles, {
  ArticlesSkeleton,
} from "@/components/home/latest-articles"
import CommunityReviews from "@/components/home/community-reviews"
import CTASection from "@/components/home/cta-section"
import Newsletter from "@/components/home/newsletter"
import Footer from "@/components/layout/footer"

const description = "Discover, compare and master the world's best AI tools. Explore curated AI tools, in-depth comparisons, and expert tutorials designed to help creators, developers, and businesses work smarter."

export const metadata: Metadata = {
  title: `${SITE.name} – AI Discovery Platform`,
  description,
  metadataBase: new URL(SITE.url),
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE.name} – AI Discovery Platform`,
    description,
    url: "/",
    siteName: SITE.name,
    type: "website",
    locale: SITE.locale,
    images: [{ url: "/images/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} – AI Discovery Platform`,
    description,
    images: ["/images/og-default.png"],
  },
}

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/tools?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustedBy />
        <Suspense fallback={<div className="h-80 animate-pulse bg-muted" />}>
          <PlatformStats />
        </Suspense>
        <Suspense fallback={<FeaturedToolsSkeleton />}>
          <FeaturedTools />
        </Suspense>
        <Suspense fallback={<CategoriesSkeleton />}>
          <Categories />
        </Suspense>
        <Suspense fallback={<div className="h-96 animate-pulse bg-muted" />}>
          <TrendingTools />
        </Suspense>
        <Suspense fallback={<ArticlesSkeleton />}>
          <LatestArticles />
        </Suspense>
        <Suspense fallback={<div className="h-96 animate-pulse bg-muted" />}>
          <CommunityReviews />
        </Suspense>
        <CTASection />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
