"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import TiltCard from "@/components/ui/tilt-card"
import { PenLine, Image, Video, Code2, Zap, BarChart3, Music, TrendingUp, BookOpen, Palette } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PenLine, Image, Video, Code2, Zap, BarChart3, Music, TrendingUp, BookOpen, Palette,
}

const categoryStyles: Record<string, { iconBg: string }> = {
  "ai-writing": { iconBg: "bg-blue-100 text-blue-600" },
  "image-generation": { iconBg: "bg-violet-100 text-violet-600" },
  video: { iconBg: "bg-rose-100 text-rose-600" },
  coding: { iconBg: "bg-emerald-100 text-emerald-600" },
  productivity: { iconBg: "bg-amber-100 text-amber-600" },
  marketing: { iconBg: "bg-cyan-100 text-cyan-600" },
  audio: { iconBg: "bg-purple-100 text-purple-600" },
  analytics: { iconBg: "bg-orange-100 text-orange-600" },
  education: { iconBg: "bg-teal-100 text-teal-600" },
  design: { iconBg: "bg-pink-100 text-pink-600" },
}

type CategoryItem = { id: string; name: string; slug: string; toolCount: number; iconName: string }

export default function CategoriesClient({ categories }: { categories: CategoryItem[] }) {
  return (
    <>
      {categories.map((category, index) => {
        const Icon = iconMap[category.iconName] ?? PenLine
        const styles = categoryStyles[category.slug] ?? categoryStyles["ai-writing"]!

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, rotateX: -15, y: 40 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
            viewport={{ once: true, margin: "-50px" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <TiltCard maxTilt={6}>
              <Link
                href={`/categories/${category.slug}`}
                className="group card-depth rounded-xl block p-5 transition-all duration-200 hover:shadow-card-hover active:scale-[0.98] sm:p-6"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles.iconBg} sm:h-12 sm:w-12`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground sm:mt-5 sm:text-lg">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.toolCount > 0 ? `${category.toolCount} ${category.toolCount === 1 ? "tool" : "tools"}` : "Coming Soon"}
                </p>
              </Link>
            </TiltCard>
          </motion.div>
        )
      })}
    </>
  )
}