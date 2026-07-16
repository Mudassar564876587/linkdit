"use client"

import Link from "next/link"
import { Star, ArrowUpRight, Quote } from "lucide-react"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"
import { SectionHeader } from "@/components/ui/section-header"

type Review = {
  id: string; rating: number; title: string; content: string
  created_at: string; tool_id: string; tools: { name: string; slug: string } | null
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 transition-all duration-200 ${
            i < rating ? "fill-amber-400 text-amber-400" : "fill-muted/40 text-muted/40"
          }`}
        />
      ))}
    </div>
  )
}

export default function CommunityReviewsClient({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <SectionHeader
          title="Community Reviews"
          description="Real feedback from real users. See what the community is saying."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.06 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="group relative h-full rounded-2xl border border-border/40 bg-white p-5 shadow-premium-card transition-all duration-[var(--duration-standard)] ease-[var(--ease-default)] hover:shadow-premium-xl hover:-translate-y-1.5 focus-visible:shadow-premium-xl focus-visible:-translate-y-1.5 active:scale-[0.98]">
                {/* Top accent bar on hover */}
                <div className="pointer-events-none absolute top-0 left-5 right-5 h-[2px] rounded-full bg-gradient-to-r from-blue-500/50 via-indigo-500/30 to-violet-500/50 opacity-0 transition-opacity duration-[var(--duration-standard)] group-hover:opacity-100" />

                {/* Quote icon */}
                <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-muted/50">
                  <Quote className="h-4 w-4 text-muted-foreground/30" />
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between gap-2">
                    <StarRating rating={review.rating} />
                    <span className="text-[11px] text-muted-foreground">{formatDate(review.created_at)}</span>
                  </div>

                  <h3 className="mt-3 text-sm font-semibold text-foreground line-clamp-1">{review.title}</h3>
                  <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground leading-relaxed">{review.content}</p>

                  {review.tools && (
                    <Link
                      href={`/tools/${review.tools.slug}`}
                      className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary transition-all duration-200 hover:gap-1.5"
                    >
                      {review.tools.name}
                      <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
