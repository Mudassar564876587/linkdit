"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  Sparkles,
  ChevronDown,
  Mail,
  CheckCircle2,
  HelpCircle,
  X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { faqs, faqCategories, searchFAQs, getFAQsByCategory, type FAQItem } from "@/data/faq"

const categoryIcons: Record<string, string> = {
  General: "💡",
  Accounts: "👤",
  "AI Tools": "🤖",
  Pricing: "💰",
  Store: "🛍️",
  Privacy: "🔒",
  Security: "🛡️",
  Submissions: "📝",
  SEO: "🔍",
  Affiliate: "🤝",
  Ads: "📢",
}

function FAQCard({ item, index }: { item: FAQItem; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      viewport={{ once: true, margin: "-20px" }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full rounded-xl border border-border bg-white p-5 text-left transition-all duration-200 hover:shadow-soft-md hover:border-primary/20"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-sm">
              {categoryIcons[item.category] || "❓"}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{item.question}</h3>
              {!expanded && (
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                  {item.category}
                </p>
              )}
            </div>
          </div>
          <ChevronDown
            className={`mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
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
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary">
                    {item.category}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  )
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const filtered = useMemo(() => {
    if (searchQuery) return searchFAQs(searchQuery)
    if (activeCategory !== "All") return getFAQsByCategory(activeCategory)
    return faqs
  }, [searchQuery, activeCategory])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: "FAQ | LinkDit",
    description: "Frequently asked questions about LinkDit — accounts, AI tools, pricing, store, privacy, security, submissions, SEO, affiliate program, and advertising.",
    url: "https://linkdit.online/faq",
    provider: { "@type": "Organization", name: "LinkDit" },
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-gradient-to-b from-white via-cyan-50/20 to-white">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-white via-cyan-50/30 to-white px-4 pt-24 pb-16 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_60%)] opacity-[0.02] pointer-events-none" />
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                  <HelpCircle className="h-3.5 w-3.5" />
                  FAQ
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Frequently Asked Questions
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Everything you need to know about LinkDit. Can&apos;t find what you&apos;re looking for? Contact our support team.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-10 max-w-xl"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setActiveCategory("All") }}
                  placeholder="Search FAQs..."
                  className="h-13 w-full rounded-2xl border border-border bg-white/80 pl-12 pr-10 text-sm shadow-soft-sm backdrop-blur-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Category Tabs ─── */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <button
              onClick={() => { setActiveCategory("All"); setSearchQuery("") }}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                activeCategory === "All" && !searchQuery
                  ? "bg-primary text-primary-foreground shadow-soft-sm"
                  : "bg-white text-muted-foreground border border-border hover:bg-accent hover:text-foreground"
              }`}
            >
              All Questions
            </button>
            {faqCategories.map((cat) => {
              const count = getFAQsByCategory(cat).length
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setSearchQuery("") }}
                  className={`rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                    activeCategory === cat && !searchQuery
                      ? "bg-primary text-primary-foreground shadow-soft-sm"
                      : "bg-white text-muted-foreground border border-border hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {categoryIcons[cat]} {cat} ({count})
                </button>
              )
            })}
          </div>

          {activeCategory !== "All" && !searchQuery && (
            <p className="mt-3 text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{faqCategories.find((c) => c === activeCategory)}</span> FAQs
              <button onClick={() => setActiveCategory("All")} className="ml-2 text-primary hover:underline">
                Show all
              </button>
            </p>
          )}
          {searchQuery && (
            <p className="mt-3 text-sm text-muted-foreground">
              {filtered.length} FAQ{filtered.length !== 1 ? "s" : ""} found for &ldquo;<span className="font-semibold text-foreground">{searchQuery}</span>&rdquo;
            </p>
          )}
        </section>

        {/* ─── FAQ List ─── */}
        <section aria-labelledby="faq-heading" className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
          <h2 id="faq-heading" className="sr-only">Common Questions</h2>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white px-6 py-20 text-center">
              <HelpCircle className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No FAQs found</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {searchQuery
                  ? `No FAQs match "${searchQuery}". Try a different search term.`
                  : "No FAQs in this category yet."}
              </p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("All") }}
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                View all FAQs
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((item, i) => (
                <FAQCard key={item.id} item={item} index={i} />
              ))}
            </div>
          )}

          {!searchQuery && activeCategory === "All" && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Showing all {faqs.length} FAQs. Use the category tabs above to narrow down.
            </div>
          )}
        </section>

        {/* ─── Newsletter CTA ─── */}
        <section className="border-t border-border/40 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Still Have Questions?</h2>
            <p className="mt-3 text-base text-muted-foreground">
              Subscribe to our newsletter and get answers to common AI questions delivered weekly.
            </p>
            {subscribed ? (
              <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                <p className="text-sm font-medium text-emerald-700">You&apos;re subscribed!</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true) }} className="mx-auto mt-6 flex max-w-md gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="h-12 flex-1 rounded-xl border border-border bg-white px-4 text-sm shadow-soft-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button type="submit" className="btn-primary shrink-0 px-6 text-sm">Subscribe</button>
              </form>
            )}
            <p className="mt-3 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
          </div>
        </section>

        {/* ─── Bottom CTA ─── */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-cyan-600 via-primary to-blue-600 px-6 py-16 text-center text-white sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Can&apos;t Find Your Answer?</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-white/80">
              Our support team is ready to help. Reach out and we&apos;ll get back to you within 24 hours.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
                Contact Support
              </Link>
              <Link href="/tutorials" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10">
                Browse Tutorials
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
