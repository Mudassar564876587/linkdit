import Link from "next/link"
import { Sparkles, ArrowUpRight } from "lucide-react"

export default function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl" />
      <div className="absolute -right-32 top-1/4 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm sm:text-sm">
            <Sparkles className="h-3 w-3" />
            Grow the AI Ecosystem
          </div>

          <h2 className="mt-6 text-[1.75rem] font-bold leading-tight tracking-tight text-white sm:text-[2rem] lg:text-[2.25rem]">
            Know an AI Tool We Should Feature?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-blue-100/80 sm:text-base lg:text-lg">
            Help us grow the most comprehensive AI tools directory. Submit your favorite
            tool and help our community discover what&apos;s possible with AI.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/submit-tool"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-premium-lg transition-all duration-200 hover:bg-blue-50 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="h-4 w-4" />
              Submit an AI Tool
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/submit-article"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              Write an Article
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
