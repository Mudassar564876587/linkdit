"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useMemo } from "react"

const fallbackLogos = [
  { name: "ChatGPT", gradient: "from-emerald-400 to-emerald-600", letter: "C" },
  { name: "Claude", gradient: "from-orange-400 to-orange-600", letter: "C" },
  { name: "Gemini", gradient: "from-blue-400 to-blue-600", letter: "G" },
  { name: "Midjourney", gradient: "from-violet-400 to-violet-600", letter: "M" },
  { name: "Cursor", gradient: "from-cyan-400 to-cyan-600", letter: "C" },
  { name: "Perplexity", gradient: "from-indigo-400 to-indigo-600", letter: "P" },
  { name: "Copilot", gradient: "from-green-400 to-green-600", letter: "C" },
  { name: "DALL·E", gradient: "from-pink-400 to-pink-600", letter: "D" },
]

export default function TrustedBy() {
  const logos = useMemo(() => [...fallbackLogos, ...fallbackLogos], [])

  return (
    <section className="border-t border-border bg-gradient-to-b from-secondary/30 to-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center text-xs font-semibold tracking-widest text-muted-foreground uppercase"
        >
          Trusted by creators using the world&apos;s best AI tools
        </motion.p>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-48 bg-gradient-to-r from-white via-white/80 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-48 bg-gradient-to-l from-white via-white/80 to-transparent" />

          <div className="flex animate-scroll-left gap-16 items-center">
            {logos.map((logo, i) => (
              <Link
                key={`${logo.name}-${i}`}
                href={`/tools?q=${encodeURIComponent(logo.name)}`}
                className="flex shrink-0 items-center gap-3 rounded-xl border border-border/40 bg-white/60 backdrop-blur-sm px-5 py-3 shadow-sm transition-all duration-250 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${logo.gradient} text-sm font-bold text-white shadow-sm`}>
                  {logo.letter}
                </div>
                <span className="text-sm font-semibold text-foreground whitespace-nowrap">{logo.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
