"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles, Star, Shield, Zap } from "lucide-react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

const products = [
  {
    id: "ai-creator-prompt-vault",
    name: "AI Creator Prompt Vault",
    tagline: "Premium AI video prompts for creators",
    description:
      "Hand-curated collection of high-converting AI video prompts for TikTok, Reels, and YouTube Shorts.",
    price: "From $1.49",
    gradient: "from-violet-500 via-fuchsia-500 to-amber-500",
    icon: "🎬",
    badge: "Best Seller",
  },
]

const comingSoon = [
  { name: "AI Business Vault", icon: "💼", gradient: "from-blue-500 via-cyan-500 to-teal-500" },
  { name: "AI SEO Vault", icon: "🔍", gradient: "from-emerald-500 via-green-500 to-teal-500" },
  { name: "AI YouTube Vault", icon: "📹", gradient: "from-red-500 via-rose-500 to-pink-500" },
  { name: "AI Shopify Vault", icon: "🛍️", gradient: "from-emerald-500 via-teal-500 to-cyan-500" },
  { name: "AI Marketing Vault", icon: "📢", gradient: "from-orange-500 via-amber-500 to-yellow-500" },
  { name: "AI Image Vault", icon: "🎨", gradient: "from-purple-500 via-pink-500 to-rose-500" },
]

const fadeUp: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

function AnimatedBlob({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        scale: [1, 1.2, 1, 0.9, 1],
        rotate: [0, 45, 0, -30, 0],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

function FloatingCircle({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full border ${className}`}
      animate={{ y: [-8, 8, -8] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    />
  )
}

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="text-center"
    >
      <span className="inline-block rounded-full border border-border bg-secondary/80 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
    </motion.div>
  )
}

function ProductCard({ product }: { product: typeof products[number]; }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
    >
      <Link
        href={`/store/${product.id}`}
        className="group relative block"
      >
        {/* Glow behind card */}
        <div className="absolute -inset-x-4 -inset-y-6 rounded-3xl bg-gradient-to-br from-primary/5 via-fuchsia-500/5 to-amber-500/5 opacity-0 blur-2xl transition-all duration-700 group-hover:opacity-100" />

        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-500 group-hover:shadow-card-hover group-hover:-translate-y-1.5">
          {/* Gradient top bar */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${product.gradient}`} />

          {/* Badge */}
          <div className="absolute right-5 top-5 z-10">
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/50 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
              <Sparkles className="h-3 w-3" />
              {product.badge}
            </span>
          </div>

          <div className="p-7 sm:p-9">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className="mb-3 block text-4xl sm:text-5xl">{product.icon}</span>
                <h3 className="text-xl font-bold text-foreground sm:text-2xl group-hover:text-primary transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{product.tagline}</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground/80 max-w-xl">
              {product.description}
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
              <div>
                <span className="text-xs text-muted-foreground">Starting at</span>
                <p className="text-lg font-bold text-foreground">{product.price}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-300 group-hover:bg-primary/90 group-hover:shadow-lg group-hover:gap-3">
                View Details
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function StorePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-36">
          {/* Noise */}
          <div className="pointer-events-none absolute inset-0 bg-noise" />

          {/* Animated blobs */}
          <AnimatedBlob className="-left-32 -top-32 h-72 w-72 bg-violet-500/10 dark:bg-violet-500/15" />
          <AnimatedBlob className="-right-32 top-1/3 h-96 w-96 bg-fuchsia-500/10 dark:bg-fuchsia-500/15" />
          <AnimatedBlob className="-bottom-40 left-1/3 h-80 w-80 bg-amber-500/10 dark:bg-amber-500/15" />

          {/* Floating decorative elements */}
          <FloatingCircle className="left-[15%] top-20 h-3 w-3 border-primary/30 bg-primary/10" />
          <FloatingCircle className="right-[20%] top-32 h-2 w-2 border-fuchsia-500/30 bg-fuchsia-500/10" delay={1} />
          <FloatingCircle className="left-[10%] bottom-40 h-4 w-4 border-amber-500/30 bg-amber-500/10" delay={2} />
          <FloatingCircle className="right-[25%] top-1/2 h-2.5 w-2.5 border-violet-500/30 bg-violet-500/10" delay={0.5} />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="mx-auto max-w-3xl text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-soft-sm backdrop-blur-xl dark:bg-white/5"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Premium Digital Products
              </motion.div>

              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                The{" "}
                <span className="bg-gradient-to-r from-primary via-fuchsia-500 to-amber-500 bg-clip-text text-transparent animate-gradient">
                  Creator&apos;s Toolkit
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                Ready-to-use prompt packs, templates, and digital assets
                designed to supercharge your content workflow.
              </motion.p>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-8 rounded-2xl border border-border bg-white/50 px-8 py-5 shadow-soft backdrop-blur-xl dark:bg-white/5"
            >
              {[
                { icon: Star, label: "Premium Quality" },
                { icon: Shield, label: "Instant Access" },
                { icon: Zap, label: "Trending Prompts" },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{stat.label}</span>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ─── Products ─── */}
        <section className="border-t border-border bg-gradient-to-b from-background via-secondary/20 to-background py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading label="Products" title="Choose your toolkit" />

            <div className="mt-14">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Coming Soon ─── */}
        <section className="border-t border-border py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-noise" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading label="Coming Soon" title="More tools on the way" />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {comingSoon.map((item) => (
                <motion.div
                  key={item.name}
                  variants={fadeUp}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-6 shadow-soft-sm transition-all duration-500 hover:shadow-premium hover:-translate-y-0.5"
                >
                  {/* Gradient border on hover */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
                  />
                  <span className="mb-3 block text-2xl">{item.icon}</span>
                  <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Coming soon</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
