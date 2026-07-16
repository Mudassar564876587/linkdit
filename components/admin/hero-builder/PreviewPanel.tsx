import type { HeroConfig } from "./types"
import { Sparkles, Search, ArrowUpRight } from "lucide-react"

const fontFamily = "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif"

function DotPattern({ color }: { color: string }) {
  return (
    <div
      className="absolute inset-0 opacity-[0.025]"
      style={{ backgroundImage: `radial-gradient(circle at 1px 1px, ${color} 1px, transparent 0)`, backgroundSize: "32px 32px" }}
    />
  )
}

function Orb({ className, gradient }: { className: string; gradient: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{ background: gradient }}
    />
  )
}

export default function PreviewPanel({ config }: { config: HeroConfig }) {
  return (
    <div className="sticky top-24 space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-2 w-2 rounded-full bg-emerald-500" />
        <h3 className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Live Preview</h3>
      </div>

      {/* Preview frame */}
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-lg">
        {/* Browser chrome mock */}
        <div className="flex items-center gap-1.5 border-b border-border/50 bg-muted/30 px-4 py-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <div className="ml-3 flex-1 rounded-md bg-muted/60 px-3 py-1 text-[10px] text-muted-foreground/60 text-center truncate">
            linkdit.online
          </div>
        </div>

        {/* Preview content — mirrors the actual hero */}
        <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                config.background.style === "gradient"
                  ? `linear-gradient(to bottom, ${config.background.primaryColor}08, white)`
                  : config.background.primaryColor,
            }}
          />

          {config.background.showDots && <DotPattern color={config.background.primaryColor} />}

          {config.background.showOrbs && (
            <>
              <Orb
                gradient={`radial-gradient(circle, ${config.background.primaryColor}15, transparent 70%)`}
                className="-top-24 left-1/2 h-64 w-64 -translate-x-1/2"
              />
              <Orb
                gradient={`radial-gradient(circle, ${config.background.secondaryColor}10, transparent 70%)`}
                className="-left-24 top-1/4 h-48 w-48"
              />
            </>
          )}

          {/* Banner Media */}
          {config.media.bannerType !== "none" && (
            <div className="absolute inset-0 z-[1] overflow-hidden">
              {config.media.bannerType === "image" && config.media.desktopImageUrl && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={config.media.desktopImageUrl} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
                </>
              )}
              {config.media.bannerType === "video" && config.media.videoUrl && (
                <>
                  <video src={config.media.videoUrl} autoPlay muted loop playsInline className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
                </>
              )}
              {config.media.bannerType === "youtube" && config.media.youtubeVideoId && (
                <>
                  <iframe
                    src={`https://www.youtube.com/embed/${config.media.youtubeVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${config.media.youtubeVideoId}`}
                    className="h-full w-full pointer-events-none"
                    allow="autoplay; encrypted-media"
                    title="YouTube preview"
                  />
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
                </>
              )}
              {config.media.bannerType === "vimeo" && config.media.vimeoVideoId && (
                <>
                  <iframe
                    src={`https://player.vimeo.com/video/${config.media.vimeoVideoId}?autoplay=1&muted=1&controls=0&loop=1&background=1`}
                    className="h-full w-full pointer-events-none"
                    allow="autoplay"
                    title="Vimeo preview"
                  />
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
                </>
              )}
              {config.media.bannerType === "lottie" && config.media.lottieUrl && (
                <div className="flex h-full items-center justify-center bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground text-center break-all">Lottie: {config.media.lottieUrl}</p>
                </div>
              )}
            </div>
          )}

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 px-6 pt-8 pb-6">
            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-1 rounded-full border border-primary/10 bg-white/70 backdrop-blur-xl px-3 py-1 text-[10px] font-medium text-primary shadow-sm">
              <Sparkles className="h-2.5 w-2.5" />
              AI Discovery Platform
            </div>

            {/* Heading */}
            <div style={{ fontFamily: fontFamily }}>
              <div
                className="font-black leading-[0.9] tracking-[-0.05em]"
                style={{ color: "#0F172A", fontSize: "clamp(20px, 3.5vw, 32px)" }}
              >
                <span className="block">{config.heading.line1}</span>
                <span
                  className="block bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${config.heading.gradient1}, ${config.heading.gradient2}, ${config.heading.gradient3}, ${config.heading.gradient4})`,
                  }}
                >
                  {config.heading.line2}
                </span>
                <span className="block">{config.heading.line3}</span>
              </div>
            </div>

            {/* Description */}
            {config.description.text && (
              <p
                className="mt-3 text-xs leading-relaxed"
                style={{ color: config.description.color, maxWidth: config.description.maxWidth }}
              >
                {config.description.text}
              </p>
            )}

            {/* Buttons */}
            {config.buttons.enabled && (
              <div className="mt-4 flex gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-[10px] font-semibold text-white shadow-sm">
                  <Sparkles className="h-2.5 w-2.5" />
                  {config.buttons.primaryText}
                  <ArrowUpRight className="h-2.5 w-2.5" />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-white/80 px-4 py-2 text-[10px] font-semibold text-foreground shadow-sm backdrop-blur-sm">
                  {config.buttons.secondaryText}
                  <ArrowUpRight className="h-2.5 w-2.5 text-muted-foreground" />
                </span>
              </div>
            )}

            {/* Search */}
            {config.search.enabled && (
              <div className="mt-4 max-w-[320px]">
                <div className="group relative">
                  <div
                    className="absolute -inset-0.5 rounded-lg opacity-15 blur-md transition-opacity"
                    style={{ background: `linear-gradient(to right, ${config.background.primaryColor}, ${config.background.secondaryColor})` }}
                  />
                  <div className="relative flex items-center rounded-lg border border-white/40 bg-white/70 shadow-sm backdrop-blur-xl">
                    <Search className="ml-3 h-3 w-3 text-muted-foreground/60" />
                    <span className="flex-1 px-2 py-2 text-[10px] text-muted-foreground/40">
                      {config.search.placeholder}
                    </span>
                    <span className="mr-1 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-1.5 text-[9px] font-semibold text-white shadow-sm">
                      {config.search.buttonText}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
        Preview updates automatically. Actual appearance may vary based on screen size and browser.
      </p>
    </div>
  )
}
