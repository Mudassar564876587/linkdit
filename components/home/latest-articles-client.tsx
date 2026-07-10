"use client"

import Link from "next/link"
import { Clock, ArrowUpRight, CalendarDays } from "lucide-react"
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
  const secondary = rest.slice(0, 2)

  return (
    <>
      {/* Featured article */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-50px" }}
        className="lg:col-span-2"
      >
        <Link
          href={`/articles/${featured.slug}`}
          className="group relative flex h-full flex-col rounded-2xl border border-border/50 bg-white p-7 shadow-premium transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-1 sm:p-8"
        >
          <div className="flex items-start gap-2">
            <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
              {featured.categoryName}
            </span>
          </div>
          <h3 className="mt-4 text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors sm:text-2xl">
            {featured.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground leading-relaxed flex-1">
            {featured.description}
          </p>
          <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
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
            <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-all">
              Read <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </Link>
      </motion.div>

      {/* Secondary articles */}
      {secondary.map((article, i) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 * (i + 1) }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <Link
            href={`/articles/${article.slug}`}
            className="group relative flex h-full flex-col rounded-2xl border border-border/50 bg-white p-6 shadow-premium transition-all duration-200 hover:shadow-premium-lg hover:-translate-y-0.5"
          >
            <span className="inline-block w-fit rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              {article.categoryName}
            </span>
            <h3 className="mt-3 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed flex-1">
              {article.description}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime}
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </motion.div>
      ))}
    </>
  )
}
