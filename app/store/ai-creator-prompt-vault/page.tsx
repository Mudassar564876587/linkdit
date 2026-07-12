"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft, Sparkles, Check, ChevronDown, Star, Shield, Zap, Clock,
  Film, Copy, Cpu, PenTool, Sliders, Briefcase, ShoppingBag, Lock, Eye,
  Layers, Award, MessageCircle,
} from "lucide-react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

const WHATSAPP_NUMBER = "923197013743"

const packages = [
  {
    name: "Starter",
    price: 1.49,
    label: "Essential AI Prompts",
    features: [
      "100 Premium AI Trending Video Prompts",
      "Basic Prompt Templates",
      "Single Device Access",
      "Email Support",
    ],
    popular: false,
    gradient: "from-slate-500 to-gray-500",
    icon: Layers,
  },
  {
    name: "Pro",
    price: 2.99,
    label: "Complete Creator Kit",
    features: [
      "300 Premium AI Trending Video Prompts",
      "Advanced Prompt Engineering Templates",
      "Multi-Platform Optimized Prompts",
      "Priority WhatsApp Support",
      "Lifetime Updates",
    ],
    popular: true,
    gradient: "from-violet-500 via-fuchsia-500 to-amber-500",
    icon: Zap,
  },
  {
    name: "Ultimate",
    price: 5.99,
    label: "Professional Bundle",
    features: [
      "700 Premium AI Trending Video Prompts",
      "Advanced Prompt Engineering Templates",
      "Multi-Platform Optimized Prompts",
      "Priority WhatsApp Support",
      "Lifetime Updates",
      "FREE Premium Prompt Engineering eBook",
      "Early Access to New Prompt Packs",
    ],
    popular: false,
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    icon: Award,
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

const easeOut = [0.25, 0.1, 0.25, 1] as const

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
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

const whatYouGet = [
  { icon: Film, title: "Premium AI Video Prompts", desc: "Expertly crafted prompts for Runway, Pika, Kling, and more." },
  { icon: Copy, title: "Copy & Paste Ready", desc: "No editing required. Just copy, paste, and create." },
  { icon: Cpu, title: "Multi-Model Optimized", desc: "Works with ChatGPT, Claude, Gemini, Midjourney, DALL-E, and more." },
  { icon: PenTool, title: "Expert Prompt Engineering", desc: "Chain-of-thought, role-playing, and structured outputs." },
  { icon: Sliders, title: "Easy to Customize", desc: "Variables and placeholders for your brand voice." },
  { icon: Briefcase, title: "Professional Workflows", desc: "Designed for creators, marketers, and businesses." },
  { icon: ShoppingBag, title: "Commercial Use Ready", desc: "Full commercial rights. Monetize freely." },
]

const promptPreviews = [
  {
    title: "Viral TikTok Hook Generator",
    category: "Short Form Video",
    text: "Create an attention-grabbing TikTok hook that stops scrollers in their tracks. Use the pattern of [CONTROVERSIAL STATEMENT] followed by [UNEXPECTED TWIST]. The hook should be under 3 seconds and immediately create curiosity...",
    blurStart: 120,
  },
  {
    title: "Cinematic Storyboard Creator",
    category: "Long Form Video",
    text: "Generate a cinematic video sequence with dramatic lighting and shallow depth of field. The scene should feature [MAIN SUBJECT] in [ENVIRONMENT] with [LIGHTING CONDITION]. Use a [CAMERA ANGLE] shot to emphasize...",
    blurStart: 110,
  },
  {
    title: "AI Avatar Script Writer",
    category: "AI Avatars",
    text: "Write a professional script for an AI avatar video. The tone should be [TONE: Professional/Casual/Enthusiastic]. The script should include a hook, main value proposition, and a clear call to action...",
    blurStart: 100,
  },
  {
    title: "Product Demo Video Prompt",
    category: "Marketing",
    text: "Create a compelling product demonstration video that highlights the key features of [PRODUCT NAME]. Use split-screen comparisons, zoom-in effects on [KEY FEATURE], and end with a strong...",
    blurStart: 95,
  },
  {
    title: "Educational Explainers",
    category: "Education",
    text: "Design an educational explainer video that breaks down [COMPLEX TOPIC] into simple, digestible visuals. Use animated diagrams, progressive disclosure, and real-world analogies to make...",
    blurStart: 85,
  },
]

const faqs = [
  { q: "What is the AI Creator Prompt Vault?", a: "A premium collection of professionally crafted AI prompts for creators, marketers, and businesses. Each prompt is engineered to produce high-quality, consistent results across ChatGPT, Claude, Gemini, Midjourney, Runway, Pika, and more." },
  { q: "Which AI models are these prompts compatible with?", a: "All major AI models including ChatGPT, GPT-4, Claude, Gemini, Midjourney, DALL-E 4, Stable Diffusion, Runway, Pika, and Kling. Prompts are model-agnostic but optimized per platform." },
  { q: "Are the prompts ready to use immediately?", a: "Yes. Every prompt is copy-and-paste ready. Open your AI tool, paste the prompt, and you're creating in seconds. No editing or technical knowledge required." },
  { q: "How do I access my purchase?", a: "After purchase via WhatsApp, you'll receive your prompt files instantly in a well-organized digital format accessible on any device." },
  { q: "Is this a one-time purchase?", a: "Yes. Pay once, use forever. No subscriptions, no recurring fees, no hidden costs. Includes lifetime updates at no additional charge." },
  { q: "What if I'm not satisfied?", a: "Contact us on WhatsApp and we'll make it right. Your satisfaction is our top priority." },
  { q: "Can I use these prompts for commercial projects?", a: "Absolutely. All prompts include full commercial rights. Use them for client work, products, marketing, and monetization. No attribution required." },
]

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
        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden pb-16 pt-24 sm:pb-20 sm:pt-32">
          <div className="pointer-events-none absolute inset-0 bg-noise" />
          <Blob className="-left-40 -top-40 h-80 w-80 bg-violet-500/10" />
          <Blob className="-right-40 top-1/4 h-64 w-64 bg-fuchsia-500/10" />
          <Blob className="-bottom-40 left-1/4 h-64 w-64 bg-amber-500/10" />
          <FloatingCircle className="left-[12%] top-24 h-2.5 w-2.5 border-primary/30 bg-primary/10" />
          <FloatingCircle className="right-[15%] top-32 h-2 w-2 border-fuchsia-500/30 bg-fuchsia-500/10" delay={1} />
          <FloatingCircle className="right-[20%] top-1/2 h-2 w-2 border-violet-500/30 bg-violet-500/10" delay={0.5} />

          <div className="pointer-events-none absolute inset-0 opacity-[0.012]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #2563eb 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
              <Link href="/store" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground group">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Back to Store
              </Link>
            </motion.div>

            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="text-center lg:text-left">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }} className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-1.5 text-xs font-semibold text-amber-700 shadow-soft-sm">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  🔥 Launch Special
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
                  AI Creator{" "}
                  <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">Prompt Vault</span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg max-w-xl mx-auto lg:mx-0">
                  A premium collection of professionally crafted AI prompts designed for creators, marketers, and businesses to produce high-quality content faster.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="mt-7 flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'm interested in the AI Creator Prompt Vault.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                    <span className="relative flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Get Instant Access
                    </span>
                  </a>

                  <a href="#pricing" className="group inline-flex items-center gap-2 rounded-xl border border-border bg-white/80 px-7 py-3.5 text-sm font-medium text-foreground shadow-soft-sm backdrop-blur-sm transition-all duration-300 hover:shadow-soft-md hover:-translate-y-0.5">
                    View Pricing
                    <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                  </a>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.35 }} className="mt-8 flex flex-wrap items-center gap-4 text-xs text-muted-foreground justify-center lg:justify-start">
                  {[
                    { icon: Star, text: "Trending Prompts" },
                    { icon: Shield, text: "Instant Delivery" },
                    { icon: Zap, text: "Copy & Paste" },
                    { icon: Clock, text: "Lifetime Access" },
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

              <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: easeOut }} className="hidden lg:block relative">
                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-amber-500/15 blur-3xl" />
                <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-premium-lg backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-amber-500/5" />
                  <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500" />
                  <div className="relative p-7">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
                        <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Premium Preview</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Total Prompts", value: "700+" },
                        { label: "AI Categories", value: "10+" },
                        { label: "License", value: "Commercial Use" },
                        { label: "Delivery", value: "Instant" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <span className="text-sm font-semibold text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 px-3.5 py-2.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="text-xs font-medium text-emerald-700">One-time payment &bull; Lifetime access</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ PRICING ═══ */}
        <section id="pricing" className="border-t border-border bg-gradient-to-b from-background via-secondary/20 to-background py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                Pricing
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Choose Your Plan</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                One-time purchase. Lifetime access. No subscription required.
              </p>
            </motion.div>

            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-3 lg:gap-6">
              {packages.map((pkg) => {
                const isPopular = pkg.popular
                const isLoading = loadingPkg === pkg.name
                const PkgIcon = pkg.icon

                return (
                  <PricingCard
                    key={pkg.name}
                    pkg={pkg}
                    isPopular={isPopular}
                    isLoading={isLoading}
                    onSelect={() => handleClick(pkg)}
                    PkgIcon={PkgIcon}
                  />
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══ WHAT'S INCLUDED ═══ */}
        <section className="border-t border-border py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                What's Included
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Everything You Need to Create</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Seven categories of premium AI prompts designed to supercharge your workflow.
              </p>
            </motion.div>

            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {whatYouGet.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div key={item.title} variants={fadeUp} className="group rounded-xl border border-border bg-white p-5 transition-all duration-300 hover:shadow-soft-md hover:-translate-y-0.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary mb-3 transition-transform group-hover:scale-110 group-hover:rotate-[-3deg] duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══ PROMPT PREVIEW ═══ */}
        <section className="border-t border-border bg-gradient-to-b from-background via-secondary/20 to-background py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                Preview
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">See What's Inside</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Get a sneak peek at the premium prompts waiting for you.
              </p>
            </motion.div>

            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {promptPreviews.map((prompt, i) => (
                <motion.div key={prompt.title} variants={fadeUp} className="group rounded-xl border border-border bg-white overflow-hidden transition-all duration-300 hover:shadow-soft-md hover:-translate-y-0.5">
                  <div className="px-4 pt-4 pb-2">
                    <span className="inline-flex items-center rounded-lg bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary">{prompt.category}</span>
                  </div>
                  <div className="px-4 pb-4">
                    <h4 className="text-xs font-semibold text-foreground mb-1.5">{prompt.title}</h4>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      {prompt.text.slice(0, prompt.blurStart)}
                      <span className="text-transparent bg-gradient-to-r from-muted-foreground/40 via-muted-foreground/20 to-muted-foreground/40 bg-clip-text blur-sm select-none">
                        {prompt.text.slice(prompt.blurStart)}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 border-t border-border/50 bg-gradient-to-b from-background/80 to-background px-4 py-2.5 text-[11px] font-medium text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Preview Locked
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }} className="mt-8 text-center">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I want to unlock the full AI Creator Prompt Vault.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                <Eye className="h-4 w-4" />
                Unlock Full Collection
              </a>
            </motion.div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="border-t border-border py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                FAQ
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Frequently Asked Questions</h2>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-10 space-y-2">
              {faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section className="relative overflow-hidden border-t border-border">
          <Blob className="-left-60 -top-60 h-[400px] w-[400px] bg-violet-500/10" />
          <Blob className="-right-60 -bottom-60 h-[400px] w-[400px] bg-amber-500/10" />
          <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-24 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: easeOut }} className="rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-500 px-8 py-14 shadow-2xl sm:px-14 sm:py-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to Create Better AI Content?</h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-white/80">
                Get instant access to the AI Creator Prompt Vault. One payment, lifetime access.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I want to purchase the AI Creator Prompt Vault.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-violet-600 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-transparent via-violet-100 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                  <span className="relative flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Get Instant Access
                  </span>
                </a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5">
                  <MessageCircle className="h-4 w-4" />
                  Chat with Us
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ FOOTER CTA ═══ */}
        <section className="border-t border-border/60 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }} className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-5">
              <span className="text-sm text-muted-foreground">Need help choosing a package?</span>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                <MessageCircle className="h-4 w-4" />
                Chat with us on WhatsApp
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

/* ─── PRICING CARD ─── */
function PricingCard({
  pkg, isPopular, isLoading, onSelect, PkgIcon,
}: {
  pkg: typeof packages[number]
  isPopular: boolean
  isLoading: boolean
  onSelect: () => void
  PkgIcon: typeof Zap
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
      className={`group relative flex flex-col rounded-2xl border bg-white/80 backdrop-blur-sm transition-all duration-500 ${
        isPopular
          ? "border-violet-200/60 shadow-premium-lg scale-[1.02] lg:scale-105 z-10"
          : "border-border hover:border-border/80 hover:shadow-premium-lg"
      }`}
    >
      <motion.div className="absolute inset-0 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500" style={{ background: isPopular ? "radial-gradient(ellipse at center, rgba(139,92,246,0.15), transparent)" : "radial-gradient(ellipse at center, rgba(37,99,235,0.06), transparent)" }} animate={{ opacity: isHovered ? 1 : 0 }} />

      <div className={`absolute top-0 left-5 right-5 h-0.5 rounded-full bg-gradient-to-r ${pkg.gradient} transition-all duration-500 ${isHovered ? "opacity-100 scale-x-100" : "opacity-60 scale-x-90"}`} />

      {isPopular && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3.5 py-1 text-[11px] font-semibold text-white shadow-lg">
            <Star className="h-3 w-3 fill-white" /> Recommended
          </span>
        </motion.div>
      )}

      <div className="relative flex flex-1 flex-col p-6 pt-7 sm:p-7 z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${pkg.gradient} text-white shadow-sm`}>
            <PkgIcon className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{pkg.name}</h3>
            <p className="text-xs text-muted-foreground/70">{pkg.label}</p>
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-foreground">${pkg.price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">USD</span>
        </div>
        <p className="text-xs text-muted-foreground/60">One-time payment</p>

        <motion.div className="absolute top-24 left-7 h-12 w-20 rounded-full blur-3xl" style={{ background: isPopular ? "rgba(139,92,246,0.12)" : "rgba(37,99,235,0.06)" }} animate={{ opacity: isHovered ? 0.8 : 0, scale: isHovered ? 1.2 : 0.8 }} transition={{ duration: 0.4 }} />

        <ul className="mt-5 space-y-2.5 flex-1">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100">
                <Check className="h-2.5 w-2.5 text-emerald-600" />
              </span>
              <span className="text-foreground text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <button
            onClick={onSelect}
            disabled={isLoading}
            className={`relative w-full overflow-hidden rounded-xl py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed ${
              isPopular
                ? "bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                : "border border-input bg-background text-foreground hover:bg-accent hover:shadow-soft-md hover:-translate-y-0.5"
            }`}
          >
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
                <Sparkles className="h-4 w-4" />
                Get Instant Access
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── FAQ ITEM ─── */
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20px" }} transition={{ duration: 0.3, delay: index * 0.03 }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full rounded-xl border border-border bg-white p-4 text-left transition-all duration-200 hover:shadow-soft-sm hover:border-primary/20"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-violet-500/10 text-xs font-bold text-primary">?</span>
            <h3 className="text-sm font-medium text-foreground">{question}</h3>
          </div>
          <ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: easeOut }} className="overflow-hidden">
              <div className="mt-3 border-t border-border/60 pt-3">
                <p className="text-sm leading-relaxed text-muted-foreground">{answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  )
}
