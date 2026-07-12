"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight, Sparkles, Star, Shield, Zap, Check, Layers,
  RefreshCw, Clock, Gift, BookOpen, Eye, Award, Gem,
  TrendingUp, Hash, ShoppingBag, ChevronRight, Bell,
} from "lucide-react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

const WHATSAPP_NUMBER = "923197013743"

const products = [
  {
    id: "ai-creator-prompt-vault",
    name: "AI Creator Prompt Vault",
    tagline: "Premium AI video prompts for creators",
    description:
      "Hand-curated collection of 700+ high-converting AI video prompts for TikTok, Reels, and YouTube Shorts. Copy, paste, and create.",
    price: "From $1.49",
    gradient: "from-violet-500 via-fuchsia-500 to-amber-500",
    icon: "🎬",
    badge: "Best Seller",
    features: ["700+ Premium Prompts", "10+ AI Categories", "Commercial License", "Lifetime Updates"],
  },
]

const comingSoon = [
  { name: "AI Business Vault", icon: "💼", gradient: "from-blue-500 via-cyan-500 to-teal-500", desc: "AI prompts for business automation" },
  { name: "AI SEO Vault", icon: "🔍", gradient: "from-emerald-500 via-green-500 to-teal-500", desc: "SEO-optimized content prompts" },
  { name: "AI YouTube Vault", icon: "📹", gradient: "from-red-500 via-rose-500 to-pink-500", desc: "YouTube script & thumbnail prompts" },
  { name: "AI Shopify Vault", icon: "🛍️", gradient: "from-emerald-500 via-teal-500 to-cyan-500", desc: "E-commerce product prompts" },
  { name: "AI Marketing Vault", icon: "📢", gradient: "from-orange-500 via-amber-500 to-yellow-500", desc: "Multi-channel marketing prompts" },
  { name: "AI Image Vault", icon: "🎨", gradient: "from-purple-500 via-pink-500 to-rose-500", desc: "Premium image generation prompts" },
]

const easeOut = [0.25, 0.1, 0.25, 1] as const

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

function Blob({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{ scale: [1, 1.2, 1, 0.9, 1], rotate: [0, 30, 0, -20, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

function FloatingCircle({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full border ${className}`}
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    />
  )
}

function AnimatedCounter({ target, suffix = "", prefix = "", decimals = 0 }: { target: number; suffix?: string; prefix?: string; decimals?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { stiffness: 60, damping: 20 })
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    if (isInView) motionValue.set(target)
  }, [isInView, target, motionValue])

  useEffect(() => {
    const unsub = springValue.on("change", (v) => {
      setDisplay(`${prefix}${v.toFixed(decimals)}${suffix}`)
    })
    return () => unsub()
  }, [springValue, prefix, suffix, decimals])

  return <span ref={ref}>{display}</span>
}

function SectionHeading({ label, title, description }: { label: string; title: string; description?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="text-center"
    >
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary"
      >
        {label}
      </motion.span>
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{title}</h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  )
}

const trustBadges = [
  { icon: Clock, title: "Lifetime Access", desc: "One payment, forever access" },
  { icon: Zap, title: "Instant Delivery", desc: "Via WhatsApp, immediately" },
  { icon: Shield, title: "Secure Purchase", desc: "Encrypted & protected" },
  { icon: Gem, title: "Premium Quality", desc: "Expert crafted prompts" },
  { icon: RefreshCw, title: "Regular Updates", desc: "Always up to date" },
]

const stats = [
  { icon: Hash, target: 700, prefix: "", suffix: "+", label: "Premium Prompts" },
  { icon: Layers, target: 10, prefix: "", suffix: "+", label: "AI Categories" },
  { icon: ShoppingBag, target: 5000, prefix: "", suffix: "+", label: "Happy Customers" },
  { icon: Award, target: 99, prefix: "", suffix: "%", label: "Satisfaction Rate" },
]

export default function StorePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* ════════════════════════════════════════
            HERO
        ════════════════════════════════════════ */}
        <section className="relative min-h-[85vh] overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-36 flex items-center">
          <div className="pointer-events-none absolute inset-0 bg-noise" />
          <Blob className="-left-40 -top-40 h-96 w-96 bg-violet-500/10" />
          <Blob className="-right-40 top-1/3 h-80 w-80 bg-fuchsia-500/10" />
          <Blob className="-bottom-40 left-1/3 h-72 w-72 bg-amber-500/10" />

          <FloatingCircle className="left-[15%] top-28 h-3 w-3 border-primary/30 bg-primary/10" />
          <FloatingCircle className="right-[20%] top-36 h-2 w-2 border-fuchsia-500/30 bg-fuchsia-500/10" delay={1} />
          <FloatingCircle className="left-[10%] bottom-48 h-4 w-4 border-amber-500/30 bg-amber-500/10" delay={2} />
          <FloatingCircle className="right-[25%] top-1/2 h-2.5 w-2.5 border-violet-500/30 bg-violet-500/10" delay={0.5} />

          <div className="pointer-events-none absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #2563eb 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left */}
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-1.5 text-xs font-semibold text-amber-700 shadow-soft-sm"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  🔥 Premium AI Resources
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]"
                >
                  The{" "}
                  <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
                    Creator&apos;s Toolkit
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg max-w-xl mx-auto lg:mx-0"
                >
                  Premium prompt packs, templates, and AI resources designed to supercharge your content creation workflow. One-time purchase, lifetime access.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start"
                >
                  <Link
                    href="#products"
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-500 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                    <span className="relative flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Browse Products
                    </span>
                  </Link>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-2xl border border-border bg-white/80 px-8 py-4 text-sm font-medium text-foreground shadow-soft-sm backdrop-blur-sm transition-all duration-300 hover:shadow-soft-md hover:-translate-y-0.5"
                  >
                    <Zap className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                </motion.div>
              </div>

              {/* Right: Premium glass card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="hidden lg:block relative"
              >
                <div className="relative">
                  <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-amber-500/20 blur-3xl" />

                  <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-premium-lg backdrop-blur-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-amber-500/5" />
                    <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500" />

                    <div className="relative p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md">
                          <Gem className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">Premium Digital Products</h3>
                          <p className="text-xs text-muted-foreground">Curated for creators</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[
                          { label: "Ready-to-Use Prompts", value: "700+" },
                          { label: "AI Platforms Supported", value: "15+" },
                          { label: "Delivery Method", value: "Instant" },
                          { label: "License Type", value: "Commercial" },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                            <span className="text-sm font-semibold text-foreground">{item.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 px-4 py-3">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="text-xs font-medium text-emerald-700">One-time payment. No subscriptions.</span>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    animate={{ y: [-6, 6, -6] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-3 -right-3"
                  >
                    <span className="inline-flex items-center gap-1 rounded-full bg-white border border-border px-3 py-1 text-[11px] font-semibold text-foreground shadow-soft-sm">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      New
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SOCIAL PROOF
        ════════════════════════════════════════ */}
        <section className="relative border-t border-border/40 bg-gradient-to-b from-secondary/50 to-background py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-50" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group relative rounded-2xl border border-border bg-white/80 p-6 text-center shadow-soft-sm backdrop-blur-sm transition-all duration-300 hover:shadow-soft-md hover:-translate-y-0.5"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary mb-3 transition-transform group-hover:scale-110 group-hover:rotate-[-3deg] duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                      <AnimatedCounter target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            TRUST BADGES
        ════════════════════════════════════════ */}
        <section className="py-14 sm:py-18">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
              {trustBadges.map((badge, i) => {
                const Icon = badge.icon
                return (
                  <motion.div
                    key={badge.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="group rounded-xl border border-border/60 bg-white p-4 text-center transition-all duration-300 hover:shadow-soft-md hover:-translate-y-1 hover:border-primary/20 sm:p-5"
                  >
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary mb-2.5 transition-transform group-hover:scale-110 duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-xs font-semibold text-foreground sm:text-sm">{badge.title}</h4>
                    <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">{badge.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            FEATURED PRODUCT
        ════════════════════════════════════════ */}
        <section id="products" className="border-t border-border/40 bg-gradient-to-b from-background via-violet-50/20 to-background py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Featured Product"
              title="AI Creator Prompt Vault"
              description="Our most popular prompt pack. Used by thousands of creators worldwide to produce viral AI content."
            />

            <div className="mt-14">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            COMING SOON
        ════════════════════════════════════════ */}
        <section className="relative border-t border-border/40 py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-noise" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Coming Soon"
              title="More Vaults on the Way"
              description="We're constantly expanding our library. Here's what's in development."
            />

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
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-white/50 p-6 transition-all duration-500 hover:shadow-premium hover:-translate-y-1"
                >
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
                  />
                  <div className="relative">
                    <span className="mb-3 block text-2xl">{item.icon}</span>
                    <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/60">
                      <Clock className="h-3 w-3" />
                      Coming soon
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Waitlist CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 text-center"
            >
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'd like to be notified when new vaults launch.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-8 py-3.5 text-sm font-medium text-foreground shadow-soft-sm transition-all duration-300 hover:shadow-soft-md hover:-translate-y-0.5"
              >
                <Bell className="h-4 w-4" />
                Get Notified When New Vaults Launch
              </a>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            FINAL CTA
        ════════════════════════════════════════ */}
        <section className="relative overflow-hidden border-t border-border/40 py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-noise" />
          <Blob className="-left-60 -top-60 h-[500px] w-[500px] bg-violet-500/10" />
          <Blob className="-right-60 -bottom-60 h-[500px] w-[500px] bg-amber-500/10" />

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-500 px-8 py-16 shadow-2xl sm:px-16 sm:py-20"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Start Creating Better AI Content Today
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                Join thousands of creators who use LinkDit premium prompts to produce professional AI content. One payment, lifetime access.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/store/ai-creator-prompt-vault"
                  className="group relative overflow-hidden rounded-2xl bg-white px-10 py-4 text-sm font-semibold text-violet-600 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-transparent via-violet-100 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                  <span className="relative flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    View Products
                  </span>
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-10 py-4 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
                >
                  <Zap className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

/* ─── PRODUCT CARD ─── */
function ProductCard({ product }: { product: typeof products[number] }) {
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
        <div className="absolute -inset-x-6 -inset-y-8 rounded-3xl bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-amber-500/10 opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-100" />

        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-500 group-hover:shadow-card-hover group-hover:-translate-y-2">
          <div className={`h-1.5 w-full bg-gradient-to-r ${product.gradient}`} />

          {/* Badge */}
          <div className="absolute right-6 top-6 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 px-3 py-1 text-[11px] font-semibold text-amber-700 shadow-soft-sm">
              <Sparkles className="h-3 w-3" />
              {product.badge}
            </span>
          </div>

          <div className="p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-3 lg:gap-12 items-center">
              {/* Left: Product info */}
              <div className="lg:col-span-2">
                <span className="mb-4 block text-5xl sm:text-6xl">{product.icon}</span>
                <h3 className="text-2xl font-bold text-foreground sm:text-3xl group-hover:text-primary transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="mt-2 text-base text-muted-foreground">{product.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground/80 max-w-xl">
                  {product.description}
                </p>

                {/* Feature chips */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.features.map((feat) => (
                    <span key={feat} className="inline-flex items-center gap-1 rounded-lg bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
                      <Check className="h-3 w-3" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Price + CTA */}
              <div className="lg:text-right">
                <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-secondary/50 to-background p-6 sm:p-8 text-center lg:text-left transition-all duration-300 group-hover:shadow-soft-md">
                  <span className="text-xs text-muted-foreground">Starting at</span>
                  <p className="text-3xl font-bold text-foreground">{product.price}</p>
                  <p className="text-xs text-muted-foreground">One-time payment</p>

                  <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-500 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 group-hover:shadow-lg lg:w-auto lg:px-8">
                    View Details
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
