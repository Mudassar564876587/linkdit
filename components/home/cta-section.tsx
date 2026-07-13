import Link from "next/link"
import { Sparkles, ArrowUpRight } from "lucide-react"

export default function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border/50 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700">
      <div className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-blue-600/0 via-indigo-500/20 to-violet-600/0 animate-gradient opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/15 via-transparent to-transparent" />
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-400/20 via-indigo-400/10 to-transparent blur-3xl animate-pulse-soft" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`, backgroundSize: "36px 36px" }} aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8 lg:py-36">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white/90 sm:text-sm">
          <Sparkles className="h-3 w-3" />
          Contribute to the AI Ecosystem
        </div>

        <h2 className="mt-8 text-[2rem] font-bold leading-[1.1] tracking-tight text-white sm:text-[2.5rem] lg:text-[3rem] lg:leading-[1.05]">
          Know an AI Tool We Should Feature?
        </h2>
        <p className="mt-5 text-base leading-relaxed text-blue-100/80 sm:text-lg lg:text-xl max-w-xl mx-auto">
          Help us grow the most comprehensive AI tools directory. Submit your favorite tool and help the community discover it.
        </p>

        <div className="mt-10">
          <Link
            href="/submit-tool"
            className="group relative inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,255,255,0.35)] active:translate-y-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-blue-100/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Sparkles className="h-5 w-5 relative" />
            <span className="relative">Submit Your AI Tool</span>
            <ArrowUpRight className="h-5 w-5 relative transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
