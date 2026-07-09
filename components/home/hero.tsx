import Link from "next/link"
import { Search, Sparkles, ArrowUpRight, LayoutGrid, BookOpen, Mail, RefreshCw } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import HeroClient from "./hero-client"
import HeroFloatingStack from "./hero-floating-stack"

const popularSearches = ["ChatGPT", "Claude", "Gemini", "Midjourney", "Cursor"]

const chartBars = [
  { height: 32, color: "bg-blue-200" },
  { height: 52, color: "bg-blue-300" },
  { height: 42, color: "bg-blue-400" },
  { height: 68, color: "bg-blue-500" },
  { height: 60, color: "bg-blue-400" },
  { height: 82, color: "bg-blue-500" },
  { height: 90, color: "bg-blue-600" },
  { height: 76, color: "bg-blue-500" },
  { height: 88, color: "bg-blue-600" },
  { height: 96, color: "bg-blue-600" },
]

export default async function Hero() {
  const supabase = await createServerSupabaseClient()

  const [{ count: toolCount }, { count: categoryCount }, { count: articleCount }] = await Promise.all([
    supabase.from("tools").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("is_published", true),
  ])

  const stats = [
    { value: `${toolCount ?? 0}+`, label: "AI Tools", icon: LayoutGrid },
    { value: `${categoryCount ?? 0}`, label: "Categories", icon: BookOpen },
    { value: "Free", label: "Tool Submission", icon: Mail },
    { value: "Updated", label: "Weekly", icon: RefreshCw },
  ]

  const heroCardContent = (
    <div className="card-depth p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
      </div>

      <div className="mb-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            AI Tool Directory
          </span>
        </div>
        <div className="flex items-end gap-1.5">
          {chartBars.map((bar, index) => (
            <div
              key={index}
              className={`${bar.color} w-full rounded-t-sm transition-all duration-500`}
              style={{ height: `${bar.height}%` }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <div className="rounded-xl bg-secondary p-3.5 sm:p-4 icon-3d">
          <div className="text-xs text-muted-foreground">AI Tools</div>
          <div className="mt-0.5 text-lg font-semibold text-foreground sm:text-xl">
            {toolCount ?? 0}+
          </div>
        </div>
        <div className="rounded-xl bg-secondary p-3.5 sm:p-4 icon-3d">
          <div className="text-xs text-muted-foreground">Categories</div>
          <div className="mt-0.5 text-lg font-semibold text-foreground sm:text-xl">
            {categoryCount ?? 0}
          </div>
        </div>
        <div className="rounded-xl bg-secondary p-3.5 sm:p-4 icon-3d">
          <div className="text-xs text-muted-foreground">Articles</div>
          <div className="mt-0.5 text-lg font-semibold text-foreground sm:text-xl">
            {articleCount ?? 0}
          </div>
        </div>
        <div className="rounded-xl bg-secondary p-3.5 sm:p-4 icon-3d">
          <div className="text-xs text-muted-foreground">Updated</div>
          <div className="mt-0.5 text-lg font-semibold text-foreground sm:text-xl">
            Weekly
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <HeroClient>
      <section className="relative overflow-hidden">
        {/* Floating background orbs */}
        <div
          className="absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-blue-400/20 blur-[60px] animate-float"
          aria-hidden="true"
        />
        <div
          className="absolute right-[15%] top-[10%] h-56 w-56 rounded-full bg-violet-400/15 blur-[60px] animate-float-delayed"
          aria-hidden="true"
        />
        <div
          className="absolute left-[30%] bottom-[20%] h-48 w-48 rounded-full bg-cyan-400/15 blur-[60px] animate-float-slow"
          aria-hidden="true"
        />
        <div
          className="absolute right-[25%] bottom-[30%] h-64 w-64 rounded-full bg-indigo-400/15 blur-[60px] animate-float-delayed"
          aria-hidden="true"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-18 lg:px-8 lg:pb-36 lg:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-medium text-blue-700 sm:text-sm">
                <Sparkles className="h-3 w-3" />
                Discover the Future of AI
              </div>

              <h1 className="text-[2.25rem] font-bold leading-tight tracking-tight text-foreground sm:text-[2.75rem] sm:leading-tight lg:text-[3rem] lg:leading-tight">
                Discover, Compare & Master
                <br />
                the World&apos;s Best AI Tools
              </h1>

              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg sm:leading-8">
                Explore AI tools, tutorials, comparisons and resources designed to
                help creators, developers, students and businesses work smarter.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row lg:justify-start">
                <Link
                  href="/tools"
                  className="btn-primary"
                >
                  <Sparkles className="h-4 w-4" />
                  Explore AI Tools
                </Link>
                <Link
                  href="/articles"
                  className="btn-secondary"
                >
                  <BookOpen className="h-4 w-4" />
                  Read Articles
                </Link>
              </div>

              <div className="mx-auto mt-8 max-w-xl lg:mx-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:h-5 sm:w-5" />
                  <input
                    type="text"
                    placeholder="Search AI tools..."
                    className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-[9.5rem] text-sm shadow-soft-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:h-14 sm:pl-12 sm:text-base"
                  />
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                    <button className="btn-primary">
                      <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Search</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground lg:justify-start">
                <span className="text-xs font-medium text-foreground sm:text-sm">Popular:</span>
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    className="min-h-[36px] rounded-full border border-border bg-background px-3 py-1.5 text-xs transition-all duration-200 hover:border-primary hover:text-primary active:scale-95 sm:text-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="mt-8 sm:mt-10 lg:hidden">
                {heroCardContent}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative mx-auto w-full max-w-lg">
                {heroCardContent}

                {/* Floating tool badges */}
                <div className="absolute -right-8 top-12 animate-[float_3s_ease-in-out_infinite] rounded-xl border border-border/60 bg-white px-3.5 py-2.5 shadow-premium-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-foreground">ChatGPT</span>
                  </div>
                </div>
                <div className="absolute -left-8 bottom-32 animate-[float-delayed_3.5s_ease-in-out_infinite] rounded-xl border border-border/60 bg-white px-3.5 py-2.5 shadow-premium-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                    <span className="text-sm font-medium text-foreground">Claude</span>
                  </div>
                </div>
                <div className="absolute -right-6 bottom-16 animate-[float-slow_4s_ease-in-out_infinite] rounded-xl border border-border/60 bg-white px-3.5 py-2.5 shadow-premium-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                    <span className="text-sm font-medium text-foreground">Midjourney</span>
                  </div>
                </div>
              </div>

              <HeroFloatingStack />
            </div>
          </div>
        </div>
      </section>
    </HeroClient>
  )
}