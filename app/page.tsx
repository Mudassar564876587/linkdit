import type { Metadata } from "next"
import { Suspense } from "react"
import { SITE } from "@/constants/site"

export const dynamic = 'force-dynamic'
import Navbar from "@/components/layout/navbar"
import Hero from "@/components/home/hero"
import TrustedBy from "@/components/home/trusted-by"
import FeaturedTools, {
  FeaturedToolsSkeleton,
} from "@/components/home/featured-tools"
import Categories, { CategoriesSkeleton } from "@/components/home/categories"
import LatestArticles, {
  ArticlesSkeleton,
} from "@/components/home/latest-articles"
import CommunityReviews from "@/components/home/community-reviews"
import CTASection from "@/components/home/cta-section"
import Footer from "@/components/layout/footer"

const description = "Discover 1,000+ AI tools, in-depth comparisons, expert tutorials, and resources. Find the perfect AI solution for your workflow."

export const metadata: Metadata = {
  title: {
    absolute: "LinkDit – Discover, Compare & Master the World's Best AI Tools",
  },
  description,
  applicationName: SITE.name,
  metadataBase: new URL(SITE.url),
  alternates: { canonical: "/" },
  openGraph: {
    title: "LinkDit – Discover, Compare & Master the World's Best AI Tools",
    description,
    url: "/",
    siteName: SITE.name,
    type: "website",
    locale: SITE.localeOg,
    images: [{ url: "/images/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkDit – Discover, Compare & Master the World's Best AI Tools",
    description,
    images: ["/images/og-default.png"],
  },
}

export default function Home() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/favicon/favicon.png`,
      description,
      sameAs: [
        "https://twitter.com/linkdit",
        "https://github.com/linkdit",
        "https://linkedin.com/company/linkdit",
      ],
    },
    {
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
    },
    {
      "@context": "https://schema.org",
      "@type": "DataCatalog",
      name: "LinkDit AI Tools Directory",
      url: SITE.url,
      description: "Curated directory of 1,000+ AI tools, in-depth comparisons, tutorials and resources.",
      keywords: "AI Tools, Artificial Intelligence, AI Directory, ChatGPT, Claude, Midjourney, Cursor AI",
    },
  ]

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
        <Suspense fallback={<FeaturedToolsSkeleton />}>
          <FeaturedTools />
        </Suspense>
        <Suspense fallback={<CategoriesSkeleton />}>
          <Categories />
        </Suspense>
        <Suspense fallback={<ArticlesSkeleton />}>
          <LatestArticles />
        </Suspense>
        <Suspense fallback={null}>
          <CommunityReviews />
        </Suspense>
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
