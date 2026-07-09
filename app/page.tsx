import { Suspense } from "react"

export const dynamic = 'force-dynamic'
import Navbar from "@/components/layout/navbar"
import Hero from "@/components/home/hero"
import FeaturedTools, {
  FeaturedToolsSkeleton,
} from "@/components/home/featured-tools"
import Categories, { CategoriesSkeleton } from "@/components/home/categories"
import LatestArticles, {
  ArticlesSkeleton,
} from "@/components/home/latest-articles"
import Newsletter from "@/components/home/newsletter"
import Footer from "@/components/layout/footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Suspense fallback={<FeaturedToolsSkeleton />}>
          <FeaturedTools />
        </Suspense>
        <Suspense fallback={<CategoriesSkeleton />}>
          <Categories />
        </Suspense>
        <Suspense fallback={<ArticlesSkeleton />}>
          <LatestArticles />
        </Suspense>
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
