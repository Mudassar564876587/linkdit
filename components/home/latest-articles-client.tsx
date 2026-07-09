"use client"

import Link from "next/link"
import { Clock, CalendarDays, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"

type ArticleItem = {
  id: string
  title: string
  slug: string
  description: string
  categoryName: string
  readTime: string
  publishedAt: string
}

export default function LatestArticlesClient({ articles }: { articles: ArticleItem[] }) {
  if (articles.length === 0) return null

  const [featured, ...rest] = articles
  const remaining = rest.slice(0, 4)

  return (
    <>
      {/* Featured article - magazine hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-50px" }}
        className="sm:col-span-2 lg:col-span-2"
      >
        <Link
          href={`/articles/${featured.slug}`}
          className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-white shadow-premium transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-1"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="relative flex h-48 sm:h-auto sm:w-1/2 items-center justify-center bg-gradient-to-br from-violet-500/20 via-purple-600/10 to-blue-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-violet-500/10 to-transparent" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg sm:h-20 sm:w-20">
                <CalendarDays className="h-7 w-7 text-violet-600 sm:h-8 sm:w-8" />
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5 sm:p-7">
              <span className="inline-block w-fit rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                {featured.categoryName}
              </span>
              <h3 className="mt-3 text-lg font-bold leading-snug text-foreground sm:text-xl group-hover:text-primary transition-colors">
                {featured.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                {featured.description}
              </p>
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {featured.readTime}
                  </span>
                  <span>{formatDate(featured.publishedAt)}</span>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-all">
                  Read more <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Side articles */}
      {remaining.map((article, i) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 * (i + 1) }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <Link
            href={`/articles/${article.slug}`}
            className="group relative block h-full rounded-2xl border border-border/60 bg-white p-5 shadow-premium transition-all duration-200 hover:shadow-premium-lg hover:-translate-y-0.5 sm:p-6"
          >
            <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              {article.categoryName}
            </span>
            <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors sm:text-base line-clamp-2">
              {article.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
              {article.description}
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readTime}
                </span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </motion.div>
      ))}
    </>
  )
}
