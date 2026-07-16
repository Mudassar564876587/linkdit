"use client"

import Link from "next/link"
import { Clock, ArrowUpRight, CalendarDays, Newspaper } from "lucide-react"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"

type ArticleItem = {
  id: string; title: string; slug: string; description: string
  categoryName: string; readTime: string; publishedAt: string
}

const categoryGradients: Record<string, { badge: string; placeholder: string }> = {
  Tutorial: { badge: "from-blue-100 to-indigo-100 text-blue-700", placeholder: "from-blue-100/40 to-indigo-100/20" },
  Guide: { badge: "from-emerald-100 to-teal-100 text-emerald-700", placeholder: "from-emerald-100/40 to-teal-100/20" },
  Comparison: { badge: "from-violet-100 to-purple-100 text-violet-700", placeholder: "from-violet-100/40 to-purple-100/20" },
  News: { badge: "from-amber-100 to-orange-100 text-amber-700", placeholder: "from-amber-100/40 to-orange-100/20" },
  Review: { badge: "from-rose-100 to-pink-100 text-rose-700", placeholder: "from-rose-100/40 to-pink-100/20" },
}

const defaultGradient = { badge: "from-violet-100 to-purple-100 text-violet-700", placeholder: "from-violet-100/40 to-purple-100/20" }

export default function LatestArticlesClient({ articles }: { articles: ArticleItem[] }) {
  if (articles.length === 0) return null

  const [featured, ...rest] = articles
  const secondary = rest.slice(0, 2)
  const fg = categoryGradients[featured.categoryName] ?? defaultGradient

  return (
    <>
      {/* Featured article */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true, margin: "-50px" }}
        className="lg:col-span-2"
      >
        <Link
          href={`/articles/${featured.slug}`}
              className="group relative flex h-full flex-col rounded-2xl border border-border/40 bg-white shadow-premium-card transition-all duration-[var(--duration-standard)] ease-[var(--ease-default)] hover:shadow-premium-xl hover:-translate-y-1.5 focus-visible:shadow-premium-xl focus-visible:-translate-y-1.5 active:scale-[0.98] overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="pointer-events-none absolute top-0 left-5 right-5 h-[2px] rounded-full bg-gradient-to-r from-blue-500/50 via-indigo-500/30 to-violet-500/50 opacity-0 transition-opacity duration-[var(--duration-standard)] group-hover:opacity-100 z-10" />

          {/* Placeholder */}
          <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-muted to-muted/50">
            <div className={`absolute inset-0 bg-gradient-to-br ${fg.placeholder}`} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.4),transparent_60%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Newspaper className="h-10 w-10 text-muted-foreground/20" />
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <span className={`inline-block w-fit rounded-full bg-gradient-to-r ${fg.badge} px-3 py-1 text-xs font-medium`}>
              {featured.categoryName}
            </span>
            <h3 className="mt-3 text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors sm:text-2xl">
              {featured.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed flex-1">
              {featured.description}
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-border/30 pt-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {featured.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(featured.publishedAt)}
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-primary transition-all duration-250 group-hover:gap-1.5">
                Read
                <ArrowUpRight className="h-3 w-3 transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Secondary articles */}
      {secondary.map((article, i) => {
        const sg = categoryGradients[article.categoryName] ?? defaultGradient
        return (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.08 * (i + 1) }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <Link
              href={`/articles/${article.slug}`}
          className="group relative flex h-full flex-col rounded-2xl border border-border/40 bg-white shadow-premium-card transition-all duration-[var(--duration-standard)] ease-[var(--ease-default)] hover:shadow-premium-xl hover:-translate-y-1.5 focus-visible:shadow-premium-xl focus-visible:-translate-y-1.5 active:scale-[0.98] overflow-hidden"
            >
              {/* Top accent bar */}
              <div className="pointer-events-none absolute top-0 left-5 right-5 h-[2px] rounded-full bg-gradient-to-r from-blue-500/50 via-indigo-500/30 to-violet-500/50 opacity-0 transition-opacity duration-[var(--duration-standard)] group-hover:opacity-100 z-10" />

              {/* Placeholder */}
              <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                <div className={`absolute inset-0 bg-gradient-to-br ${sg.placeholder}`} />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.4),transparent_60%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Newspaper className="h-8 w-8 text-muted-foreground/20" />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <span className={`inline-block w-fit rounded-full bg-gradient-to-r ${sg.badge} px-3 py-1 text-[11px] font-medium`}>
                  {article.categoryName}
                </span>
                <h3 className="mt-3 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed flex-1">
                  {article.description}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-border/30 pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {article.readTime}
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-all duration-250 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </>
  )
}
