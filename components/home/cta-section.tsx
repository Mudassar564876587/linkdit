import Link from "next/link"
import { Sparkles, ArrowUpRight, Compass } from "lucide-react"

export default function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border/50 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Background decorative layers */}
      <div className="absolute inset-0 bg-noise opacity-30" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-b from-indigo-400/10 via-blue-500/5 to-transparent blur-3xl animate-pulse-soft" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)", backgroundSize: "32px 32px" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white/80 sm:text-sm">
            <Sparkles className="h-3 w-3" />
            Contribute to the AI Ecosystem
          </div>

          {/* Headline */}
          <h2 className="mt-8 text-[2rem] font-bold leading-[1.1] tracking-tight text-white sm:text-[2.5rem] lg:text-[3rem] lg:leading-[1.05]">
            Know an AI Tool We Should Feature?
          </h2>

          {/* Supporting text */}
          <p className="mt-5 text-base leading-relaxed text-white/60 sm:text-lg lg:text-xl mx-auto max-w-2xl">
            Help us build the most comprehensive AI tools directory. Submit your favorite tool and help the community discover it.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary */}
            <Link
              href="/submit-tool"
              className="group relative inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-lg shadow-indigo-500/20 transition-all duration-250 hover:bg-white/95 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(99,102,241,0.35)] active:translate-y-0 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-indigo-50/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-250" />
              <Sparkles className="h-5 w-5 relative" />
              <span className="relative">Submit Your AI Tool</span>
              <ArrowUpRight className="h-5 w-5 relative transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* Secondary */}
            <Link
              href="/tools"
              className="group relative inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-sm px-7 py-4 text-base font-medium text-white/80 transition-all duration-250 hover:bg-white/[0.08] hover:-translate-y-1 hover:border-white/25 active:translate-y-0"
            >
              <Compass className="h-5 w-5 transition-transform duration-250 group-hover:rotate-12" />
              <span>Explore AI Tools</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
