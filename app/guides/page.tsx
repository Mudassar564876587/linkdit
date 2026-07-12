"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  BookOpen,
  Clock,
  ArrowUpRight,
  Sparkles,
  Compass,
  Layout,
  PenTool,
  GitBranch,
  Zap,
  FileText,
  Code,
  Megaphone,
  Search as SearchIcon,
  CheckCircle,
  Briefcase,
  UserCheck,
  ChevronRight,
  Mail,
  CheckCircle2,
} from "lucide-react"
import { motion } from "framer-motion"
import { guides, guideSections, getFeaturedGuides, searchGuides, type Guide } from "@/data/guides"
import ScrollReveal from "@/components/ui/scroll-reveal"

const sectionIcons: Record<string, typeof Compass> = {
  "Getting Started": Compass,
  "Prompt Engineering": PenTool,
  "AI Automation": Zap,
  "Content Creation": FileText,
  "AI Coding": Code,
  "Marketing": Megaphone,
  "SEO": SearchIcon,
  "Productivity": CheckCircle,
  "Business": Briefcase,
  "Freelancing": UserCheck,
}

function GuideCard({ guide, index }: { guide: Guide; index: number }) {
  const Icon = sectionIcons[guide.section] || BookOpen
  const slug = guide.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true, margin: "-30px" }}
      className="group"
    >
      <Link href={`/guides/${slug}`} className="block h-full">
        <div className="relative h-full rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
          {guide.featured && (
            <div className="absolute -top-2.5 right-4 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
              <Sparkles className="h-3 w-3" />
              Featured
            </div>
          )}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
            {guide.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {guide.description}
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 font-medium">
              {guide.section}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {guide.readingTime}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Read guide <ArrowUpRight className="h-3 w-3" />
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSection, setActiveSection] = useState("All")
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const featured = getFeaturedGuides()

  const filtered = useMemo(() => {
    let results = searchQuery ? searchGuides(searchQuery) : guides
    if (activeSection !== "All") results = results.filter((g) => g.section === activeSection)
    return results
  }, [searchQuery, activeSection])

  const groupedBySection = useMemo(() => {
    const grouped: Record<string, Guide[]> = {}
    filtered.forEach((g) => {
      if (!grouped[g.section]) grouped[g.section] = []
      grouped[g.section].push(g)
    })
    return grouped
  }, [filtered])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Ultimate AI Guides | LinkDit",
    description: "Comprehensive AI guides for creators, developers and businesses. Master prompt engineering, AI automation, content creation and more.",
    url: "https://linkdit.online/guides",
    provider: { "@type": "Organization", name: "LinkDit" },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50/20 to-white">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-white via-indigo-50/30 to-white px-4 pt-24 pb-16 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-primary)_0%,_transparent_60%)] opacity-[0.03] pointer-events-none" />
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Expert Guides
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Ultimate AI Guides
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Comprehensive guides for creators, developers and businesses. Master AI from fundamentals to advanced workflows.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link href="#featured" className="btn-primary px-6 py-3 text-sm">
                    <BookOpen className="h-4 w-4" />
                    Featured Guides
                  </Link>
                  <Link href="#browse" className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-sm font-medium text-foreground transition-all hover:shadow-soft-md">
                    Browse All
                  </Link>
                </div>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guides..."
                  className="h-13 w-full rounded-2xl border border-border bg-white/80 pl-12 pr-4 text-sm shadow-soft-sm backdrop-blur-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Featured ─── */}
        <ScrollReveal>
          <section id="featured" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">Featured Guides</h2>
              <p className="mt-1 text-sm text-muted-foreground">Our most popular and comprehensive guides</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((guide, i) => (
                <GuideCard key={guide.id} guide={guide} index={i} />
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ─── Browse All ─── */}
        <section id="browse" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">All Guides</h2>
            <p className="mt-1 text-sm text-muted-foreground">{filtered.length} guide{filtered.length !== 1 ? "s" : ""}</p>
          </div>

          {/* Section filter */}
          <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by section">
            <button
              onClick={() => setActiveSection("All")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeSection === "All"
                  ? "bg-primary text-primary-foreground shadow-soft-sm"
                  : "bg-white text-muted-foreground border border-border hover:bg-accent hover:text-foreground"
              }`}
            >
              All Sections
            </button>
            {guideSections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                  activeSection === section
                    ? "bg-primary text-primary-foreground shadow-soft-sm"
                    : "bg-white text-muted-foreground border border-border hover:bg-accent hover:text-foreground"
                }`}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white px-6 py-20 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No guides found</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {searchQuery ? `No guides match "${searchQuery}". Try a different search term.` : "No guides match the selected section."}
              </p>
              {(searchQuery || activeSection !== "All") && (
                <button
                  onClick={() => { setSearchQuery(""); setActiveSection("All") }}
                  className="mt-4 text-sm font-medium text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-10">
              {activeSection === "All"
                ? guideSections.map((section) => {
                    const items = groupedBySection[section]
                    if (!items?.length) return null
                    const Icon = sectionIcons[section] || BookOpen
                    return (
                      <div key={section}>
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">{section}</h3>
                          <span className="text-sm text-muted-foreground">({items.length})</span>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                          {items.map((guide, i) => (
                            <GuideCard key={guide.id} guide={guide} index={i} />
                          ))}
                        </div>
                      </div>
                    )
                  })
                : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((guide, i) => (
                      <GuideCard key={guide.id} guide={guide} index={i} />
                    ))}
                  </div>
                )}
            </div>
          )}
        </section>

        {/* ─── Newsletter CTA ─── */}
        <section className="border-t border-border/40 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Get Expert Guides Delivered</h2>
            <p className="mt-3 text-base text-muted-foreground">
              Join 10,000+ subscribers and receive our latest guides, tutorials, and AI insights every week.
            </p>
            {subscribed ? (
              <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                <p className="text-sm font-medium text-emerald-700">You&apos;re subscribed! Check your inbox.</p>
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
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-primary to-blue-600 px-6 py-16 text-center text-white sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Start Your AI Mastery Journey</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-white/80">
              Whether you&apos;re a beginner or an expert, our guides will help you level up your AI skills.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="#browse" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
                <BookOpen className="h-4 w-4" />
                Browse All Guides
              </Link>
              <Link href="/tutorials" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10">
                View Tutorials
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
