"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { Check, ArrowLeft, Sparkles, Star, Shield, Zap, Clock, Gift } from "lucide-react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

const WHATSAPP_NUMBER = "923197013743"

const packages = [
  {
    name: "Starter",
    price: 1.49,
    label: "100 Premium AI Trending Video Prompts",
    features: [
      "100 Premium AI Trending Video Prompts",
    ],
    popular: false,
    gradient: "from-slate-500 to-gray-500",
  },
  {
    name: "Pro",
    price: 2.99,
    label: "300 Premium AI Trending Video Prompts",
    features: [
      "300 Premium AI Trending Video Prompts",
    ],
    popular: true,
    gradient: "from-violet-500 via-fuchsia-500 to-amber-500",
  },
  {
    name: "Ultimate",
    price: 5.99,
    label: "700 Premium AI Trending Video Prompts",
    features: [
      "700 Premium AI Trending Video Prompts",
      "FREE Premium Gift",
    ],
    popular: false,
    gradient: "from-amber-500 via-orange-500 to-rose-500",
  },
]

function getWhatsAppLink(pkg: typeof packages[number]) {
  const message = [
    "Hello! 👋",
    "",
    "I'd like to purchase the following product from LinkDit.",
    "",
    "━━━━━━━━━━━━━━━━━━━",
    "",
    "🛍️ Product",
    "AI Creator Prompt Vault",
    "",
    "📦 Package",
    pkg.name,
    "",
    "💰 Price",
    `$${pkg.price.toFixed(2)} USD`,
    "",
    "━━━━━━━━━━━━━━━━━━━",
    "",
    "Please send me:",
    "",
    "✅ Payment method",
    "",
    "✅ Purchase instructions",
    "",
    "✅ Delivery details",
    "",
    "Thank you! 🚀",
  ].join("\n")

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

const fadeUp: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

function AnimatedBlob({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{ scale: [1, 1.15, 1, 0.95, 1], rotate: [0, 30, 0, -20, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

export default function AiCreatorPromptVaultPage() {
  const [loadingPkg, setLoadingPkg] = useState<string | null>(null)

  function handleClick(pkg: typeof packages[number]) {
    setLoadingPkg(pkg.name)
    setTimeout(() => {
      setLoadingPkg(null)
      window.open(getWhatsAppLink(pkg), "_blank")
    }, 500)
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden pb-16 pt-24 sm:pb-20 sm:pt-32">
          <div className="pointer-events-none absolute inset-0 bg-noise" />
          <AnimatedBlob className="-left-40 -top-40 h-96 w-96 bg-violet-500/10 dark:bg-violet-500/15" />
          <AnimatedBlob className="-right-40 top-1/4 h-80 w-80 bg-fuchsia-500/10 dark:bg-fuchsia-500/15" />
          <AnimatedBlob className="-bottom-40 left-1/4 h-72 w-72 bg-amber-500/10 dark:bg-amber-500/15" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                href="/store"
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Store
              </Link>

              <div className="mx-auto max-w-2xl text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-white/60 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shadow-soft-sm backdrop-blur-xl dark:bg-white/5"
                >
                  <Sparkles className="h-3 w-3 text-primary" />
                  Best Seller
                </motion.div>

                <span className="mb-4 block text-5xl sm:text-6xl">🎬</span>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  AI Creator Prompt Vault
                </h1>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Hand-curated collection of high-converting AI video prompts for
                  TikTok, Reels, and YouTube Shorts. Ready to use — just copy, paste, and create.
                </p>
              </div>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mx-auto mt-10 flex max-w-xl flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground"
            >
              {[
                { icon: Star, text: "Trending Prompts" },
                { icon: Shield, text: "Instant Delivery" },
                { icon: Zap, text: "Copy & Paste" },
                { icon: Clock, text: "24/7 Access" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <span key={item.text} className="inline-flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    {item.text}
                  </span>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ─── Pricing ─── */}
        <section className="border-t border-border bg-gradient-to-b from-background via-secondary/20 to-background py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center"
            >
              <span className="inline-block rounded-full border border-border bg-secondary/80 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Pricing
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Choose your plan
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                One-time purchase. Lifetime access. No subscription required.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-3 sm:gap-4 lg:gap-6"
            >
              {packages.map((pkg) => {
                const isPopular = pkg.popular
                const isLoading = loadingPkg === pkg.name

                return (
                  <PricingCard
                    key={pkg.name}
                    pkg={pkg}
                    isPopular={isPopular}
                    isLoading={isLoading}
                    onSelect={() => handleClick(pkg)}
                  />
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ─── Trust / CTA ─── */}
        <section className="border-t border-border py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-noise" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative mx-auto max-w-lg px-4 text-center sm:px-6"
          >
            <div className="rounded-3xl border border-border bg-gradient-to-b from-secondary/50 to-background p-8 shadow-soft sm:p-12">
              <Gift className="mx-auto h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-bold text-foreground">Instant Digital Delivery</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                After purchase, you&apos;ll receive your prompts instantly via WhatsApp.
                No waiting, no shipping — just pure creativity.
              </p>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function PricingCard({
  pkg,
  isPopular,
  isLoading,
  onSelect,
}: {
  pkg: typeof packages[number]
  isPopular: boolean
  isLoading: boolean
  onSelect: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col rounded-2xl border bg-card shadow-card transition-all duration-500 ${
        isPopular
          ? "border-primary/30 shadow-premium-lg scale-[1.02] sm:scale-105 z-10"
          : "border-border hover:border-border/80 hover:shadow-premium"
      } ${isHovered ? "scale-[1.03] shadow-card-hover" : ""}`}
      style={{ transformOrigin: "center center" }}
    >
      {/* Glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-500"
        style={{
          background: isPopular
            ? "radial-gradient(ellipse at center, hsl(var(--primary) / 0.15), transparent)"
            : "radial-gradient(ellipse at center, hsl(var(--primary) / 0.06), transparent)",
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      {/* Gradient top border */}
      <div
        className={`absolute top-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r ${pkg.gradient} transition-all duration-500 ${
          isHovered ? "opacity-100 scale-x-100" : "opacity-70 scale-x-90"
        }`}
      />

      {/* Most Popular badge */}
      {isPopular && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-lg animate-pulse-glow">
            <Sparkles className="h-3 w-3" />
            Most Popular
          </span>
        </motion.div>
      )}

      <div className="relative flex flex-1 flex-col p-6 pt-8 sm:p-8 z-10">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          {pkg.name}
        </h3>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-foreground">
            ${pkg.price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">USD</span>
        </div>

        {/* Animated price glow on hover */}
        <motion.div
          className="absolute top-20 left-8 h-12 w-24 rounded-full blur-2xl"
          style={{ background: `hsl(var(--primary) / 0.1)` }}
          animate={{ opacity: isHovered ? 0.8 : 0, scale: isHovered ? 1.2 : 0.8 }}
          transition={{ duration: 0.4 }}
        />

        <p className="mt-2 text-sm text-muted-foreground">{pkg.label}</p>

        <ul className="mt-6 space-y-3">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
              <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-3 w-3 text-primary" />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <button
            onClick={onSelect}
            disabled={isLoading}
            className={`relative w-full overflow-hidden rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
              isPopular
                ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg"
                : "border border-input bg-background text-foreground hover:bg-accent"
            } disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.97]`}
          >
            {/* Shine effect */}
            {isPopular && !isLoading && (
              <span className="absolute inset-0 overflow-hidden">
                <span className="absolute inset-0 -translate-x-full animate-shine bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </span>
            )}

            {isLoading ? (
              <span className="relative inline-flex items-center gap-1.5">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Opening WhatsApp...
              </span>
            ) : (
              <span className="relative inline-flex items-center gap-1.5">
                🚀 Get Instant Access
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
