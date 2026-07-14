"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight, Sparkles, Star, Shield, Zap, Check, Clock, Gem,
  ShoppingBag, Layers, Award, MessageCircle, Film, Briefcase,
  Search, Video, Megaphone, Palette,
} from "lucide-react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

const WHATSAPP_NUMBER = "923197013743"

const products = [
  {
    id: "ai-creator-prompt-vault",
    name: "AI Creator Prompt Vault",
    tagline: "Premium AI video prompts for creators",
    description: "Hand-curated collection of 700+ high-converting AI video prompts for TikTok, Reels, and YouTube Shorts. Copy, paste, and create.",
    price: "From $1.49",
    gradient: "from-blue-600 via-indigo-500 to-violet-600",
    icon: "Film",
    badge: "Best Seller",
    features: ["700+ Premium Prompts", "10+ AI Categories", "Commercial License", "Lifetime Updates"],
  },
]

const comingSoon = [
  { name: "AI Business Vault", icon: "Briefcase", gradient: "from-blue-600 to-indigo-600", desc: "AI prompts for business automation" },
  { name: "AI SEO Vault", icon: "Search", gradient: "from-indigo-500 to-violet-600", desc: "SEO-optimized content prompts" },
  { name: "AI YouTube Vault", icon: "Video", gradient: "from-blue-500 to-indigo-600", desc: "YouTube script & thumbnail prompts" },
  { name: "AI Shopify Vault", icon: "ShoppingBag", gradient: "from-indigo-600 to-violet-700", desc: "E-commerce product prompts" },
  { name: "AI Marketing Vault", icon: "Megaphone", gradient: "from-blue-600 to-violet-600", desc: "Multi-channel marketing prompts" },
  { name: "AI Image Vault", icon: "Palette", gradient: "from-violet-500 to-indigo-600", desc: "Premium image generation prompts" },
]

const easeOut = [0.25, 0.1, 0.25, 1] as const

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Film, Briefcase, Search, Video, ShoppingBag, Megaphone, Palette,
}

function Blob({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{ scale: [1, 1.15, 1, 0.95, 1], rotate: [0, 25, 0, -15, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

function FloatingCircle({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full border ${className}`}
      animate={{ y: [-8, 8, -8] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    />
  )
}

export default function StorePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-36">
          <div className="pointer-events-none absolute inset-0 bg-noise" />
          <Blob className="-left-40 -top-40 h-80 w-80 bg-violet-500/10" />
          <Blob className="-right-40 top-1/3 h-64 w-64 bg-indigo-500/10" />
          <Blob className="-bottom-40 left-1/3 h-64 w-64 bg-violet-500/10" />
          <FloatingCircle className="left-[15%] top-24 h-2.5 w-2.5 border-primary/30 bg-primary/10" />
          <FloatingCircle className="right-[20%] top-32 h-2 w-2 border-indigo-500/30 bg-indigo-500/10" delay={1} />
          <FloatingCircle className="right-[25%] top-1/2 h-2 w-2 border-violet-500/30 bg-violet-500/10" delay={0.5} />
          <div className="pointer-events-none absolute inset-0 opacity-[0.012]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #2563eb 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-center">
              <div className="text-center lg:text-left">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-gradient-to-r from-primary/[0.08] to-indigo-50 px-4 py-1.5 text-xs font-semibold text-primary shadow-soft-sm">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Premium AI Resources
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl font-bold tracking-tight text-foreground xs:text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
                  The{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">Creator&apos;s Toolkit</span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="mt-5 text-base leading-relaxed text-muted-foreground/90 sm:text-lg max-w-xl mx-auto lg:mx-0">
                  Premium prompt packs and AI resources designed to supercharge your content creation workflow. One-time purchase, lifetime access.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-8 flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                  <Link
                    href="#products"
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-indigo-500 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97]"
                  >
                    <span className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                    <span className="relative flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Browse Products
                    </span>
                  </Link>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-xl border border-border/80 bg-white/80 px-7 py-3.5 text-sm font-medium text-foreground shadow-soft-sm backdrop-blur-sm transition-all duration-300 hover:shadow-soft-md hover:-translate-y-0.5 active:scale-[0.97]">
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground justify-center lg:justify-start">
                  {[
                    { icon: Gem, text: "Premium Quality" },
                    { icon: Shield, text: "Instant Delivery" },
                    { icon: Zap, text: "Lifetime Access" },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <span key={item.text} className="inline-flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-primary/70" />
                        {item.text}
                      </span>
                    )
                  })}
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: easeOut }} className="hidden lg:block relative">
                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-violet-500/15 blur-3xl" />
                <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/70 shadow-premium-lg backdrop-blur-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5" />
                  <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
                  <div className="relative p-7">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                        <Gem className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">Premium Digital Products</div>
                        <p className="text-xs text-muted-foreground">Curated for creators</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Ready-to-Use Prompts", value: "700+" },
                        { label: "AI Platforms Supported", value: "15+" },
                        { label: "License Type", value: "Commercial" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <span className="text-sm font-semibold text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/60 px-3.5 py-2.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="text-xs font-medium text-emerald-700">One-time payment. No subscriptions.</span>
                    </div>
                  </div>
                </div>
                <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-3 -right-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white border border-border px-3 py-1 text-[11px] font-semibold text-foreground shadow-soft-sm">
                    <Star className="h-3 w-3 text-violet-500 fill-violet-500" /> New
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ PRODUCTS ═══ */}
        <section id="products" className="border-t border-border/60 bg-gradient-to-b from-background via-secondary/20 to-background py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/[0.04] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary/80">
                Products
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Featured Product</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Our most popular prompt pack, trusted by thousands of creators worldwide.
              </p>
            </motion.div>

            <div className="mt-14">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ COMING SOON ═══ */}
        <section className="border-t border-border/60 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/[0.04] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary/80">
                Coming Soon
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">More Vaults on the Way</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                We're expanding our library with new prompt packs.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {comingSoon.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative overflow-hidden rounded-xl border border-border/60 bg-white/60 p-5 transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5"
                >
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                  <div className="relative">
                    {(() => { const Icon = iconMap[item.icon] || Film; return <Icon className="mb-2.5 block h-6 w-6 text-primary" />; })()}
                    <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/60">
                      <Clock className="h-3 w-3" />
                      Coming soon
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section className="relative overflow-hidden border-t border-border/60">
          <Blob className="-left-60 -top-60 h-[400px] w-[400px] bg-violet-500/10" />
          <Blob className="-right-60 -bottom-60 h-[400px] w-[400px] bg-violet-500/10" />
          <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-24 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: easeOut }}                     className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-8 py-14 shadow-2xl sm:px-14 sm:py-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Start Creating Better AI Content</h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-white/80">
                Join thousands of creators using LinkDit premium prompts. One payment, lifetime access.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/store/ai-creator-prompt-vault"
                  className="group relative overflow-hidden rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  <span className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-transparent via-violet-100 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                  <span className="relative flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    View Products
                  </span>
                </Link>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5 active:scale-[0.97]">
                  <MessageCircle className="h-4 w-4" />
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
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: easeOut }}
    >
      <Link href={`/store/${product.id}`} className="group relative block">
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-violet-500/10 opacity-0 blur-3xl transition-all duration-500 group-hover:opacity-100" />
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-premium transition-all duration-300 group-hover:shadow-card-hover group-hover:-translate-y-1">
          <div className={`h-1 w-full bg-gradient-to-r ${product.gradient}`} />
          <div className="absolute right-5 top-5 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-primary/20 px-2.5 py-0.5 text-[11px] font-semibold text-primary shadow-soft-sm">
              <Sparkles className="h-3 w-3 text-primary" />
              {product.badge}
            </span>
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 sm:gap-6 flex-wrap sm:flex-nowrap">
              <div className="min-w-0 flex-1">
                {(() => { const Icon = iconMap[product.icon] || Film; return <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10"><Icon className="h-6 w-6 text-primary" /></div>; })()}
                <h3 className="text-xl font-bold text-foreground sm:text-2xl group-hover:text-primary transition-colors duration-300">{product.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{product.tagline}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80 max-w-xl">{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {product.features.map((feat) => (
                    <span key={feat} className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary">
                      <Check className="h-3 w-3" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="shrink-0 w-full sm:w-auto">
                <div className="rounded-xl border border-border/40 bg-white p-5 text-center sm:text-left transition-all duration-300 group-hover:shadow-soft-sm">
                  <span className="text-xs text-muted-foreground">Starting at</span>
                  <p className="text-2xl font-bold text-foreground">{product.price}</p>
                  <p className="text-xs text-muted-foreground">One-time payment</p>
                    <span className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 group-hover:shadow-lg">
                    View Details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
