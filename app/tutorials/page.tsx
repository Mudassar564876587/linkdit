"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  BookOpen,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  GraduationCap,
  BarChart3,
  Rocket,
  ChevronDown,
  Mail,
  CheckCircle2,
  LayoutGrid,
  List,
} from "lucide-react"
import { motion } from "framer-motion"
import { tutorials, tutorialCategories, getFeaturedTutorials, searchTutorials, type Tutorial, type Difficulty } from "@/data/tutorials"
import ScrollReveal from "@/components/ui/scroll-reveal"

const difficultyConfig = {
  Beginner: { icon: GraduationCap, gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", text: "text-emerald-700" },
  Intermediate: { icon: BarChart3, gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50", text: "text-blue-700" },
  Advanced: { icon: Rocket, gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50", text: "text-violet-700" },
}

const difficultyOrder: Record<Difficulty, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 }

function TutorialCard({ tutorial, index }: { tutorial: Tutorial; index: number }) {
  const diff = difficultyConfig[tutorial.difficulty]
  const DiffIcon = diff.icon
  const slug = tutorial.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      viewport={{ once: true, margin: "-30px" }}
      className="group relative"
    >
      <Link href={`/tutorials/${slug}`} className="block h-full">
        <div className="relative h-full rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
          {tutorial.featured && (
            <div className="absolute -top-2.5 right-4 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
              <Sparkles className="h-3 w-3" />
              Featured
            </div>
          )}
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {tutorial.category}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-lg ${diff.bg} px-2.5 py-1 text-[11px] font-medium ${diff.text}`}>
              <DiffIcon className="h-3 w-3" />
              {tutorial.difficulty}
            </span>
          </div>
          <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
            {tutorial.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {tutorial.description}
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {tutorial.readingTime}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Updated {tutorial.updatedAt}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Start tutorial <ArrowUpRight className="h-3 w-3" />
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default function TutorialsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | "All">("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const featured = getFeaturedTutorials()

  const filtered = useMemo(() => {
    let results = searchQuery ? searchTutorials(searchQuery) : tutorials
    if (activeCategory !== "All") results = results.filter((t) => t.category === activeCategory)
    if (activeDifficulty !== "All") results = results.filter((t) => t.difficulty === activeDifficulty)
    return results
  }, [searchQuery, activeCategory, activeDifficulty])

  const groupedByDifficulty = useMemo(() => {
    const grouped: Record<string, Tutorial[]> = { Beginner: [], Intermediate: [], Advanced: [] }
    filtered.forEach((t) => grouped[t.difficulty].push(t))
    return grouped
  }, [filtered])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Tutorials | LinkDit",
    description: "Learn AI step by step with beginner to advanced tutorials covering ChatGPT, Claude, Gemini, Cursor, and more.",
    url: "https://linkdit.online/tutorials",
    provider: { "@type": "Organization", name: "LinkDit" },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-white via-blue-50/40 to-white px-4 pt-24 pb-16 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_60%)] opacity-[0.03] pointer-events-none" />
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Free AI Tutorials
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  AI Tutorials
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Learn AI step by step with beginner to advanced tutorials. Master ChatGPT, Claude, Gemini, Cursor, and every major AI tool.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link href="#featured" className="btn-primary px-6 py-3 text-sm">
                    <BookOpen className="h-4 w-4" />
                    Start Learning
                  </Link>
                  <Link href="#browse" className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-sm font-medium text-foreground transition-all hover:shadow-soft-md">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    Browse All Tutorials
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Search */}
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
                  placeholder="Search tutorials..."
                  className="h-13 w-full rounded-2xl border border-border bg-white/80 pl-12 pr-4 text-sm shadow-soft-sm backdrop-blur-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Featured ─── */}
        <ScrollReveal>
          <section id="featured" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Featured Tutorials</h2>
                <p className="mt-1 text-sm text-muted-foreground">Hand-picked tutorials to get you started</p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((tutorial, i) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} index={i} />
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ─── Browse All ─── */}
        <section id="browse" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">All Tutorials</h2>
              <p className="mt-1 text-sm text-muted-foreground">{filtered.length} tutorial{filtered.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-xl border border-border bg-white p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg p-1.5 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg p-1.5 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category chips */}
          <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {["All", ...tutorialCategories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-soft-sm"
                    : "bg-white text-muted-foreground border border-border hover:bg-accent hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty tabs */}
          <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by difficulty">
            {(["All", "Beginner", "Intermediate", "Advanced"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setActiveDifficulty(d)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                  activeDifficulty === d
                    ? "bg-foreground text-background shadow-soft-sm"
                    : "bg-white text-muted-foreground border border-border hover:bg-accent hover:text-foreground"
                }`}
              >
                {d === "All" ? "All Levels" : d}
              </button>
            ))}
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white px-6 py-20 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No tutorials found</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {searchQuery
                  ? `No tutorials match "${searchQuery}". Try a different search term.`
                  : "No tutorials match the selected filters. Try adjusting your criteria."}
              </p>
              {(searchQuery || activeCategory !== "All" || activeDifficulty !== "All") && (
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); setActiveDifficulty("All") }}
                  className="mt-4 text-sm font-medium text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="space-y-12">
              {(["Beginner", "Intermediate", "Advanced"] as Difficulty[]).map((difficulty) => {
                const items = groupedByDifficulty[difficulty]
                if (!items.length) return null
                const diff = difficultyConfig[difficulty]
                const DiffIcon = diff.icon
                return (
                  <div key={difficulty}>
                    <div className="mb-5 flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${diff.bg}`}>
                        <DiffIcon className={`h-4 w-4 ${diff.text}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{difficulty}</h3>
                      <span className="text-sm text-muted-foreground">({items.length})</span>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((tutorial, i) => (
                        <TutorialCard key={tutorial.id} tutorial={tutorial} index={i} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((tutorial, i) => {
                const diff = difficultyConfig[tutorial.difficulty]
                const DiffIcon = diff.icon
                const slug = tutorial.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                return (
                  <motion.div
                    key={tutorial.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/tutorials/${slug}`} className="group flex items-start gap-4 rounded-xl border border-border bg-white p-4 transition-all hover:shadow-soft-md hover:-translate-y-0.5">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${diff.bg}`}>
                        <DiffIcon className={`h-5 w-5 ${diff.text}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{tutorial.title}</h4>
                          <span className={`rounded-md ${diff.bg} px-2 py-0.5 text-[10px] font-medium ${diff.text}`}>{tutorial.difficulty}</span>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{tutorial.description}</p>
                        <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span>{tutorial.category}</span>
                          <span>{tutorial.readingTime}</span>
                          <span>Updated {tutorial.updatedAt}</span>
                        </div>
                      </div>
                      <ChevronRight className="mt-2 h-5 w-5 shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>

        {/* ─── Newsletter CTA ─── */}
        <section className="border-t border-border/40 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Get New Tutorials Weekly</h2>
            <p className="mt-3 text-base text-muted-foreground">
              Join 10,000+ readers. We send the best AI tutorials, guides, and resources every week.
            </p>
            {subscribed ? (
              <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                <p className="text-sm font-medium text-emerald-700">You&apos;re subscribed! Check your inbox.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSubscribed(true) }}
                className="mx-auto mt-6 flex max-w-md gap-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="h-12 flex-1 rounded-xl border border-border bg-white px-4 text-sm shadow-soft-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button type="submit" className="btn-primary shrink-0 px-6 text-sm">
                  Subscribe
                </button>
              </form>
            )}
            <p className="mt-3 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
          </div>
        </section>

        {/* ─── Bottom CTA ─── */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-indigo-600 px-6 py-16 text-center text-white sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Master AI?</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-white/80">
              Start with a beginner tutorial and work your way up to advanced techniques. Your AI journey starts here.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="#browse" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
                <BookOpen className="h-4 w-4" />
                Browse All Tutorials
              </Link>
              <Link href="/guides" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10">
                <GraduationCap className="h-4 w-4" />
                Explore Guides
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
