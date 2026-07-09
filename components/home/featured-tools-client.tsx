"use client"

import Link from "next/link"
import { Star, ArrowUpRight, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import TiltCard from "@/components/ui/tilt-card"
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
  Freemium: "bg-amber-50 text-amber-700 border-amber-200",
  Paid: "bg-violet-50 text-violet-700 border-violet-200",
}

function RatingBar({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const pct = (rating / 5) * 100
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
      </div>
      <div className="hidden sm:flex h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">({formatNumber(reviewCount)})</span>
    </div>
  )
}

export default function FeaturedToolsClient({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) return null

  const [first, ...rest] = tools

  return (
    <>
      {/* Hero featured card - full width */}
      <motion.div
        initial={{ opacity: 0, rotateX: -15, y: 40 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-50px" }}
        className="sm:col-span-2"
        style={{ transformStyle: "preserve-3d" }}
      >
        <TiltCard maxTilt={5}>
          <Link
            href={`/tools/${first.slug}`}
            className="group card-depth overflow-hidden block"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="flex items-center justify-center p-10 sm:p-12 sm:w-80 min-h-[200px] bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
                {first.logoUrl ? (
                  <img src={first.logoUrl} alt="" className="h-24 w-24 rounded-2xl object-cover shadow-lg ring-4 ring-white" loading="lazy" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-lg text-4xl font-bold text-primary">
                    {first.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{first.name}</h3>
                      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    </div>
                    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {first.categoryName}
                    </span>
                  </div>
                  <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${pricingStyles[first.pricing] || pricingStyles.Free}`}>
                    {first.pricing}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                  {first.description}
                </p>
                <div className="mt-auto pt-5 flex items-center justify-between border-t border-border">
                  <RatingBar rating={first.rating} reviewCount={first.reviewCount} />
                  <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all">
                    View details <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </TiltCard>
      </motion.div>

      {/* Remaining cards */}
      {rest.map((tool, i) => (
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, rotateX: -15, y: 40 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 * (i + 1) }}
          viewport={{ once: true, margin: "-50px" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <TiltCard maxTilt={6}>
            <Link
              href={`/tools/${tool.slug}`}
              className="group card-depth p-5 block h-full"
            >
              <div className="flex items-start gap-4">
                {tool.logoUrl ? (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 shadow-sm overflow-hidden">
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
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded-md bg-muted px-2 py-0.5 font-medium">{tool.categoryName}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-foreground">{tool.rating.toFixed(1)}</span>
                      <span>({formatNumber(tool.reviewCount)})</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </TiltCard>
        </motion.div>
      ))}
    </>
  )
}