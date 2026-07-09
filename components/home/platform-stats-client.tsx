"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Box, Star, Users, LayoutGrid } from "lucide-react"

function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const displayValue = isInView ? value : 0

  return (
    <span ref={ref} className="text-4xl font-bold text-foreground sm:text-5xl">
      {displayValue.toLocaleString()}
    </span>
  )
}

type StatDef = { label: string; icon: React.ComponentType<{ className?: string }>; bgColor: string; textColor: string }

const stats: StatDef[] = [
  { label: "AI Tools", icon: Box, bgColor: "bg-blue-50", textColor: "text-blue-600" },
  { label: "Reviews", icon: Star, bgColor: "bg-amber-50", textColor: "text-amber-600" },
  { label: "Active Users", icon: Users, bgColor: "bg-violet-50", textColor: "text-violet-600" },
  { label: "Categories", icon: LayoutGrid, bgColor: "bg-emerald-50", textColor: "text-emerald-600" },
]

export default function PlatformStatsClient({ values }: { values: number[] }) {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="relative overflow-hidden rounded-2xl border border-border/40 bg-white p-6 sm:p-8 shadow-premium"
              >
                <div className={`absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br ${stat.bgColor.replace("bg-", "from-").replace("50", "200")} opacity-20 blur-2xl`} />
                <div className="relative">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} shadow-sm`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                  <div className="mt-4">
                    <AnimatedCounter value={values[i]} />
                    <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
