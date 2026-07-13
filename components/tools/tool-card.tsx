"use client"

import Link from "next/link"
import { ExternalLink, ShieldCheck, Sparkles, Star, BookmarkPlus, GitCompare, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import type { ToolPlatform } from "@/types/tool"

const pricingStyles: Record<string, { label: string; classes: string }> = {
  Free: { label: "Free", classes: "bg-emerald-50/80 text-emerald-700 border-emerald-200/50" },
  Preemium: { label: "Freemium", classes: "bg-amber-50/80 text-amber-700 border-amber-200/50" },
  Paid: { label: "Paid", classes: "bg-violet-50/80 text-violet-700 border-violet-200/50" },
}

type ToolCardProps = {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string | null
  websiteUrl: string
  pricing: string
  platforms?: ToolPlatform[]
  rating: number
  reviewCount: number
  featured: boolean
  sponsored?: boolean
  isVerified?: boolean
  categoryName: string
  isBookmarked?: boolean
}

export default function ToolCard({
  name,
  slug,
  description,
  logoUrl,
  websiteUrl,
  pricing,
  rating,
  reviewCount,
  featured,
  sponsored,
  isVerified,
  categoryName,
}: ToolCardProps) {
  const ps = pricingStyles[pricing] ?? pricingStyles.Free

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: "-30px" }}
    >
      <div className="group relative flex h-full flex-col rounded-2xl border border-border/40 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-violet-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.10), rgba(139,92,246,0.06), transparent 60%)" }} />

        <div className="relative flex items-start gap-4 p-5 pb-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted/50 shadow-sm ring-1 ring-border/10 overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:ring-primary/10">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <span className="text-lg font-bold text-foreground/40">{name.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link href={`/tools/${slug}`} className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {name}
              </Link>
              {isVerified && (
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" aria-label="Verified tool" />
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">{categoryName}</span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${ps.classes}`}>
                {ps.label}
              </span>
            </div>
          </div>
        </div>

        <p className="relative px-5 line-clamp-2 text-sm text-muted-foreground leading-relaxed flex-1">
          {description}
        </p>

        <div className="relative mx-5 mt-3 flex items-center gap-2 border-t border-border/30 pt-3 pb-4">
          <div className="flex items-center gap-1 rounded-md bg-amber-50/50 px-1.5 py-0.5 transition-all duration-200 group-hover:bg-amber-50/80">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>

        <div className="relative mx-5 mb-5 mt-auto flex items-center gap-2">
          <Link
            href={`/tools/${slug}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary/5 px-3 py-2 text-xs font-medium text-primary transition-all duration-200 hover:bg-primary/10 hover:gap-2"
          >
            View Details
            <ArrowUpRight className="h-3 w-3" />
          </Link>
          <a
            href={websiteUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border/40 px-3 py-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-primary/20 hover:text-primary"
            aria-label={`Visit ${name} website`}
          >
            <ExternalLink className="h-3 w-3" />
            Visit
          </a>
        </div>

        {(featured || sponsored) && (
          <div className="absolute top-3 right-3 flex items-center gap-1">
            {sponsored && (
              <span className="flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm" aria-label="Sponsored tool">
                <Sparkles className="h-3 w-3" />
                Sponsored
              </span>
            )}
            {featured && !sponsored && (
              <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground shadow-sm" aria-label="Featured tool">
                Featured
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
