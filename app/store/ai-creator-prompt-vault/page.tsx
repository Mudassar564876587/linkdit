"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft, Sparkles, Check, ChevronDown, Star, Shield, Zap, Clock, Gift,
  Film, Copy, Cpu, PenTool, Sliders, Briefcase, ShoppingBag, Lock, Eye,
  Palette, ThumbsUp, Timer, RefreshCw, Award, Layers,
  Mail, CheckCircle2, MessageCircle, Quote, BookOpen, Hash,
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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
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

  useEffect(() => {
    if (isInView) motionValue.set(target)
  }, [])

  return <span ref={ref}>{display}</span>
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary"
    >
      {children}
    </motion.div>
  )
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
      <SectionLabel>{label}</SectionLabel>
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{title}</h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  )
}

const whatYouGet = [
  { icon: Film, title: "Premium AI Video Prompts", desc: "Expertly crafted prompts designed to generate stunning AI videos across multiple platforms like Runway, Pika, and Kling." },
  { icon: Copy, title: "Copy & Paste Ready", desc: "No editing required. Just copy any prompt, paste into your favorite AI tool, and watch the results come to life instantly." },
  { icon: Cpu, title: "Optimized for Multiple AI Models", desc: "Works flawlessly with ChatGPT, Claude, Gemini, Midjourney, DALL-E, Runway, Pika, Stable Diffusion, and more." },
  { icon: PenTool, title: "High Quality Prompt Engineering", desc: "Each prompt uses advanced engineering techniques including chain-of-thought, role-playing, and structured output formatting." },
  { icon: Sliders, title: "Easy to Customize", desc: "Every prompt includes placeholders and variables so you can tailor them to your specific needs, brand voice, and style." },
  { icon: Briefcase, title: "Professional Workflows", desc: "Designed for creators, marketers, and businesses who demand consistent, high-quality AI outputs every single time." },
  { icon: ShoppingBag, title: "Commercial Use Ready", desc: "All prompts are licensed for commercial use. Create content for clients, products, campaigns, and monetize freely." },
]

const whyChoose = [
  { icon: Palette, title: "Professional Design", desc: "Every prompt is meticulously designed by AI experts with years of experience in prompt engineering and content creation." },
  { icon: ThumbsUp, title: "Easy To Use", desc: "Zero learning curve. If you can copy and paste, you can start creating professional AI content in seconds." },
  { icon: Timer, title: "Time Saving", desc: "Stop spending hours crafting prompts. Get instant access to a curated library of proven, high-performing prompts." },
  { icon: Star, title: "High Quality Outputs", desc: "Our prompts are tested and optimized to produce consistent, professional-grade results across all major AI platforms." },
  { icon: RefreshCw, title: "Lifetime Updates", desc: "We continuously add new prompts and update existing ones. Pay once, get updates forever — no subscriptions." },
  { icon: Award, title: "Expert Crafted", desc: "Created by professional prompt engineers who have generated over 100,000+ AI outputs across dozens of tools." },
  { icon: Shield, title: "Commercial License", desc: "Full commercial rights included. Use prompts for client work, products, marketing, and any business application." },
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
  {
    q: "What is the AI Creator Prompt Vault?",
    a: "The AI Creator Prompt Vault is a premium collection of professionally crafted AI prompts designed for creators, marketers, entrepreneurs, and businesses. Each prompt is meticulously engineered to produce high-quality, consistent results across multiple AI platforms including ChatGPT, Claude, Gemini, Midjourney, Runway, Pika, and more.",
  },
  {
    q: "Which AI models are these prompts compatible with?",
    a: "Our prompts work with all major AI models including ChatGPT, GPT-4, Claude, Gemini, Midjourney, DALL-E 4, Stable Diffusion, Runway, Pika, Kling, and more. We design prompts to be model-agnostic while optimizing for the best results on each platform.",
  },
  {
    q: "Are the prompts ready to use immediately?",
    a: "Yes! Every prompt is copy-and-paste ready. Simply open your preferred AI tool, paste the prompt, and you're ready to go. No editing, tweaking, or technical knowledge required. We've done the hard work so you don't have to.",
  },
  {
    q: "Do I need technical skills to use these prompts?",
    a: "Not at all. Our prompts are designed for everyone — from complete beginners to advanced AI users. If you can copy and paste, you can use the AI Creator Prompt Vault effectively. We've included clear instructions and examples for every prompt.",
  },
  {
    q: "How do I access my purchase?",
    a: "After completing your purchase through WhatsApp, you'll receive your prompt files instantly via WhatsApp message. All prompts are delivered in a well-organized digital format that you can access on any device — phone, tablet, or computer.",
  },
  {
    q: "Is this a one-time purchase or a subscription?",
    a: "It's a one-time purchase with lifetime access. Pay once and use the prompts forever. There are no recurring fees, no subscription charges, and no hidden costs. You also get lifetime updates at no additional charge.",
  },
  {
    q: "What if I'm not satisfied with my purchase?",
    a: "Due to the digital nature of our products, all sales are final. However, if you encounter any issues with your purchase or the prompts don't meet your expectations, contact us on WhatsApp and we'll make it right. Your satisfaction is our top priority.",
  },
  {
    q: "What format are the prompts delivered in?",
    a: "Prompts are delivered in a well-organized text format that's compatible with any device or platform. You'll receive them as a formatted document that's easy to browse, search, and copy from. The structure is intuitive so you can find the right prompt in seconds.",
  },
  {
    q: "Are the prompts updated regularly?",
    a: "Yes! We continuously add new prompts and update existing ones to keep pace with the latest AI model improvements and platform changes. As a customer, you receive all updates for free — no additional purchases ever needed.",
  },
  {
    q: "Can I use these prompts for commercial projects?",
    a: "Absolutely! All prompts in the AI Creator Prompt Vault are licensed for commercial use. You can create content for clients, use them in your products, incorporate them into your business workflows, and monetize the output freely. No attribution required.",
  },
  {
    q: "How do I contact support if I have issues?",
    a: "We're here to help! You can reach us directly on WhatsApp for immediate support. Pro and Ultimate customers get priority response times. We typically respond within a few hours during business hours and are always happy to help.",
  },
]

const stats = [
  { icon: Hash, target: 700, prefix: "", suffix: "+", label: "Premium AI Prompts" },
  { icon: Layers, target: 10, prefix: "", suffix: "+", label: "AI Categories Covered" },
  { icon: RefreshCw, target: 99, prefix: "", suffix: "%", label: "Lifetime Updates" },
  { icon: Zap, target: 30, prefix: "", suffix: "s", label: "Instant Digital Delivery" },
]

const trustBadges = [
  { icon: Clock, title: "Lifetime Access", desc: "One payment, forever access" },
  { icon: Zap, title: "Instant Delivery", desc: "Via WhatsApp, immediately" },
  { icon: Shield, title: "Secure Purchase", desc: "Encrypted & protected" },
  { icon: ThumbsUp, title: "Beginner Friendly", desc: "No experience needed" },
  { icon: RefreshCw, title: "Regular Updates", desc: "Always up to date" },
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
        {/* ════════════════════════════════════════
            HERO
        ════════════════════════════════════════ */}
        <section className="relative min-h-[90vh] overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-36 flex items-center">
          {/* Noise */}
          <div className="pointer-events-none absolute inset-0 bg-noise" />

          {/* Animated blobs */}
          <Blob className="-left-40 -top-40 h-96 w-96 bg-violet-500/10" />
          <Blob className="-right-40 top-1/4 h-80 w-80 bg-fuchsia-500/10" />
          <Blob className="-bottom-40 left-1/4 h-72 w-72 bg-amber-500/10" />

          {/* Floating circles */}
          <FloatingCircle className="left-[12%] top-28 h-3 w-3 border-primary/30 bg-primary/10" />
          <FloatingCircle className="right-[15%] top-36 h-2 w-2 border-fuchsia-500/30 bg-fuchsia-500/10" delay={1} />
          <FloatingCircle className="left-[8%] bottom-48 h-4 w-4 border-amber-500/30 bg-amber-500/10" delay={2} />
          <FloatingCircle className="right-[20%] top-1/2 h-2.5 w-2.5 border-violet-500/30 bg-violet-500/10" delay={0.5} />

          {/* Subtle grid pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #2563eb 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-8"
            >
              <Link
                href="/store"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Back to Store
              </Link>
            </motion.div>

            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left: Text */}
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-1.5 text-xs font-semibold text-amber-700 shadow-soft-sm"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  🔥 Launch Special
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]"
                >
                  AI Creator{" "}
                  <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
                    Prompt Vault
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg max-w-xl mx-auto lg:mx-0"
                >
                  A premium collection of professionally crafted AI prompts designed for creators, marketers, entrepreneurs, and businesses to produce high-quality content faster than ever.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start"
                >
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'm interested in the AI Creator Prompt Vault. Can you tell me more?")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-500 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                    <span className="relative flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Get Instant Access
                    </span>
                  </a>

                  <a
                    href="#what-you-get"
                    className="group inline-flex items-center gap-2 rounded-2xl border border-border bg-white/80 px-8 py-4 text-sm font-medium text-foreground shadow-soft-sm backdrop-blur-sm transition-all duration-300 hover:shadow-soft-md hover:-translate-y-0.5"
                  >
                    View What&apos;s Included
                    <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                  </a>
                </motion.div>

                {/* Trust badges in hero */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-10 flex flex-wrap items-center gap-5 text-xs text-muted-foreground justify-center lg:justify-start"
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

              {/* Right: Glass card / visual */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="hidden lg:block relative"
              >
                <div className="relative">
                  {/* Glow behind */}
                  <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-amber-500/20 blur-3xl" />

                  {/* Main glass card */}
                  <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-premium-lg backdrop-blur-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-amber-500/5" />
                    <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500" />

                    <div className="relative p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                          <Sparkles className="h-4 w-4 text-amber-600" />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Premium Preview</span>
                      </div>

                      <div className="space-y-4">
                        {[
                          { label: "Total Prompts", value: "700+" },
                          { label: "AI Categories", value: "10+" },
                          { label: "Formats", value: "Copy & Paste" },
                          { label: "License", value: "Commercial Use" },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                            <span className="text-sm font-semibold text-foreground">{item.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 px-4 py-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="text-xs font-medium text-emerald-700">One-time payment • Lifetime access</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating badge */}
                  <motion.div
                    animate={{ y: [-6, 6, -6] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-3 -right-3"
                  >
                    <span className="inline-flex items-center gap-1 rounded-full bg-white border border-border px-3 py-1 text-[11px] font-semibold text-foreground shadow-soft-sm">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      Best Seller
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
            WHAT YOU GET
        ════════════════════════════════════════ */}
        <section id="what-you-get" className="border-t border-border/40 bg-gradient-to-b from-background via-secondary/20 to-background py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="What You Get"
              title="Everything You Need to Create"
              description="Seven categories of premium AI prompts designed to supercharge your content creation workflow."
            />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {whatYouGet.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-violet-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary mb-4 transition-transform group-hover:scale-110 group-hover:rotate-[-3deg] duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            PROMPT PREVIEW
        ════════════════════════════════════════ */}
        <section className="border-t border-border/40 py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-noise" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Prompt Preview"
              title="See What's Inside"
              description="Get a sneak peek at the premium prompts waiting for you. Unlock the full collection with a single purchase."
            />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            >
              {promptPreviews.map((prompt, i) => (
                <motion.div
                  key={prompt.title}
                  variants={fadeUp}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
                >
                  {/* Category badge */}
                  <div className="px-5 pt-5 pb-3">
                    <span className="inline-flex items-center rounded-lg bg-primary/5 px-2.5 py-1 text-[10px] font-medium text-primary">
                      {prompt.category}
                    </span>
                  </div>

                  {/* Prompt text with blur */}
                  <div className="px-5 pb-5">
                    <h4 className="text-xs font-semibold text-foreground mb-2">{prompt.title}</h4>
                    <div className="relative">
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        {prompt.text.slice(0, prompt.blurStart)}
                        <span className="text-transparent bg-gradient-to-r from-muted-foreground/40 via-muted-foreground/20 to-muted-foreground/40 bg-clip-text blur-sm select-none">
                          {prompt.text.slice(prompt.blurStart)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Lock overlay */}
                  <div className="relative flex items-center justify-center border-t border-border/50 bg-gradient-to-b from-background/80 to-background px-5 py-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Preview Locked
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Unlock CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 text-center"
            >
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I want to unlock the full AI Creator Prompt Vault collection.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-500 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                <Eye className="h-4 w-4" />
                Unlock Full Collection
                <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            WHY CHOOSE LINKDIT
        ════════════════════════════════════════ */}
        <section className="border-t border-border/40 bg-gradient-to-b from-background via-violet-50/20 to-background py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Why LinkDit"
              title="Built for Creators, by Creators"
              description="Thousands of creators trust LinkDit for premium AI resources. Here's why."
            />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {whyChoose.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
                  >
                    <div className="absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-primary/[0.03] to-violet-500/[0.03] transition-all duration-500 group-hover:scale-[3]" />
                    <div className="relative flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary transition-transform group-hover:scale-110 group-hover:rotate-[-3deg] duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            PRICING
        ════════════════════════════════════════ */}
        <section className="relative border-t border-border/40 py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-noise" />
          <Blob className="-left-60 top-1/3 h-96 w-96 bg-violet-500/8" />
          <Blob className="-right-60 bottom-1/3 h-80 w-80 bg-amber-500/8" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="Pricing"
              title="Choose Your Plan"
              description="One-time purchase. Lifetime access. No subscription required. Pick the package that fits your needs."
            />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-3 lg:gap-8"
            >
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

        {/* ════════════════════════════════════════
            FAQ
        ════════════════════════════════════════ */}
        <section className="border-t border-border/40 bg-gradient-to-b from-background via-secondary/20 to-background py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              label="FAQ"
              title="Frequently Asked Questions"
              description="Everything you need to know about the AI Creator Prompt Vault."
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-12 space-y-3"
            >
              {faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
              ))}
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
                Ready to Create Better AI Content?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                Get instant access to the AI Creator Prompt Vault and start producing professional AI content today. One payment, lifetime access.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I want to purchase the AI Creator Prompt Vault. Please send me payment details.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl bg-white px-10 py-4 text-sm font-semibold text-violet-600 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-transparent via-violet-100 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                  <span className="relative flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Get Instant Access
                  </span>
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-10 py-4 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat with Us
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            FOOTER CTA - WhatsApp
        ════════════════════════════════════════ */}
        <section className="border-t border-border/40 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6"
            >
              <span className="text-sm text-muted-foreground">Need help choosing a package?</span>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
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
  pkg,
  isPopular,
  isLoading,
  onSelect,
  PkgIcon,
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
      className={`group relative flex flex-col rounded-3xl border bg-white/80 backdrop-blur-sm transition-all duration-500 ${
        isPopular
          ? "border-violet-200/60 shadow-premium-lg scale-[1.02] lg:scale-105 z-10"
          : "border-border hover:border-border/80 hover:shadow-premium-lg"
      }`}
      style={{ transformOrigin: "center center" }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 blur-2xl transition-opacity duration-500"
        style={{
          background: isPopular
            ? "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15), transparent)"
            : "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.06), transparent)",
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      {/* Premium gradient border top */}
      <div className={`absolute top-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r ${pkg.gradient} transition-all duration-500 ${isHovered ? "opacity-100 scale-x-100" : "opacity-60 scale-x-90"}`} />

      {/* Recommended badge */}
      {isPopular && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20"
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-1.5 text-[11px] font-semibold text-white shadow-lg">
            <Star className="h-3 w-3 fill-white" />
            Recommended
          </span>
        </motion.div>
      )}

      <div className="relative flex flex-1 flex-col p-6 pt-8 sm:p-8 z-10">
        {/* Icon + Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${pkg.gradient} text-white shadow-md`}>
            <PkgIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              {pkg.name}
            </h3>
            <p className="text-xs text-muted-foreground">{pkg.label}</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tracking-tight text-foreground">${pkg.price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">USD</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">One-time payment</p>

        {/* Price glow */}
        <motion.div
          className="absolute top-28 left-8 h-16 w-28 rounded-full blur-3xl"
          style={{ background: isPopular ? "rgba(139, 92, 246, 0.12)" : "rgba(37, 99, 235, 0.06)" }}
          animate={{ opacity: isHovered ? 0.8 : 0, scale: isHovered ? 1.2 : 0.8 }}
          transition={{ duration: 0.4 }}
        />

        {/* Features */}
        <ul className="mt-6 space-y-3 flex-1">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100">
                <Check className="h-3 w-3 text-emerald-600" />
              </span>
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="mt-8">
          <button
            onClick={onSelect}
            disabled={isLoading}
            className={`relative w-full overflow-hidden rounded-2xl py-3.5 text-sm font-semibold transition-all duration-300 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed ${
              isPopular
                ? "bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                : "border border-input bg-background text-foreground hover:bg-accent hover:shadow-soft-md hover:-translate-y-0.5"
            }`}
          >
            {/* Shine effect on popular */}
            {isPopular && !isLoading && (
              <span className="absolute inset-0 overflow-hidden">
                <span className="absolute inset-0 -translate-x-full animate-shine bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </span>
            )}

            {isLoading ? (
              <span className="relative inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Opening WhatsApp...
              </span>
            ) : (
              <span className="relative inline-flex items-center gap-2">
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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full rounded-2xl border border-border bg-white p-5 text-left transition-all duration-200 hover:shadow-soft-md hover:border-primary/20"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-violet-500/10 text-xs font-bold text-primary">
              ?
            </span>
            <h3 className="text-sm font-semibold text-foreground">{question}</h3>
          </div>
          <ChevronDown
            className={`mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-border/60 pt-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  )
}
