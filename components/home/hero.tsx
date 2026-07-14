import Link from "next/link"
import { Sparkles, ArrowUpRight, Search } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"

const popularSearches = ["ChatGPT", "Claude", "Gemini", "Midjourney", "Cursor"]

export default async function Hero() {
  const supabase = await createServerSupabaseClient()

  const [{ count: toolCount }, { count: categoryCount }, { count: articleCount }] =
    await Promise.all([
      supabase.from("tools").select("*", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("is_published", true),
    ])

  return (
      <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-white">
        {/* Premium gradient orbs with depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-200/25 via-indigo-200/12 to-transparent blur-3xl" />
          <div className="absolute -left-60 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-300/15 to-indigo-200/6 blur-3xl animate-float-slow" />
          <div className="absolute -right-60 top-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-cyan-200/10 to-sky-100/5 blur-3xl animate-float-delayed" />
          <div className="absolute left-1/3 -bottom-20 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-200/10 to-blue-100/5 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #2563eb 1px, transparent 0)`, backgroundSize: "36px 36px" }} />
        </div>

        {/* Floating blobs */}
        <div className="pointer-events-none absolute left-[6%] top-[15%] h-36 w-36 rounded-full bg-gradient-to-br from-blue-400/15 to-indigo-400/10 blur-[100px] animate-float" aria-hidden="true" />
        <div className="pointer-events-none absolute right-[8%] top-[10%] h-44 w-44 rounded-full bg-gradient-to-br from-violet-400/15 to-indigo-400/10 blur-[100px] animate-float-delayed" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[35%] bottom-[15%] h-28 w-28 rounded-full bg-gradient-to-br from-cyan-400/12 to-teal-400/8 blur-[80px] animate-float-slow" aria-hidden="true" />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pb-32 sm:pt-28 lg:px-8 lg:pb-40 lg:pt-32">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="relative z-10 text-center lg:text-left">
              {/* Premium badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/80 backdrop-blur-xl px-4 py-1.5 text-[13px] font-medium text-primary shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                AI Discovery Platform
              </div>

              <h1 className="text-[2.25rem] font-bold leading-[1.04] tracking-[-0.035em] text-foreground sm:text-[3rem] lg:text-[3.75rem] xl:text-[4.5rem]">
                Find the Best{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent [filter:drop-shadow(0_0_20px_rgba(99,102,241,0.25))]">
                  AI Tools
                </span>
                <br />
                for Every Task
              </h1>

              <p className="mt-6 text-[1.0625rem] leading-[1.75] text-muted-foreground max-w-lg mx-auto lg:mx-0 sm:text-lg sm:leading-8">
                Discover, compare, and explore the world&apos;s best AI tools with detailed guides, expert comparisons, and curated collections designed to help you work smarter.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center lg:justify-start">
                <Link
                  href="/tools"
                  className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-9 py-4 text-[1.0625rem] font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-250 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 -translate-x-full group-hover:translate-x-full" />
                  <Sparkles className="h-5 w-5 relative" />
                  <span className="relative">Explore AI Tools</span>
                  <ArrowUpRight className="h-4 w-4 relative transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="/articles"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-white/90 px-8 py-4 text-[1.0625rem] font-semibold text-foreground shadow-sm backdrop-blur-sm transition-all duration-250 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 active:translate-y-0"
                >
                  Read Articles
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              {/* Premium Search */}
              <form
                action="/tools"
                method="GET"
                className="mx-auto mt-14 max-w-xl lg:mx-0"
                role="search"
              >
                <div className="group relative">
                  <div className="absolute -inset-1.5 rounded-[20px] bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-violet-500/20 opacity-0 blur-xl transition-all duration-250 group-hover:opacity-50 group-focus-within:opacity-100" />
                  <div className="relative flex items-center rounded-[16px] border border-border/50 bg-white/90 backdrop-blur-xl shadow-sm transition-all duration-250 group-hover:shadow-md group-hover:border-border/80 group-focus-within:border-primary/30 group-focus-within:shadow-[0_0_56px_rgba(99,102,241,0.18)]">
                    <div className="pointer-events-none absolute left-5 flex items-center">
                      <Search className="h-5 w-5 text-muted-foreground/50 transition-colors duration-250 group-focus-within:text-primary/60" />
                    </div>
                    <input
                      type="search"
                      name="q"
                      placeholder="Search AI tools..."
                      aria-label="Search AI tools"
                      autoComplete="off"
                      className="h-16 w-full rounded-[16px] bg-transparent pl-14 pr-36 text-[1rem] font-medium text-foreground placeholder:text-muted-foreground/50 caret-primary focus:outline-none sm:text-[1.0625rem] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                    />
                    <div className="absolute right-2">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/15 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
                      >
                        <Search className="h-4 w-4" />
                        <span>Search</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Trending Searches */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className="text-[13px] font-medium text-muted-foreground/60">Trending:</span>
                {popularSearches.map((term) => (
                  <Link
                    key={term}
                    href={`/tools?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-border/30 bg-white/60 backdrop-blur-sm px-3.5 py-2 text-xs font-medium text-muted-foreground/80 transition-all duration-200 hover:border-primary/25 hover:bg-blue-50/50 hover:text-primary hover:shadow-sm active:scale-95 sm:text-sm sm:py-1.5"
                  >
                    {term}
                  </Link>
                ))}
              </div>

              {/* Live stats mobile */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:hidden">
                {[
                  { value: toolCount, label: "tools" },
                  { value: categoryCount, label: "categories" },
                  { value: articleCount, label: "articles" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-1.5 whitespace-nowrap text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{(stat.value ?? 0).toLocaleString()}</span>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium hero visual — glowing AI hub with connected tool cards */}
            <div className="relative hidden lg:block" aria-hidden="true">
              <div className="relative mx-auto flex h-[560px] w-full max-w-lg items-center justify-center">
                {/* Deep background glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/10 via-indigo-400/8 to-violet-500/10 blur-[100px]" />
                </div>

                {/* Central glowing orb */}
                <div className="relative flex h-52 w-52 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 via-indigo-400/15 to-violet-500/20 blur-[60px] animate-breathe" />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-400/15 via-indigo-400/10 to-violet-500/15 blur-[40px] animate-float" />
                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 shadow-[0_0_80px_rgba(37,99,235,0.35),0_0_150px_rgba(99,102,241,0.2)]">
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                    <Sparkles className="h-14 w-14 text-white/90 relative" />
                  </div>
                  {/* Orbital rings */}
                  <div className="absolute inset-0 rounded-full border border-blue-200/15 animate-orbit" />
                  <div className="absolute inset-[-24px] rounded-full border border-indigo-200/8 animate-orbit-reverse" />
                  <div className="absolute inset-[-48px] rounded-full border border-blue-200/5 animate-orbit" style={{ animationDuration: "12s" }} />
                </div>

                {/* Connecting lines SVG */}
                <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <line x1="250" y1="280" x2="420" y2="80" stroke="url(#hero-grad-1)" strokeWidth="0.5" opacity="0.25" />
                  <line x1="250" y1="280" x2="80" y2="380" stroke="url(#hero-grad-2)" strokeWidth="0.5" opacity="0.25" />
                  <line x1="250" y1="280" x2="380" y2="460" stroke="url(#hero-grad-3)" strokeWidth="0.5" opacity="0.25" />
                  <line x1="250" y1="280" x2="100" y2="180" stroke="url(#hero-grad-4)" strokeWidth="0.5" opacity="0.25" />
                  <defs>
                    <linearGradient id="hero-grad-1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="hero-grad-2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="hero-grad-3" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="hero-grad-4" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Orbiting tool cards */}
                <div className="absolute right-0 top-4 animate-float" style={{ animationDelay: "0s" }}>
                  <div className="group rounded-2xl border border-white/60 bg-white/80 backdrop-blur-2xl px-5 py-4 shadow-lg transition-all duration-250 hover:shadow-xl hover:scale-105 hover:bg-white/95">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white shadow-sm">C</div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">ChatGPT</p>
                        <p className="text-[11px] text-muted-foreground">AI Assistant</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/50">Free</span>
                    </div>
                  </div>
                </div>

                <div className="absolute left-0 bottom-40 animate-float-delayed" style={{ animationDelay: "0.5s" }}>
                  <div className="group rounded-2xl border border-white/60 bg-white/80 backdrop-blur-2xl px-5 py-4 shadow-lg transition-all duration-250 hover:shadow-xl hover:scale-105 hover:bg-white/95">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white shadow-sm">C</div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Claude</p>
                        <p className="text-[11px] text-muted-foreground">AI Assistant</p>
                      </div>
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200/50">Pro</span>
                    </div>
                  </div>
                </div>

                <div className="absolute right-12 bottom-14 animate-float-slow" style={{ animationDelay: "1s" }}>
                  <div className="group rounded-2xl border border-white/60 bg-white/80 backdrop-blur-2xl px-5 py-4 shadow-lg transition-all duration-250 hover:shadow-xl hover:scale-105 hover:bg-white/95">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 text-sm font-bold text-white shadow-sm">M</div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Midjourney</p>
                        <p className="text-[11px] text-muted-foreground">Image Gen</p>
                      </div>
                      <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-semibold text-violet-700 border border-violet-200/50">Paid</span>
                    </div>
                  </div>
                </div>

                <div className="absolute left-8 top-36 animate-float" style={{ animationDelay: "0.3s" }}>
                  <div className="group rounded-2xl border border-white/60 bg-white/80 backdrop-blur-2xl px-5 py-4 shadow-lg transition-all duration-250 hover:shadow-xl hover:scale-105 hover:bg-white/95">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-bold text-white shadow-sm">G</div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Gemini</p>
                        <p className="text-[11px] text-muted-foreground">AI Assistant</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/50">Free</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live stats — desktop */}
              <div className="mt-8 flex items-center justify-center gap-10">
                {[
                  { value: toolCount, label: "AI Tools", gradient: "from-blue-500 to-indigo-500" },
                  { value: categoryCount, label: "Categories", gradient: "from-violet-500 to-purple-500" },
                  { value: articleCount, label: "Articles", gradient: "from-cyan-500 to-teal-500" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <span className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {(stat.value ?? 0).toLocaleString()}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </HeroClient>
  )
}
