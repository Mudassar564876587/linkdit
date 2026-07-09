"use client"

import Link from "next/link"
import { Star, MessageSquare, ArrowUpRight, Quote } from "lucide-react"
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
          className={`h-3.5 w-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  )
}

export default function CommunityReviewsClient({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <section className="border-t border-border bg-gradient-to-b from-white to-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground sm:text-[2rem] lg:text-[2.25rem]">
              Community Reviews
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base lg:text-lg">
              See what our community is saying about their favorite AI tools.
            </p>
          </div>
          <div className="mx-auto mt-14 max-w-sm rounded-2xl border border-border/60 bg-white p-8 text-center shadow-premium sm:mt-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
              <MessageSquare className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">No reviews yet</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Be the first to share your experience with an AI tool.
            </p>
            <Link href="/tools" className="btn-primary mt-4 inline-flex">
              Browse AI tools
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="border-t border-border bg-gradient-to-b from-white to-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground sm:text-[2rem] lg:text-[2.25rem]">
            Community Reviews
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base lg:text-lg">
            See what our community is saying about their favorite AI tools.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="relative h-full rounded-2xl border border-border/50 bg-white p-5 shadow-premium transition-all duration-200 hover:shadow-premium-lg hover:border-primary/15 sm:p-6">
                <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/5" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getAvatarColor(review.title || "Anonymous")} text-xs font-bold text-white shadow-sm`}>
                        {(review.title || "A").charAt(0)}
                      </div>
                      <div>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{formatDate(review.created_at)}</span>
                  </div>

                  <h3 className="mt-3 text-sm font-semibold text-foreground line-clamp-1">{review.title}</h3>
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground leading-relaxed">{review.content}</p>

                  {review.tools && (
                    <Link
                      href={`/tools/${review.tools.slug}`}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      {review.tools.name}
                      <ArrowUpRight className="h-3 w-3" />
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
