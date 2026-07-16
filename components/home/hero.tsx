import Link from "next/link"
import { Sparkles, ArrowUpRight, Search } from "lucide-react"
import { Plus_Jakarta_Sans } from "next/font/google"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import HeroClient from "./hero-client"
import { getHeroConfig } from "@/lib/hero-config"
import type { HeroConfig, MediaConfig } from "@/components/admin/hero-builder/types"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
})

const popularSearches = ["ChatGPT", "Claude", "Gemini", "Midjourney", "Cursor"]

const defaultMedia: MediaConfig = {
  bannerType: "none",
  desktopImageUrl: "", desktopImageFileName: "", desktopImageFileSize: 0,
  mobileImageUrl: "", mobileImageFileName: "", mobileImageFileSize: 0,
  videoUrl: "", videoFileName: "", videoFileSize: 0, videoPosterUrl: "",
  youtubeUrl: "", youtubeVideoId: "",
  vimeoUrl: "", vimeoVideoId: "",
  lottieUrl: "",
  desktopUrl: "", tabletUrl: "", mobileUrl: "",
  autoplay: true, loop: false, muted: false, controls: true, playOnHover: false, lazyLoad: true,
  overlayEnabled: false, overlayOpacity: 50, overlayColor: "#000000", overlayGradient: "",
  desktopHeight: "600px", laptopHeight: "500px", tabletHeight: "400px", mobileHeight: "300px",
  bannerPosition: "center", objectFit: "cover", borderRadius: 0,
  shadowEnabled: false, shadowBlur: 20, shadowSpread: 0, shadowOpacity: 20,
  glowEnabled: false, glowColor: "#2563EB", glowIntensity: 30,
  animation: "none",
}

const hc: HeroConfig = {
  announcement: { enabled: false, text: "", url: "", bgColor: "", textColor: "" },
  heading: { line1: "Find the Best", line2: "AI Tools", line3: "for Every Task", gradient1: "#2563EB", gradient2: "#4F46E5", gradient3: "#7C3AED", gradient4: "#A855F7", fontWeight: "900", fontSize: "76px", letterSpacing: "-0.05em", lineHeight: "0.9" },
  description: { text: "Explore curated AI tools, in-depth comparisons, and expert tutorials designed to help creators, developers, and businesses work smarter.", maxWidth: "560px", fontSize: "18px", lineHeight: "1.75", color: "#64748b" },
  buttons: { enabled: true, primaryText: "Explore AI Tools", primaryUrl: "/tools", primaryIcon: "Sparkles", secondaryText: "Read Articles", secondaryUrl: "/articles", secondaryIcon: "ArrowUpRight" },
  search: { enabled: true, placeholder: "Search any AI tool...", buttonText: "Search" },
  background: { style: "gradient", primaryColor: "#2563EB", secondaryColor: "#7C3AED", showOrbs: true, showDots: true },
  clock: { enabled: true },
  media: defaultMedia,
  seo: { title: "", description: "" },
}

export default async function Hero() {
  const supabase = await createServerSupabaseClient()

  const [{ count: toolCount }, { count: categoryCount }, { count: articleCount }, dbConfig] =
    await Promise.all([
      supabase.from("tools").select("*", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("is_published", true),
      getHeroConfig().catch(() => null),
    ])

  const config: HeroConfig = dbConfig ?? hc

  return (
    <HeroClient>
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white">
        {/* Premium gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-48 left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-200/30 via-indigo-200/15 to-transparent blur-3xl animate-breathe" />
          <div className="absolute -left-72 top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-violet-300/20 to-indigo-200/8 blur-3xl animate-float-slow" />
          <div className="absolute -right-72 top-1/3 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-cyan-200/15 to-sky-100/8 blur-3xl animate-float-delayed" />
          <div className="absolute left-1/3 bottom-0 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-200/15 to-blue-100/8 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #2563eb 1px, transparent 0)`, backgroundSize: "32px 32px" }} />
        </div>

        {/* Parallax floating blobs */}
        <div data-parallax className="pointer-events-none absolute left-[8%] top-[18%] h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/15 blur-[120px] animate-float" aria-hidden="true" />
        <div data-parallax className="pointer-events-none absolute right-[10%] top-[12%] h-48 w-48 rounded-full bg-gradient-to-br from-violet-400/20 to-indigo-400/15 blur-[120px] animate-float-delayed" aria-hidden="true" />
        <div data-parallax className="pointer-events-none absolute left-[40%] bottom-[20%] h-32 w-32 rounded-full bg-gradient-to-br from-cyan-400/15 to-teal-400/10 blur-[100px] animate-float-slow" aria-hidden="true" />

        {/* Premium white glow gradient from bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 sm:pb-28 sm:pt-32 lg:px-8 lg:pb-36 lg:pt-40">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative z-10 text-center lg:text-left">
              {/* Premium badge */}
              <div className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-white/70 backdrop-blur-xl px-4 py-1.5 text-xs font-medium text-primary shadow-sm">
                <Sparkles className="h-3 w-3" />
                AI Discovery Platform
              </div>

              <h1 className={`${plusJakarta.className}`}>
                <span className="block text-[36px] xs:text-[44px] sm:text-[60px] lg:text-[76px] font-black leading-[0.9] tracking-[-0.05em] text-[#0F172A]">
                  {config.heading.line1}
                </span>
                <span className="block text-[44px] xs:text-[56px] sm:text-[72px] lg:text-[94px] font-black leading-[0.9] tracking-[-0.05em] bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(to right, ${config.heading.gradient1}, ${config.heading.gradient2}, ${config.heading.gradient3}, ${config.heading.gradient4})` }}
                >
                  {config.heading.line2}
                </span>
                <span className="block text-[36px] xs:text-[44px] sm:text-[60px] lg:text-[76px] font-black leading-[0.9] tracking-[-0.05em] text-[#0F172A]">
                  {config.heading.line3}
                </span>
              </h1>

              {config.description.text && (
                <p className="mt-6 text-base leading-relaxed text-muted-foreground max-w-xl mx-auto lg:mx-0 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
                  {config.description.text}
                </p>
              )}

              {/* CTA Buttons */}
              {config.buttons.enabled && (
                <div className="mt-10 flex flex-col gap-4 sm:flex-row lg:justify-start">
                  <Link
                    href={config.buttons.primaryUrl}
                    className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 -translate-x-full group-hover:translate-x-full" />
                    <Sparkles className="h-5 w-5 relative" />
                    <span className="relative">{config.buttons.primaryText}</span>
                    <ArrowUpRight className="h-4 w-4 relative transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                  <Link
                    href={config.buttons.secondaryUrl}
                    className="group inline-flex items-center gap-2 rounded-full border border-border/50 bg-white/80 px-8 py-3.5 text-base font-semibold text-foreground shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 active:translate-y-0"
                  >
                    {config.buttons.secondaryText}
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              )}

              {/* Premium Search */}
              {config.search.enabled && (
                <div className="mx-auto mt-12 max-w-xl lg:mx-0">
                  <div className="group relative">
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 opacity-15 blur-xl transition-all duration-500 group-hover:opacity-25 group-focus-within:opacity-35" />
                    <div className="relative flex items-center rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-sm transition-all duration-300 group-focus-within:border-primary/30 group-focus-within:shadow-[0_0_40px_rgba(99,102,241,0.12)]">
                      <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder={config.search.placeholder}
                        aria-label="Search AI tools"
                        className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-28 sm:pr-36 text-sm placeholder:text-muted-foreground focus:outline-none sm:text-base"
                      />
                      <div className="absolute right-1.5">
                        <Link
                          href="/tools"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg"
                        >
                          <Search className="h-4 w-4" />
                          {config.search.buttonText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 lg:justify-start">
                <span className="text-xs font-medium text-muted-foreground">Trending:</span>
                {popularSearches.map((term) => (
                  <Link
                    key={term}
                    href={`/tools?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-border/40 bg-white/70 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-primary/20 hover:bg-blue-50/50 hover:text-primary active:scale-95 sm:text-sm"
                  >
                    {term}
                  </Link>
                ))}
              </div>

              {/* Mobile banner media */}
              {config.media.bannerType !== "none" && (
                <div className="mt-10 lg:hidden">
                  <div className="overflow-hidden rounded-xl border border-border">
                    {config.media.bannerType === "image" && (
                      config.media.mobileImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={config.media.mobileImageUrl} alt="Hero banner" className="w-full object-cover" style={{ maxHeight: 280 }} />
                      ) : config.media.desktopImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={config.media.desktopImageUrl} alt="Hero banner" className="w-full object-cover" style={{ maxHeight: 280 }} />
                      ) : null
                    )}
                    {config.media.bannerType === "video" && config.media.videoUrl && (
                      <video src={config.media.videoUrl} autoPlay muted loop playsInline className="w-full" style={{ maxHeight: 280 }} />
                    )}
                    {config.media.bannerType === "youtube" && config.media.youtubeVideoId && (
                      <iframe
                        src={`https://www.youtube.com/embed/${config.media.youtubeVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${config.media.youtubeVideoId}`}
                        className="w-full aspect-video"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        title="YouTube hero video"
                      />
                    )}
                    {config.media.bannerType === "vimeo" && config.media.vimeoVideoId && (
                      <iframe
                        src={`https://player.vimeo.com/video/${config.media.vimeoVideoId}?autoplay=1&muted=1&controls=0&loop=1&background=1`}
                        className="w-full aspect-video"
                        allow="autoplay; fullscreen; picture-in-picture"
                        title="Vimeo hero video"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Live stats mobile */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:hidden">
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

            {/* Premium hero visual — media or CSS-only glowing AI orb */}
            <div className="relative hidden lg:block">
              {config.media.bannerType !== "none" ? (
                <div className="relative mx-auto flex h-[520px] w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl">
                  {config.media.bannerType === "image" && (
                    <>
                      {config.media.desktopImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={config.media.desktopImageUrl}
                          alt="Hero banner"
                          className="h-full w-full object-cover rounded-2xl"
                        />
                      ) : config.media.mobileImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={config.media.mobileImageUrl}
                          alt="Hero banner"
                          className="h-full w-full object-cover rounded-2xl"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-muted">
                          <p className="text-sm text-muted-foreground">No image selected</p>
                        </div>
                      )}
                    </>
                  )}
                  {config.media.bannerType === "video" && config.media.videoUrl && (
                    <video
                      src={config.media.videoUrl}
                      autoPlay={config.media.autoplay}
                      muted={config.media.muted}
                      loop={config.media.loop}
                      controls={config.media.controls}
                      playsInline
                      poster={config.media.videoPosterUrl || undefined}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  )}
                  {config.media.bannerType === "youtube" && config.media.youtubeVideoId && (
                    <iframe
                      src={`https://www.youtube.com/embed/${config.media.youtubeVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${config.media.youtubeVideoId}`}
                      className="h-full w-full rounded-2xl"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      title="YouTube hero video"
                    />
                  )}
                  {config.media.bannerType === "vimeo" && config.media.vimeoVideoId && (
                    <iframe
                      src={`https://player.vimeo.com/video/${config.media.vimeoVideoId}?autoplay=1&muted=1&controls=0&loop=1&background=1`}
                      className="h-full w-full rounded-2xl"
                      allow="autoplay; fullscreen; picture-in-picture"
                      title="Vimeo hero video"
                    />
                  )}
                  {config.media.bannerType === "lottie" && config.media.lottieUrl && (
                    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-muted/30 p-8">
                      <p className="text-xs text-muted-foreground text-center break-all">Lottie: {config.media.lottieUrl}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative mx-auto flex h-[520px] w-full max-w-lg items-center justify-center" aria-hidden="true">
                  {/* Central glowing orb */}
                  <div className="relative flex h-48 w-48 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-violet-600/30 blur-3xl animate-breathe" />
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-400/20 via-indigo-400/15 to-violet-500/20 blur-2xl animate-float" />
                    <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_60px_rgba(37,99,235,0.3),0_0_120px_rgba(99,102,241,0.15)]">
                      <Sparkles className="h-12 w-12 text-white/90" />
                    </div>
                    <div className="absolute inset-0 rounded-full border border-blue-200/20 animate-orbit" />
                    <div className="absolute inset-[-20px] rounded-full border border-indigo-200/10 animate-orbit-reverse" />
                  </div>

                  {/* Orbiting tool cards */}
                  <div className="absolute right-4 top-8 animate-float">
                    <div className="rounded-xl border border-white/60 bg-white/70 backdrop-blur-2xl px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-bold text-white shadow-sm">C</div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">ChatGPT</p>
                          <p className="text-[10px] text-muted-foreground">AI Assistant</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/50">Free</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-0 bottom-36 animate-float-delayed">
                    <div className="rounded-xl border border-white/60 bg-white/70 backdrop-blur-2xl px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-xs font-bold text-white shadow-sm">C</div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Claude</p>
                          <p className="text-[10px] text-muted-foreground">AI Assistant</p>
                        </div>
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200/50">Pro</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute right-8 bottom-20 animate-float-slow">
                    <div className="rounded-xl border border-white/60 bg-white/70 backdrop-blur-2xl px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-violet-600 text-xs font-bold text-white shadow-sm">M</div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Midjourney</p>
                          <p className="text-[10px] text-muted-foreground">Image Gen</p>
                        </div>
                        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700 border border-violet-200/50">Paid</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-4 top-36 animate-float-slow">
                    <div className="rounded-xl border border-white/60 bg-white/70 backdrop-blur-2xl px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white shadow-sm">G</div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Gemini</p>
                          <p className="text-[10px] text-muted-foreground">AI Assistant</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/50">Free</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Live stats — desktop */}
              <div className="mt-6 flex items-center justify-center gap-8">
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
