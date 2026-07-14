"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
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

type CategoryItem = {
  id: string; name: string; slug: string; toolCount: number; iconName: string; description: string
}

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
              href={isEmpty ? "/submit-tool" : `/categories/${category.slug}`}
              className={`group relative flex h-full flex-col rounded-2xl border p-5 shadow-premium-card transition-all duration-250 ${
                isEmpty
                  ? "border-border/30 bg-muted/20 cursor-default opacity-60"
                    : "border-border/40 bg-white hover:shadow-premium-xl hover:-translate-y-2 focus-visible:shadow-premium-xl focus-visible:-translate-y-2"
              }`}
            >
              {/* Top accent bar on hover */}
              {!isEmpty && (
                <div className="pointer-events-none absolute top-0 left-5 right-5 h-[2px] rounded-full bg-gradient-to-r from-blue-500/0 via-indigo-500/0 to-violet-500/0 transition-all duration-250 group-hover:from-blue-500/50 group-hover:via-indigo-500/30 group-hover:to-violet-500/50" />
              )}

              {/* Icon + Name + Tool count */}
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 transition-all duration-250 group-hover:scale-105 group-hover:shadow-md ${
                  isEmpty
                    ? "bg-muted text-muted-foreground ring-border/10"
                    : `bg-gradient-to-br ${styles.gradient} text-white ${styles.ring} group-hover:ring-2`
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`text-[0.9375rem] font-semibold leading-snug ${
                    isEmpty ? "text-muted-foreground" : "text-foreground group-hover:text-primary transition-colors"
                  }`}>
                    {category.name}
                  </h3>
                  <span className={`mt-1 inline-block text-xs font-medium ${
                    isEmpty ? "text-muted-foreground/60" : "text-muted-foreground"
                  }`}>
                    {isEmpty ? "No tools yet" : `${category.toolCount} ${category.toolCount === 1 ? "tool" : "tools"}`}
                  </span>
                </div>
              </div>

              {/* Description */}
              {category.description && !isEmpty && (
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground leading-relaxed flex-1">
                  {category.description}
                </p>
              )}

              {/* Spacer when no description */}
              {(!category.description || isEmpty) && <div className="flex-1" />}

              {/* Footer */}
              <div className="mt-4 flex items-center gap-1.5 border-t border-border/30 pt-4">
                <span className="text-xs font-medium text-primary transition-all duration-250 group-hover:gap-2 inline-flex items-center gap-1">
                  {isEmpty ? "Suggest a tool" : "Browse tools"}
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </>
  )
}
