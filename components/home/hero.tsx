import Link from "next/link"
import { Sparkles, ArrowUpRight, Star, BarChart3, TrendingUp } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import HeroClient from "./hero-client"
import HeroDashboard from "./hero-dashboard"

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
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white to-white" />
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-200/40 via-blue-100/20 to-transparent blur-3xl" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-violet-300/20 to-transparent blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-cyan-300/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-300/15 to-transparent blur-3xl" />

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
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 text-xs font-medium text-blue-700 shadow-soft-sm sm:text-sm">
                <Sparkles className="h-3 w-3" />
                Discover the Future of AI
              </div>

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

            <div className="relative hidden lg:block">
              <div className="relative mx-auto w-full max-w-lg">
                <HeroDashboard
                  toolCount={toolCount ?? 0}
                  articleCount={articleCount ?? 0}
                  reviewCount={reviewCount ?? 0}
                  userCount={userCount ?? 0}
                  categoryCount={categoryCount ?? 0}
                />

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
                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">Preemium</span>
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
