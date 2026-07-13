"use client"

import Link from "next/link"
import { Clock, ArrowUpRight, CalendarDays } from "lucide-react"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"

type ArticleItem = {
  id: string; title: string; slug: string; description: string
  categoryName: string; readTime: string; publishedAt: string
}

const categoryGradients: Record<string, { badge: string; image: string }> = {
  Tutorial: { badge: "from-blue-100 to-indigo-100 text-blue-700", image: "from-blue-200 to-indigo-200" },
  Guide: { badge: "from-emerald-100 to-teal-100 text-emerald-700", image: "from-emerald-200 to-teal-200" },
  Comparison: { badge: "from-violet-100 to-purple-100 text-violet-700", image: "from-violet-200 to-purple-200" },
  News: { badge: "from-amber-100 to-orange-100 text-amber-700", image: "from-amber-200 to-orange-200" },
  Review: { badge: "from-rose-100 to-pink-100 text-rose-700", image: "from-rose-200 to-pink-200" },
}

const defaultGradient = { badge: "from-violet-100 to-purple-100 text-violet-700", image: "from-violet-200 to-purple-200" }

function ArticlePlaceholder({ gradient }: { gradient: string }) {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-muted to-muted/50">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-30`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.3),transparent_60%)]" />
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/60 backdrop-blur-sm shadow-sm">
          <span className="text-[10px] font-bold text-muted-foreground">AI</span>
        </div>
        <span className="text-[10px] font-medium text-white/80 drop-shadow-sm">Article</span>
      </div>
    </div>
  )
}

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
          className="group relative flex h-full flex-col rounded-2xl border border-border/40 bg-white p-0 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/20 overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-violet-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08), transparent 60%)" }} />

          <ArticlePlaceholder gradient={fg.image} />

          <div className="relative flex flex-1 flex-col p-6 sm:p-7">
            <span className={`inline-block w-fit rounded-full bg-gradient-to-r ${fg.badge} px-3 py-1 text-xs font-medium shadow-sm`}>
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
              <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                Read <ArrowUpRight className="h-3 w-3" />
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
              className="group relative flex h-full flex-col rounded-2xl border border-border/40 bg-white p-0 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/20 overflow-hidden"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-violet-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08), transparent 60%)" }} />

              <ArticlePlaceholder gradient={sg.image} />

              <div className="relative flex flex-1 flex-col p-5 sm:p-6">
                <span className={`inline-block w-fit rounded-full bg-gradient-to-r ${sg.badge} px-3 py-1 text-[11px] font-medium shadow-sm`}>
                  {article.categoryName}
                </span>
                <h3 className="mt-3 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed flex-1">
                  {article.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {article.readTime}
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </>
  )
}
