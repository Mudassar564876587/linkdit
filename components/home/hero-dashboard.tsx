"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Star, BarChart3, TrendingUp, Box, BookOpen, Users, MessageSquare } from "lucide-react"

const icons = {
  tools: Box,
  articles: BookOpen,
  reviews: Star,
  users: Users,
}

function AnimatedCount({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const displayValue = isInView ? value : 0

  return (
    <span ref={ref} className="text-3xl font-bold tracking-tight text-foreground">
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
      transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/40 backdrop-blur-xl shadow-premium-lg"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/5" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-violet-500/[0.03]" />

      <div className="relative border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400 ring-1 ring-red-400/30" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400 ring-1 ring-yellow-400/30" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400 ring-1 ring-green-400/30" />
            </div>
            <span className="ml-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Platform Overview
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live
          </span>
        </div>
      </div>

      <div className="relative p-5">
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Box} label="Tools" count={toolCount} sub="curated AI tools" color="blue" />
          <StatCard icon={BookOpen} label="Articles" count={articleCount} sub="expert guides" color="emerald" />
          <StatCard icon={Star} label="Reviews" count={reviewCount} sub="verified reviews" color="amber" />
          <StatCard icon={Users} label="Users" count={userCount} sub="active users" color="violet" />
        </div>
      </div>

      <div className="relative border-t border-white/20 px-6 py-3">
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

function StatCard({
  icon: Icon,
  label,
  count,
  sub,
  color,
}: {
  icon: typeof Box
  label: string
  count: number
  sub: string
  color: "blue" | "emerald" | "amber" | "violet"
}) {
  const colorMap = {
    blue: { bg: "from-blue-50 to-blue-100/40", ring: "ring-blue-200/40", text: "text-blue-600", sub: "text-blue-600/70" },
    emerald: { bg: "from-emerald-50 to-emerald-100/40", ring: "ring-emerald-200/40", text: "text-emerald-600", sub: "text-emerald-600/70" },
    amber: { bg: "from-amber-50 to-amber-100/40", ring: "ring-amber-200/40", text: "text-amber-600", sub: "text-amber-600/70" },
    violet: { bg: "from-violet-50 to-violet-100/40", ring: "ring-violet-200/40", text: "text-violet-600", sub: "text-violet-600/70" },
  }
  const c = colorMap[color]

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${c.bg} p-4 ring-1 ${c.ring} backdrop-blur-sm`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${c.text}`} />
        <span className={`text-xs font-semibold uppercase tracking-wide ${c.text}`}>{label}</span>
      </div>
      <div className="mt-2">
        <AnimatedCount value={count} />
      </div>
      <p className={`text-xs ${c.sub}`}>{sub}</p>
    </div>
  )
}
