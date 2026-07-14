import Link from "next/link"
import { Sparkles, ArrowUpRight, Search } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import HeroClient from "./hero-client"
import HeroDashboard from "./hero-dashboard"
import HeroFloatingStack from "./hero-floating-stack"

const popularSearches = ["ChatGPT", "Claude", "Gemini", "Midjourney", "Cursor"]

export default async function Hero() {
  const supabase = await createServerSupabaseClient()

  const [{ count: toolCount }, { count: categoryCount }, { count: articleCount }, { count: userCount }, { count: reviewCount }] =
    await Promise.all([
      supabase.from("tools").select("*", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_approved", true),
    ])

  return (
    <HeroClient>
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-300/20 via-indigo-200/10 to-transparent blur-3xl animate-pulse-soft" />
          <div className="absolute -left-72 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-400/15 to-indigo-300/5 blur-3xl" />
          <div className="absolute -right-72 top-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-cyan-300/10 to-sky-200/5 blur-3xl" />
          <div className="absolute left-1/3 bottom-0 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-300/10 to-blue-200/5 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #2563eb 1px, transparent 0)`, backgroundSize: "40px 40px" }}
          />
        </div>

        <div data-parallax className="pointer-events-none absolute left-[10%] top-[15%] h-48 w-48 rounded-full bg-gradient-to-br from-blue-400/15 to-indigo-400/10 blur-[100px] animate-float" aria-hidden="true" />
        <div data-parallax className="pointer-events-none absolute right-[12%] top-[10%] h-56 w-56 rounded-full bg-gradient-to-br from-violet-400/15 to-indigo-400/10 blur-[100px] animate-float-delayed" aria-hidden="true" />
        <div data-parallax className="pointer-events-none absolute left-[45%] bottom-[15%] h-40 w-40 rounded-full bg-gradient-to-br from-cyan-400/10 to-teal-400/10 blur-[100px] animate-float-slow" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 sm:pb-32 sm:pt-36 lg:px-8 lg:pb-40 lg:pt-44">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="relative z-10 text-center lg:text-left">
              <div className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-white/70 backdrop-blur-xl px-4 py-1.5 text-xs font-medium text-primary shadow-sm">
                <Sparkles className="h-3 w-3" />
                AI Discovery Platform
              </div>

              <h1 className="text-[2rem] font-bold leading-[1.08] tracking-[-0.03em] text-foreground xs:text-[2.5rem] sm:text-[3.5rem] lg:text-[4.25rem] xl:text-[5rem] xl:leading-[1.02]">
                Discover, Compare &{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent animate-gradient [filter:drop-shadow(0_0_20px_rgba(99,102,241,0.35))]">
                  Master
                </span>
                <br />
                the World&apos;s Best AI Tools
              </h1>

              <p className="mt-6 text-base leading-relaxed text-muted-foreground max-w-xl mx-auto lg:mx-0 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
                Explore curated AI tools, in-depth comparisons, and expert tutorials
                designed to help creators, developers, and businesses work smarter.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row lg:justify-start">
                <Link href="/tools" className="btn-primary text-base px-8 py-3.5 shadow-lg hover:shadow-xl">
                  <Sparkles className="h-5 w-5" />
                  Explore AI Tools
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/articles" className="btn-secondary text-base px-8 py-3.5 shadow-sm hover:shadow-md">
                  Read Articles
                </Link>
              </div>

              <div className="mx-auto mt-12 max-w-xl lg:mx-0">
                <div className="group relative">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 opacity-15 blur-xl transition-all duration-500 group-hover:opacity-30 group-focus-within:opacity-40" />
                  <div className="relative flex items-center rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-sm transition-all duration-300 group-focus-within:border-primary/30 group-focus-within:shadow-[0_0_32px_rgba(99,102,241,0.12)]">
                    <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search any AI tool..."
                      aria-label="Search AI tools"
                      className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-28 sm:pr-36 text-sm placeholder:text-muted-foreground focus:outline-none sm:text-base"
                    />
                    <div className="absolute right-1.5">
                      <button className="btn-primary rounded-xl px-5 py-2.5 text-sm shadow-md hover:shadow-lg">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 lg:justify-start">
                <span className="text-xs font-medium text-muted-foreground">Popular:</span>
                {popularSearches.map((term) => (
                  <Link
                    key={term}
                    href={`/tools?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-border/40 bg-white/70 backdrop-blur-sm px-3 py-1.5 text-xs transition-all duration-200 hover:border-primary/20 hover:bg-blue-50/50 hover:text-primary active:scale-95 sm:text-sm"
                  >
                    {term}
                  </Link>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:hidden">
                <div className="flex items-center gap-1.5 whitespace-nowrap text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{(toolCount ?? 0).toLocaleString()}</span>
                  <span>tools</span>
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{(categoryCount ?? 0).toLocaleString()}</span>
                  <span>categories</span>
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{(articleCount ?? 0).toLocaleString()}</span>
                  <span>articles</span>
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

                <div className="absolute -right-8 top-16">
                  <div className="animate-float rounded-xl border border-white/50 bg-white/70 backdrop-blur-2xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-[10px] font-bold text-white shadow-sm">
                        C
                      </div>
                      <span className="text-sm font-medium text-foreground">ChatGPT</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/50">Free</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -left-10 bottom-40">
                  <div className="animate-float-delayed rounded-xl border border-white/50 bg-white/70 backdrop-blur-2xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-[10px] font-bold text-white shadow-sm">
                        C
                      </div>
                      <span className="text-sm font-medium text-foreground">Claude</span>
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200/50">Pro</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-6 bottom-24">
                  <div className="animate-float-slow rounded-xl border border-white/50 bg-white/70 backdrop-blur-2xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-violet-600 text-[10px] font-bold text-white shadow-sm">
                        M
                      </div>
                      <span className="text-sm font-medium text-foreground">Midjourney</span>
                      <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700 border border-violet-200/50">Paid</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -left-6 top-48">
                  <div className="animate-float-slow rounded-xl border border-white/50 bg-white/70 backdrop-blur-2xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-[10px] font-bold text-white shadow-sm">
                        G
                      </div>
                      <span className="text-sm font-medium text-foreground">Gemini</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/50">Free</span>
                    </div>
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
