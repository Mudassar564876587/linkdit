"use client"

import Link from "next/link"
import { Star, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { getAvatarColor, formatNumber } from "@/lib/utils"

type Tool = {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string | null
  websiteUrl: string
  pricing: string
  platforms?: string[]
  rating: number
  reviewCount: number
  categoryName: string
}

const pricingStyles: Record<string, string> = {
  Free: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Preemium: "bg-amber-50 text-amber-700 border-amber-200",
  Paid: "bg-violet-50 text-violet-700 border-violet-200",
}

export default function FeaturedToolsClient({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) return null

  return (
    <>
      {tools.map((tool, i) => (
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.06 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <Link
            href={`/tools/${tool.slug}`}
            className="group relative flex h-full flex-col rounded-2xl border border-border/50 bg-white p-6 shadow-premium transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-1"
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative flex items-start gap-4">
              {tool.logoUrl ? (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm ring-1 ring-border/10">
                  <img src={tool.logoUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
              ) : (
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${getAvatarColor(tool.name)} text-lg font-bold text-white shadow-sm`}>
                  {tool.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{tool.name}</h3>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${pricingStyles[tool.pricing] || pricingStyles.Free}`}>
                    {tool.pricing}
                  </span>
                </div>
                <span className="mt-0.5 inline-block text-xs text-muted-foreground">{tool.categoryName}</span>
              </div>
            </div>

            <p className="relative mt-3 line-clamp-2 text-sm text-muted-foreground leading-relaxed flex-1">
              {tool.description}
            </p>

            <div className="relative mt-4 flex items-center justify-between border-t border-border/50 pt-4">
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-foreground">{tool.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({formatNumber(tool.reviewCount)})</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-all">
                Details <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </>
  )
}
