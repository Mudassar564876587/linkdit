"use client"

import Link from "next/link"
import { Star, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
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
  rating: number
  reviewCount: number
  categoryName: string
}

export default function FeaturedToolsClient({ tools }: { tools: Tool[] }) {
  return (
    <>
      {tools.map((tool, index) => (
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, rotateX: -15, y: 40 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
          viewport={{ once: true, margin: "-50px" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <TiltCard maxTilt={6}>
            <article className="group rounded-2xl border border-border bg-background p-5 shadow-soft-sm transition-all duration-200 hover:border-primary/20 hover:shadow-premium sm:p-6">
              <div className="flex items-start justify-between">
                {tool.logoUrl ? (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 shadow-sm sm:h-12 sm:w-12">
                    <img src={tool.logoUrl} alt="" className="h-full w-full rounded-xl object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getAvatarColor(tool.name)} text-base font-bold text-white shadow-sm sm:h-12 sm:w-12 sm:text-lg`}>
                    {tool.name[0]}
                  </div>
                )}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    tool.pricing === "Free"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {tool.pricing}
                </span>
              </div>

              <div className="mt-3.5 sm:mt-4">
                <div className="mb-1.5">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {tool.categoryName}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground sm:text-lg">
                  {tool.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 sm:mt-5">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-foreground">
                    {tool.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({formatNumber(tool.reviewCount)})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs opacity-0 transition-all group-hover:opacity-100"
                  asChild
                >
                  <Link href={tool.websiteUrl} target="_blank">
                    Visit Tool
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </article>
          </TiltCard>
        </motion.div>
      ))}
    </>
  )
}