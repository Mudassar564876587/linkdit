import Link from "next/link"
import { Sparkles, ArrowUpRight, Star, BarChart3, TrendingUp } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import HeroClient from "./hero-client"

const popularSearches = ["ChatGPT", "Claude", "Gemini", "Midjourney", "Cursor"]

export default async function Hero() {
  const supabase = await createServerSupabaseClient()

  const [
    { count: toolCount },
    { count: categoryCount },
    { count: articleCount },
    { count: userCount },
    { count: reviewCount },
  ] = await Promise.all([
    supabase.from("tools").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_approved", true),
  ])

  return (
    <HeroClient>
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Premium gradient background with animated orbs */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white to-white" />
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-200/40 via-blue-100/20 to-transparent blur-3xl" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-violet-300/20 to-transparent blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-cyan-300/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-300/15 to-transparent blur-3xl" />

        {/* Animated floating gradient orbs */}
        <div
          className="absolute left-[15%] top-[20%] h-40 w-40 rounded-full bg-blue-400/15 blur-[80px] animate-float"
          aria-hidden="true"
        />
        <div
          className="absolute right-[20%] top-[15%] h-48 w-48 rounded-full bg-violet-400/15 blur-[80px] animate-float-delayed"
          aria-hidden="true"
        />
        <div
          className="absolute left-[40%] bottom-[25%] h-36 w-36 rounded-full bg-cyan-400/12 blur-[80px] animate-float-slow"
          aria-hidden="true"
        />
        <div
          className="absolute right-[30%] bottom-[35%] h-44 w-44 rounded-full bg-indigo-400/12 blur-[80px] animate-float-delayed"
          aria-hidden="true"
        />

        {/* Grid line overlay for tech feel */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pb-32 sm:pt-24 lg:px-8 lg:pb-40 lg:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 text-xs font-medium text-blue-700 shadow-soft-sm sm:text-sm">
                <Sparkles className="h-3 w-3" />
                Discover the Future of AI
              </div>

              {/* Heading */}
              <h1 className="text-[2.5rem] font-bold leading-tight tracking-tight text-foreground sm:text-[3.25rem] sm:leading-[1.1] lg:text-[3.75rem] lg:leading-[1.05]">
                Discover, Compare &{" "}
                <span className="brand-gradient-text">Master</span>
                <br />
                the World&apos;s Best AI Tools
              </h1>

              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
                Explore curated AI tools, in-depth comparisons, and expert tutorials
                designed to help creators, developers, and businesses work smarter.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row lg:justify-start">
                <Link href="/tools" className="btn-primary text-base px-6 py-3">
                  <Sparkles className="h-5 w-5" />
                  Explore AI Tools
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/articles" className="btn-secondary text-base px-6 py-3">
                  Read Articles
                </Link>
              </div>

              {/* Search */}
              <div className="mx-auto mt-10 max-w-xl lg:mx-0">
                <div className="group relative">
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 opacity-20 blur transition duration-300 group-hover:opacity-40" />
                  <div className="relative flex items-center">
                    <svg
                      className="absolute left-4 h-5 w-5 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search any AI tool..."
                      className="h-14 w-full rounded-2xl border border-input bg-white/80 backdrop-blur-sm pl-11 pr-36 text-sm shadow-soft-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-base"
                    />
                    <div className="absolute right-1.5">
                      <button className="btn-primary rounded-xl px-5 py-2.5 text-sm">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular searches */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground lg:justify-start">
                <span className="text-xs font-medium text-foreground">Popular:</span>
                {popularSearches.map((term) => (
                  <Link
                    key={term}
                    href={`/tools?search=${encodeURIComponent(term)}`}
                    className="rounded-full border border-border/60 bg-white/60 backdrop-blur-sm px-3 py-1.5 text-xs transition-all duration-200 hover:border-primary/30 hover:bg-blue-50/50 hover:text-primary active:scale-95 sm:text-sm"
                  >
                    {term}
                  </Link>
                ))}
              </div>

              {/* Trust badges - mobile */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:hidden">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">{toolCount ?? 0}</span> tools
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold text-foreground">{categoryCount ?? 0}</span> categories
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="font-semibold text-foreground">{articleCount ?? 0}</span> articles
                </div>
              </div>
            </div>

            {/* Right - Premium AI Dashboard */}
            <div className="relative hidden lg:block">
              <div className="relative mx-auto w-full max-w-lg">
                {/* Main dashboard card */}
                <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-premium-lg">
                  {/* Glass shine overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/5" />

                  {/* Dashboard header */}
                  <div className="relative border-b border-border/40 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                        </div>
                        <span className="ml-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          Platform Overview
                        </span>
                      </div>
                      <span className="flex items-center gap-1.5 text-[10px] text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
                        Live
                      </span>
                    </div>
                  </div>

                  {/* Dashboard body */}
                  <div className="relative p-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/30 p-4 ring-1 ring-blue-200/30">
                        <div className="flex items-center gap-2 text-blue-600">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span className="text-xs font-semibold uppercase tracking-wide">Tools</span>
                        </div>
                        <p className="mt-2 text-3xl font-bold text-foreground">{toolCount ?? 0}</p>
                        <p className="text-xs text-blue-600/70">curated AI tools</p>
                      </div>
                      <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/30 p-4 ring-1 ring-emerald-200/30">
                        <div className="flex items-center gap-2 text-emerald-600">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span className="text-xs font-semibold uppercase tracking-wide">Articles</span>
                        </div>
                        <p className="mt-2 text-3xl font-bold text-foreground">{articleCount ?? 0}</p>
                        <p className="text-xs text-emerald-600/70">expert guides</p>
                      </div>
                      <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/30 p-4 ring-1 ring-amber-200/30">
                        <div className="flex items-center gap-2 text-amber-600">
                          <Star className="h-4 w-4" />
                          <span className="text-xs font-semibold uppercase tracking-wide">Reviews</span>
                        </div>
                        <p className="mt-2 text-3xl font-bold text-foreground">{reviewCount ?? 0}</p>
                        <p className="text-xs text-amber-600/70">verified reviews</p>
                      </div>
                      <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100/30 p-4 ring-1 ring-violet-200/30">
                        <div className="flex items-center gap-2 text-violet-600">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                          </svg>
                          <span className="text-xs font-semibold uppercase tracking-wide">Users</span>
                        </div>
                        <p className="mt-2 text-3xl font-bold text-foreground">{userCount ?? 0}</p>
                        <p className="text-xs text-violet-600/70">active users</p>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard footer */}
                  <div className="border-t border-border/40 px-6 py-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Growing weekly</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BarChart3 className="h-3.5 w-3.5" />
                        <span>{categoryCount ?? 0} categories</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating tool badges */}
                <div className="absolute -right-8 top-16 animate-[float_3s_ease-in-out_infinite] rounded-xl border border-white/60 bg-white/80 backdrop-blur-md px-3.5 py-2.5 shadow-premium-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 text-[10px] font-bold text-white shadow-sm">
                      C
                    </div>
                    <span className="text-sm font-medium text-foreground">ChatGPT</span>
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">Free</span>
                  </div>
                </div>
                <div className="absolute -left-10 bottom-40 animate-[float-delayed_3.5s_ease-in-out_infinite] rounded-xl border border-white/60 bg-white/80 backdrop-blur-md px-3.5 py-2.5 shadow-premium-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-orange-400 to-orange-600 text-[10px] font-bold text-white shadow-sm">
                      C
                    </div>
                    <span className="text-sm font-medium text-foreground">Claude</span>
                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">Freemium</span>
                  </div>
                </div>
                <div className="absolute -right-6 bottom-28 animate-[float-slow_4s_ease-in-out_infinite] rounded-xl border border-white/60 bg-white/80 backdrop-blur-md px-3.5 py-2.5 shadow-premium-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-400 to-violet-600 text-[10px] font-bold text-white shadow-sm">
                      M
                    </div>
                    <span className="text-sm font-medium text-foreground">Midjourney</span>
                    <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700">Paid</span>
                  </div>
                </div>
                <div className="absolute -left-6 top-48 animate-[float-slow_4.5s_ease-in-out_infinite] rounded-xl border border-white/60 bg-white/80 backdrop-blur-md px-3.5 py-2.5 shadow-premium-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-blue-400 to-blue-600 text-[10px] font-bold text-white shadow-sm">
                      G
                    </div>
                    <span className="text-sm font-medium text-foreground">Gemini</span>
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">Free</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HeroClient>
  )
}
