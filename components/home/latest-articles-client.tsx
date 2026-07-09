"use client"

import Link from "next/link"
import { Clock, CalendarDays, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import TiltCard from "@/components/ui/tilt-card"
import { formatDate } from "@/lib/utils"

const articleStyles = [
  { gradient: "from-violet-500/20 to-purple-600/10", badge: "bg-violet-100 text-violet-700" },
  { gradient: "from-blue-500/20 to-indigo-600/10", badge: "bg-blue-100 text-blue-700" },
  { gradient: "from-emerald-500/20 to-emerald-600/10", badge: "bg-emerald-100 text-emerald-700" },
  { gradient: "from-amber-500/20 to-amber-600/10", badge: "bg-amber-100 text-amber-700" },
  { gradient: "from-rose-500/20 to-rose-600/10", badge: "bg-rose-100 text-rose-700" },
  { gradient: "from-cyan-500/20 to-cyan-600/10", badge: "bg-cyan-100 text-cyan-700" },
]

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
  return (
    <>
      {articles.map((article, index) => {
        const style = articleStyles[index % articleStyles.length]
        return (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, rotateX: -15, y: 40 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
            viewport={{ once: true, margin: "-50px" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <TiltCard maxTilt={6}>
              <article className="group overflow-hidden rounded-2xl border border-border bg-background shadow-soft-sm transition-all duration-200 hover:border-primary/20 hover:shadow-premium">
                <div className={`flex h-40 items-center justify-center bg-gradient-to-br ${style.gradient} sm:h-48`}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background/60 backdrop-blur-sm sm:h-16 sm:w-16">
                    <CalendarDays className="h-6 w-6 text-muted-foreground sm:h-7 sm:w-7" />
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${style.badge}`}>
                    {article.categoryName}
                  </span>
                  <h3 className="mt-3 text-base font-semibold leading-snug text-foreground sm:text-lg">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground sm:mt-2">
                    {article.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3 sm:mt-4 sm:pt-4">
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground sm:gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {article.readTime}
                      </span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-all group-hover:opacity-100" asChild>
                      <Link href={`/articles/${article.slug}`}>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            </TiltCard>
          </motion.div>
        )
      })}
    </>
  )
}