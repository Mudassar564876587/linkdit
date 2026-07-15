import Link from "next/link"
import { Sparkles, ArrowRight, Search } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import HeroDashboard from "@/components/home/hero-dashboard"

const popularSearches = ["ChatGPT", "Claude", "Gemini", "Midjourney", "Cursor"]

export default async function Hero() {
  const supabase = await createServerSupabaseClient()

  const [
    { count: toolCount },
    { count: categoryCount },
    { count: articleCount },
    { count: reviewCount },
    { count: userCount },
  ] = await Promise.all([
    supabase.from("tools").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }),
  ])

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Subtle top grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8 lg:pb-32 lg:pt-28">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* Left column */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-[13px] font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI Discovery Platform
            </div>

            <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Find the best <span className="text-primary">AI tools</span> for every task
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground lg:mx-0">
              Discover, compare, and explore the world&apos;s best AI tools with detailed guides, expert
              comparisons, and curated collections designed to help you work smarter.
            </p>

            {/* Search */}
            <form action="/tools" method="GET" className="mx-auto mt-9 max-w-xl lg:mx-0" role="search">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-sm transition-colors focus-within:border-primary/50">
                <div className="pointer-events-none pl-2 text-muted-foreground">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="search"
                  name="q"
                  placeholder="Search AI tools..."
                  aria-label="Search AI tools"
                  autoComplete="off"
                  className="h-11 w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Trending */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="text-[13px] font-medium text-muted-foreground">Trending:</span>
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/tools?q=${encodeURIComponent(term)}`}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary sm:text-sm"
                >
                  {term}
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-start">
              <Link
                href="/tools"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Explore AI Tools
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Read Articles
              </Link>
            </div>
          </div>

          {/* Right column — dashboard mockup */}
          <div className="relative">
            <HeroDashboard
              toolCount={toolCount ?? 0}
              articleCount={articleCount ?? 0}
              reviewCount={reviewCount ?? 0}
              userCount={userCount ?? 0}
              categoryCount={categoryCount ?? 0}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
