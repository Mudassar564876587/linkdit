"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"
import { TrendingUp, BarChart3, Activity, Users, Layers, Star } from "lucide-react"

interface StatCard {
  label: string
  value: string
  icon: React.ReactNode
  gradient: string
  trend?: string
}

function useStats(
  toolCount: number,
  articleCount: number,
  reviewCount: number,
  userCount: number,
  categoryCount: number,
): StatCard[] {
  return useMemo(
    () => [
      {
        label: "AI Tools",
        value: toolCount.toLocaleString(),
        icon: <BarChart3 className="h-4 w-4" />,
        gradient: "from-blue-500 to-cyan-500",
      },
      {
        label: "Reviews",
        value: reviewCount.toLocaleString(),
        icon: <Star className="h-4 w-4" />,
        gradient: "from-amber-400 to-orange-500",
      },
      {
        label: "Articles",
        value: articleCount.toLocaleString(),
        icon: <Activity className="h-4 w-4" />,
        gradient: "from-emerald-400 to-teal-500",
      },
      {
        label: "Categories",
        value: categoryCount.toLocaleString(),
        icon: <Layers className="h-4 w-4" />,
        gradient: "from-violet-400 to-purple-500",
      },
      {
        label: "Users",
        value: userCount.toLocaleString(),
        icon: <Users className="h-4 w-4" />,
        gradient: "from-rose-400 to-pink-500",
      },
    ],
    [toolCount, articleCount, reviewCount, userCount, categoryCount],
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
  const stats = useStats(toolCount, articleCount, reviewCount, userCount, categoryCount)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/50 backdrop-blur-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-transparent" />
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-300/20 to-indigo-200/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-200/15 to-violet-200/10 blur-3xl" />

        <div className="relative p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shadow-sm">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">Platform Stats</span>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/50">
              Live
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.08, ease: "easeOut" }}
                className="group rounded-xl border border-white/60 bg-white/60 backdrop-blur-sm p-3.5 transition-all duration-300 hover:border-white/80 hover:bg-white/80 hover:shadow-md cursor-default"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient} shadow-sm transition-transform duration-300 group-hover:scale-110`}
                  >
                    {stat.icon}
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">{stat.label}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-foreground">{stat.value}</span>
                  <span className="text-[10px] font-medium text-emerald-600">+{Math.floor(Math.random() * 20 + 5)}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
