"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { PenLine, Image, Video, Code2, Zap, BarChart3, Music, TrendingUp, BookOpen, Palette } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PenLine, Image, Video, Code2, Zap, BarChart3, Music, TrendingUp, BookOpen, Palette,
}

const categoryStyles: Record<string, { gradient: string; ring: string }> = {
  "ai-writing": { gradient: "from-blue-500 to-blue-600", ring: "ring-blue-200/50" },
  "image-generation": { gradient: "from-violet-500 to-violet-600", ring: "ring-violet-200/50" },
  video: { gradient: "from-rose-500 to-rose-600", ring: "ring-rose-200/50" },
  coding: { gradient: "from-emerald-500 to-emerald-600", ring: "ring-emerald-200/50" },
  productivity: { gradient: "from-amber-500 to-amber-600", ring: "ring-amber-200/50" },
  marketing: { gradient: "from-cyan-500 to-cyan-600", ring: "ring-cyan-200/50" },
  audio: { gradient: "from-purple-500 to-purple-600", ring: "ring-purple-200/50" },
  analytics: { gradient: "from-orange-500 to-orange-600", ring: "ring-orange-200/50" },
  education: { gradient: "from-teal-500 to-teal-600", ring: "ring-teal-200/50" },
  design: { gradient: "from-pink-500 to-pink-600", ring: "ring-pink-200/50" },
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
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.06 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <Link
              href={isEmpty ? "#" : `/categories/${category.slug}`}
              className={`group relative block rounded-2xl border p-6 shadow-sm transition-all duration-300 ${
                isEmpty
                  ? "border-border/30 bg-muted/30 cursor-default opacity-60"
                  : "border-border/40 bg-white hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/20"
              }`}
            >
              {!isEmpty && (
                <>
                  <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />
                  <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08), transparent 60%)" }} />
                </>
              )}

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl shadow-sm ring-1 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
                    isEmpty ? "bg-muted text-muted-foreground ring-border/10" : `bg-gradient-to-br ${styles.gradient} text-white ${styles.ring}`
                  }`}>
                    <Icon className="h-6 w-6" />
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
                <h3 className={`mt-5 text-base font-semibold sm:text-lg ${isEmpty ? "text-muted-foreground" : "text-foreground"}`}>
                  {category.name}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
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
