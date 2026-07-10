"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Star, BarChart3, TrendingUp } from "lucide-react"

function AnimatedCount({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const displayValue = isInView ? value : 0

  return (
    <span ref={ref} className="text-3xl font-bold text-foreground">
      {displayValue.toLocaleString()}
    </span>
  )
}

export default function HeroDashboard({
  toolCount,
  articleCount,
  reviewCount,
  userCount,
  categoryCount,
}: {
  toolCount: number
  articleCount: number
  reviewCount: number
  userCount: number
  categoryCount: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-premium-lg"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/5" />

      <div className="relative border-b border-border/40 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <span className="ml-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Platform Overview
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
            Live
          </span>
        </div>
      </div>

      <div className="relative p-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/30 p-4 ring-1 ring-blue-200/30">
            <div className="flex items-center gap-2 text-blue-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wide">Tools</span>
            </div>
            <div className="mt-2">
              <AnimatedCount value={toolCount} />
            </div>
            <p className="text-xs text-blue-600/70">curated AI tools</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/30 p-4 ring-1 ring-emerald-200/30">
            <div className="flex items-center gap-2 text-emerald-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wide">Articles</span>
            </div>
            <div className="mt-2">
              <AnimatedCount value={articleCount} />
            </div>
            <p className="text-xs text-emerald-600/70">expert guides</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/30 p-4 ring-1 ring-amber-200/30">
            <div className="flex items-center gap-2 text-amber-600">
              <Star className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Reviews</span>
            </div>
            <div className="mt-2">
              <AnimatedCount value={reviewCount} />
            </div>
            <p className="text-xs text-amber-600/70">verified reviews</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100/30 p-4 ring-1 ring-violet-200/30">
            <div className="flex items-center gap-2 text-violet-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wide">Users</span>
            </div>
            <div className="mt-2">
              <AnimatedCount value={userCount} />
            </div>
            <p className="text-xs text-violet-600/70">active users</p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span>Growing weekly</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>{categoryCount} categories</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
