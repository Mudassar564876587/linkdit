"use client"

import Link from "next/link"
import { Star, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { getAvatarColor } from "@/lib/utils"

type Tool = {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string | null
  pricing: string
  rating: number
  reviewCount: number
  categoryName: string
}

const pricingStyles: Record<string, string> = {
  Free: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Freemium: "bg-amber-50 text-amber-700 border-amber-200",
  Paid: "bg-violet-50 text-violet-700 border-violet-200",
}

export default function TrendingToolsClient({ tools }: { tools: Tool[] }) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent" />

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {[...tools, ...tools].map((tool, i) => (
          <motion.div
            key={`${tool.id}-${i}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: (i % tools.length) * 0.05 }}
            viewport={{ once: true }}
            className="snap-start shrink-0 w-[280px] sm:w-[300px]"
          >
            <Link
              href={`/tools/${tool.slug}`}
              className="group block h-full"
            >
              <div className="relative h-full rounded-2xl border border-border/60 bg-white p-5 shadow-premium transition-all duration-300 hover:shadow-premium-lg hover:border-primary/20 hover:-translate-y-1">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-start gap-3">
                    {tool.logoUrl ? (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 overflow-hidden shadow-sm">
                        <img src={tool.logoUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                      </div>
                    ) : (
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getAvatarColor(tool.name)} text-lg font-bold text-white shadow-sm`}>
                        {tool.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{tool.name}</h3>
                        <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${pricingStyles[tool.pricing] || pricingStyles.Free}`}>
                          {tool.pricing}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-foreground">{tool.rating.toFixed(1)}</span>
                      <span>({tool.reviewCount})</span>
                    </div>
                    <span className="flex items-center gap-0.5 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-all">
                      View <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
