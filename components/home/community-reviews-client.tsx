"use client"

import Link from "next/link"
import { Star, ArrowUpRight, Quote } from "lucide-react"
import { motion } from "framer-motion"
import { getAvatarColor, formatDate } from "@/lib/utils"

type Review = {
  id: string
  rating: number
  title: string
  content: string
  created_at: string
  tool_id: string
  tools: { name: string; slug: string } | null
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 transition-all duration-200 hover:scale-110 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"
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
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground sm:text-[2rem] lg:text-[2.25rem]">
            Community Reviews
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base lg:text-lg">
            Real feedback from real users. See what the community is saying.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="group relative h-full rounded-2xl border border-border/60 bg-white p-6 shadow-premium transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5">
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-violet-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/[0.04]" />
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
                      className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-all duration-200 group-hover:gap-1.5"
                    >
                      {review.tools.name}
                      <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
