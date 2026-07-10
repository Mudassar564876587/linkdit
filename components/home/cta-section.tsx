import Link from "next/link"
import { Sparkles, ArrowUpRight } from "lucide-react"

export default function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8 lg:py-36">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm sm:text-sm">
          <Sparkles className="h-3 w-3" />
          Contribute to the AI Ecosystem
        </div>

        <h2 className="mt-8 text-[2rem] font-bold leading-tight tracking-tight text-white sm:text-[2.5rem] lg:text-[3rem]">
          Know an AI Tool We Should Feature?
        </h2>
        <p className="mt-5 text-base leading-relaxed text-blue-100/80 sm:text-lg lg:text-xl max-w-xl mx-auto">
          Help us grow the most comprehensive AI tools directory. Submit your favorite tool and help the community discover it.
        </p>

        <div className="mt-10">
          <Link
            href="/submit-tool"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-premium-lg transition-all duration-200 hover:bg-blue-50 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="h-5 w-5" />
            Submit Your AI Tool
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
