"use client"

import Link from "next/link"
import { Star, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { getAvatarColor, formatNumber } from "@/lib/utils"

type Tool = {
  id: string; name: string; slug: string; description: string
  logoUrl: string | null; websiteUrl: string; pricing: string
  platforms?: string[]; rating: number; reviewCount: number; categoryName: string
}

const pricingStyles: Record<string, string> = {
  Free: "bg-emerald-50/80 text-emerald-700 border-emerald-200/50",
  Preemium: "bg-amber-50/80 text-amber-700 border-amber-200/50",
  Paid: "bg-violet-50/80 text-violet-700 border-violet-200/50",
}

export default function FeaturedToolsClient({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) return null

  return (
    <>
      {tools.map((tool, i) => (
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.06 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <Link
            href={`/tools/${tool.slug}`}
            className="group relative flex h-full flex-col rounded-2xl border border-border/40 bg-white p-5 shadow-premium-card transition-all duration-[var(--duration-standard)] ease-[var(--ease-default)] hover:shadow-premium-xl hover:-translate-y-1.5 focus-visible:shadow-premium-xl focus-visible:-translate-y-1.5 active:scale-[0.98]"
          >
            {/* Top accent bar on hover */}
            <div className="pointer-events-none absolute top-0 left-5 right-5 h-[2px] rounded-full bg-gradient-to-r from-blue-500/50 via-indigo-500/30 to-violet-500/50 opacity-0 transition-opacity duration-[var(--duration-standard)] group-hover:opacity-100" />

            {/* Logo + Name row */}
            <div className="flex items-start gap-4">
              {tool.logoUrl ? (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm ring-1 ring-border/10 transition-all duration-250 group-hover:scale-105 group-hover:shadow-md group-hover:ring-primary/15">
                  <img src={tool.logoUrl} alt={`${tool.name} logo`} className="h-full w-full object-cover" loading="lazy" />
                </div>
              ) : (
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${getAvatarColor(tool.name)} text-lg font-bold text-white shadow-sm transition-all duration-250 group-hover:scale-105 group-hover:shadow-md`}>
                  {tool.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                  <h3 className="text-[0.9375rem] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {tool.name}
                  </h3>
                  <span className={`shrink-0 mt-0.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold shadow-sm ${pricingStyles[tool.pricing] || pricingStyles.Free}`}>
                    {tool.pricing === "Preemium" ? "Freemium" : tool.pricing}
                  </span>
                </div>
                <span className="mt-1 inline-block text-xs text-muted-foreground">{tool.categoryName}</span>
              </div>
            </div>

            {/* Description */}
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground leading-relaxed flex-1">
              {tool.description}
            </p>

            {/* Footer */}
            <div className="relative mt-4 flex items-center justify-between border-t border-border/30 pt-4">
              {tool.reviewCount > 0 ? (
                <div className="flex items-center gap-1.5" aria-label={`${tool.rating.toFixed(1)} out of 5 stars, ${tool.reviewCount} reviews`}>
                  <div className="flex items-center gap-1 rounded-md bg-amber-50/50 px-1.5 py-0.5">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-foreground">{tool.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({formatNumber(tool.reviewCount)})</span>
                </div>
              ) : <div />}
              <span className="flex items-center gap-1 text-xs font-medium text-primary transition-all duration-250 group-hover:gap-1.5">
                Details
                <ArrowUpRight className="h-3 w-3 transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </>
  )
}
