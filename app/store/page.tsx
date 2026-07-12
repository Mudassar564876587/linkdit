"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, ArrowRight, ShoppingBag } from "lucide-react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

const products = [
  {
    id: "ai-creator-prompt-vault",
    name: "AI Creator Prompt Vault",
    tagline: "Premium AI video prompts for creators",
    description:
      "Hand-curated collection of high-converting AI video prompts. Perfect for TikTok, Reels, and YouTube Shorts.",
    price: "From $1.49",
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    icon: "🎬",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
}

export default function StorePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.06),transparent_50%)]" />
          <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 lg:pt-32 lg:pb-28">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="mx-auto max-w-2xl text-center"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
                <ShoppingBag className="h-3.5 w-3.5" />
                Premium Digital Products
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                The{" "}
                <span className="bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">
                  Creator&apos;s Toolkit
                </span>
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Ready-to-use prompt packs, templates, and digital assets designed to
                supercharge your content workflow.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={item}>
                <Link href={`/store/${product.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1">
                    <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-50`} />
                    <div className="relative p-6 sm:p-8">
                      <span className="mb-4 block text-4xl">{product.icon}</span>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">{product.tagline}</p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground/80 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">{product.price}</span>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all duration-200 group-hover:gap-1.5">
                          View Details
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {products.length === 1 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-12 text-center text-sm text-muted-foreground"
            >
              <Sparkles className="mr-1.5 inline-block h-3.5 w-3.5" />
              More products coming soon
            </motion.p>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
