"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Check, ArrowLeft, Sparkles } from "lucide-react"
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
  },
  {
    name: "Pro",
    price: 2.99,
    label: "300 Premium AI Trending Video Prompts",
    features: [
      "300 Premium AI Trending Video Prompts",
    ],
    popular: true,
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
  },
]

function getWhatsAppLink(pkg: typeof packages[number]) {
  const message = `Hello,

I want to purchase AI Creator Prompt Vault.

Package:
${pkg.name}

Price:
$${pkg.price.toFixed(2)}

Please send me the payment instructions.

Thank you.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const cardItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
}

export default function AiCreatorPromptVaultPage() {
  const [loadingPkg, setLoadingPkg] = useState<string | null>(null)

  function handleClick(pkg: typeof packages[number]) {
    setLoadingPkg(pkg.name)
    setTimeout(() => {
      setLoadingPkg(null)
      window.open(getWhatsAppLink(pkg), "_blank")
    }, 400)
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.04),transparent_60%)]" />
          <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-28 lg:pb-20">
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
                <span className="mb-4 block text-5xl">🎬</span>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  AI Creator Prompt Vault
                </h1>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Hand-curated collection of high-converting AI video prompts for
                  TikTok, Reels, and YouTube Shorts. Ready to use — just copy, paste, and create.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3 sm:gap-4 lg:gap-6"
          >
            {packages.map((pkg) => (
              <motion.div
                key={pkg.name}
                variants={cardItem}
                className={`relative flex flex-col rounded-2xl border bg-card transition-all duration-500 ${
                  pkg.popular
                    ? "border-primary/40 shadow-premium-lg ring-1 ring-primary/20 scale-[1.02] sm:scale-105"
                    : "border-border hover:border-border/80 hover:shadow-premium"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6 pt-8 sm:p-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {pkg.name}
                  </h3>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-foreground">
                      ${pkg.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">{pkg.label}</p>

                  <ul className="mt-6 space-y-3">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <button
                      onClick={() => handleClick(pkg)}
                      disabled={loadingPkg !== null}
                      className={`w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200 ${
                        pkg.popular
                          ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
                          : "border border-input bg-background text-foreground hover:bg-accent active:scale-[0.98]"
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      {loadingPkg === pkg.name ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Opening...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          🚀 Get Instant Access
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-10 text-center text-xs text-muted-foreground"
          >
            Instant digital delivery. No subscription required.
          </motion.p>
        </section>
      </main>
      <Footer />
    </>
  )
}
