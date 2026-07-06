import type { Metadata } from "next"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { SectionHeader } from "@/components/ui/section-header"

export const metadata: Metadata = {
  title: "About | LinkDit",
  description: "Learn about LinkDit — your destination for discovering, comparing and mastering AI tools.",
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeader
            title="About LinkDit"
            description="Your premium destination for AI tool discovery."
          />
          <div className="mt-12 space-y-6 text-base leading-relaxed text-muted-foreground">
            <p>
              LinkDit is a curated directory of the best AI tools across every category —
              from writing and image generation to coding, marketing, and beyond.
            </p>
            <p>
              Our mission is to help creators, developers, students and businesses discover
              the right AI tools for their needs. We provide detailed reviews, side-by-side
              comparisons, pricing information, and community ratings so you can make
              informed decisions.
            </p>
            <p>
              Whether you are looking for a free AI writing assistant, the best image
              generator, or a powerful coding copilot, LinkDit makes it easy to find,
              compare, and choose the perfect tool.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
