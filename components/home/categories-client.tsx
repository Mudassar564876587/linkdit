"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { PenLine, Image, Video, Code2, Zap, BarChart3, Music, TrendingUp, BookOpen, Palette } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PenLine, Image, Video, Code2, Zap, BarChart3, Music, TrendingUp, BookOpen, Palette,
}

const categoryStyles: Record<string, { iconBg: string; gradient: string }> = {
  "ai-writing": { iconBg: "bg-blue-100 text-blue-600", gradient: "from-blue-500 to-blue-600" },
  "image-generation": { iconBg: "bg-violet-100 text-violet-600", gradient: "from-violet-500 to-violet-600" },
  video: { iconBg: "bg-rose-100 text-rose-600", gradient: "from-rose-500 to-rose-600" },
  coding: { iconBg: "bg-emerald-100 text-emerald-600", gradient: "from-emerald-500 to-emerald-600" },
  productivity: { iconBg: "bg-amber-100 text-amber-600", gradient: "from-amber-500 to-amber-600" },
  marketing: { iconBg: "bg-cyan-100 text-cyan-600", gradient: "from-cyan-500 to-cyan-600" },
  audio: { iconBg: "bg-purple-100 text-purple-600", gradient: "from-purple-500 to-purple-600" },
  analytics: { iconBg: "bg-orange-100 text-orange-600", gradient: "from-orange-500 to-orange-600" },
  education: { iconBg: "bg-teal-100 text-teal-600", gradient: "from-teal-500 to-teal-600" },
  design: { iconBg: "bg-pink-100 text-pink-600", gradient: "from-pink-500 to-pink-600" },
}

type CategoryItem = { id: string; name: string; slug: string; toolCount: number; iconName: string }

export default function CategoriesClient({ categories }: { categories: CategoryItem[] }) {
  const sorted = [...categories].sort((a, b) => {
    if (a.toolCount > 0 && b.toolCount === 0) return -1
    if (a.toolCount === 0 && b.toolCount > 0) return 1
    return b.toolCount - a.toolCount
  })

  return (
    <>
      {sorted.map((category, index) => {
        const Icon = iconMap[category.iconName] ?? PenLine
        const styles = categoryStyles[category.slug] ?? categoryStyles["ai-writing"]!
        const isEmpty = category.toolCount === 0

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <Link
              href={isEmpty ? "#" : `/categories/${category.slug}`}
              className={`group relative block rounded-2xl border p-6 shadow-premium transition-all duration-200 ${
                isEmpty
                  ? "border-border/30 bg-muted/30 cursor-default opacity-60"
                  : "border-border/50 bg-white hover:shadow-premium-lg hover:-translate-y-0.5"
              }`}
            >
              {!isEmpty && (
                <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />
              )}

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    isEmpty ? "bg-muted text-muted-foreground" : styles.iconBg
                  } shadow-sm ring-1 ring-border/10`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {isEmpty ? (
                    <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      Coming Soon
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${styles.gradient} px-3 py-1 text-xs font-semibold text-white shadow-sm`}>
                      {category.toolCount}
                      <span className="hidden sm:inline">{category.toolCount === 1 ? "tool" : "tools"}</span>
                    </span>
                  )}
                </div>
                <h3 className={`mt-5 text-base font-semibold sm:text-lg ${
                  isEmpty ? "text-muted-foreground" : "text-foreground"
                }`}>
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isEmpty ? "No tools yet" : `${category.toolCount} ${category.toolCount === 1 ? "tool" : "tools"} available`}
                </p>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </>
  )
}
