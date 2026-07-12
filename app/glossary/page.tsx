"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Sparkles,
  BookOpen,
  ChevronDown,
  ExternalLink,
  Mail,
  CheckCircle2,
  X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { glossary, alphabet, searchGlossary, getGlossaryByLetter, type GlossaryItem } from "@/data/glossary"

function GlossaryCard({ item, index }: { item: GlossaryItem; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      viewport={{ once: true, margin: "-20px" }}
      className="group"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full rounded-xl border border-border bg-white p-5 text-left transition-all duration-200 hover:shadow-soft-md hover:border-primary/20"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                {item.word[0]}
              </span>
              <div>
                <h3 className="text-base font-semibold text-foreground">{item.word}</h3>
                <p className="text-xs text-muted-foreground">{item.definition}</p>
              </div>
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
              <div className="mt-4 space-y-3 border-t border-border pt-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{item.explanation}</p>
                <div className="rounded-lg bg-secondary/50 px-4 py-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Example</p>
                  <p className="mt-1 text-sm text-foreground">&ldquo;{item.example}&rdquo;</p>
                </div>
                {item.relatedTopics.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Related</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {item.relatedTopics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-md bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  )
}

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const filtered = useMemo(() => {
    if (searchQuery) return searchGlossary(searchQuery)
    if (activeLetter) return getGlossaryByLetter(activeLetter)
    return glossary
  }, [searchQuery, activeLetter])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Glossary | LinkDit",
    description: "Understand every important AI term. Comprehensive glossary covering LLM, RAG, embeddings, tokens, fine-tuning, and hundreds more AI concepts.",
    url: "https://linkdit.online/glossary",
    provider: { "@type": "Organization", name: "LinkDit" },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-gradient-to-b from-white via-violet-50/20 to-white">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-white via-violet-50/30 to-white px-4 pt-24 pb-16 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_60%)] opacity-[0.02] pointer-events-none" />
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                  <BookOpen className="h-3.5 w-3.5" />
                  AI Glossary
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  AI Glossary
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Understand every important AI term. From LLMs to embeddings, we explain AI concepts in plain English.
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
                  onChange={(e) => { setSearchQuery(e.target.value); setActiveLetter(null) }}
                  placeholder="Search glossary..."
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

        {/* ─── Alphabet Filter ─── */}
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              onClick={() => { setActiveLetter(null); setSearchQuery("") }}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                !activeLetter && !searchQuery
                  ? "bg-primary text-primary-foreground shadow-soft-sm"
                  : "bg-white text-muted-foreground border border-border hover:bg-accent hover:text-foreground"
              }`}
            >
              All
            </button>
            {alphabet.map((letter) => {
              const hasEntries = getGlossaryByLetter(letter).length > 0
              return (
                <button
                  key={letter}
                  onClick={() => { setActiveLetter(letter); setSearchQuery("") }}
                  disabled={!hasEntries}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                    activeLetter === letter
                      ? "bg-primary text-primary-foreground shadow-soft-sm"
                      : hasEntries
                        ? "bg-white text-muted-foreground border border-border hover:bg-accent hover:text-foreground"
                        : "bg-secondary/50 text-muted-foreground/30 cursor-not-allowed"
                  }`}
                  aria-label={`Terms starting with ${letter}`}
                >
                  {letter}
                </button>
              )
            })}
          </div>
          {activeLetter && (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Showing terms starting with &ldquo;<span className="font-semibold text-foreground">{activeLetter}</span>&rdquo;
              <button
                onClick={() => setActiveLetter(null)}
                className="ml-2 text-primary hover:underline"
              >
                Show all
              </button>
            </p>
          )}
          {searchQuery && (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              {filtered.length} term{filtered.length !== 1 ? "s" : ""} found for &ldquo;<span className="font-semibold text-foreground">{searchQuery}</span>&rdquo;
            </p>
          )}
        </section>

        {/* ─── Glossary List ─── */}
        <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white px-6 py-20 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No terms found</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {searchQuery
                  ? `No glossary terms match "${searchQuery}". Try a different search term.`
                  : "No terms found for this letter."}
              </p>
              <button
                onClick={() => { setSearchQuery(""); setActiveLetter(null) }}
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                View all terms
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((item, i) => (
                <GlossaryCard key={item.word} item={item} index={i} />
              ))}
            </div>
          )}

          {!searchQuery && !activeLetter && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Showing all {glossary.length} terms. Use the alphabet filter above to narrow down.
            </div>
          )}
        </section>

        {/* ─── Newsletter CTA ─── */}
        <section className="border-t border-border/40 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Stay Informed with AI Terms</h2>
            <p className="mt-3 text-base text-muted-foreground">
              Get weekly AI explainers and new glossary terms delivered to your inbox.
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
          <div className="rounded-3xl bg-gradient-to-br from-violet-600 via-primary to-indigo-600 px-6 py-16 text-center text-white sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Master AI Terminology</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-white/80">
              Understanding AI terms is the first step to mastering AI tools. Bookmark this page for quick reference.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/tutorials" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
                <BookOpen className="h-4 w-4" />
                Explore Tutorials
              </Link>
              <Link href="/guides" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10">
                Read Guides
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

import Link from "next/link"
