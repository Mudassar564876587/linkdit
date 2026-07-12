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
  TrendingUp,
  Star,
  Eye,
  Mail,
  CheckCircle2,
  User,
  Calendar,
  ArrowLeft,
} from "lucide-react"
import { motion } from "framer-motion"
import { blogPosts, blogCategories, trendingPosts, editorsPickPosts, searchPosts, type BlogPost } from "@/data/blog"
import ScrollReveal from "@/components/ui/scroll-reveal"

const categoryGradients: Record<string, string> = {
  "AI News": "from-blue-500 to-cyan-600",
  "Tutorials": "from-emerald-500 to-teal-600",
  "Comparisons": "from-violet-500 to-purple-600",
  "Industry Insights": "from-amber-500 to-orange-600",
  "Product Reviews": "from-rose-500 to-pink-600",
  "Opinion": "from-sky-500 to-indigo-600",
}

const categoryBg: Record<string, string> = {
  "AI News": "bg-blue-50 text-blue-700",
  "Tutorials": "bg-emerald-50 text-emerald-700",
  "Comparisons": "bg-violet-50 text-violet-700",
  "Industry Insights": "bg-amber-50 text-amber-700",
  "Product Reviews": "bg-rose-50 text-rose-700",
  "Opinion": "bg-sky-50 text-sky-700",
}

function PostCard({ post, index, featured: isFeatured }: { post: BlogPost; index: number; featured?: boolean }) {
  const slug = post.slug
  const catBg = categoryBg[post.category] || "bg-secondary text-muted-foreground"

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true, margin: "-30px" }}
      className="group relative"
    >
      <Link href={`/blog/${slug}`} className="block h-full">
        <div className={`relative h-full rounded-2xl border border-border bg-white transition-all duration-300 hover:shadow-card-hover ${isFeatured ? "hover:-translate-y-1" : "hover:-translate-y-1"}`}>
          {/* Image placeholder */}
          <div className={`relative h-48 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br ${categoryGradients[post.category] || "from-primary to-indigo-600"}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-white/20" />
            </div>
            {post.trending && (
              <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-rose-500/90 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                <TrendingUp className="h-3 w-3" />
                Trending
              </div>
            )}
            {post.editorsPick && (
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                <Star className="h-3 w-3" />
                Editor&apos;s Pick
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-medium ${catBg}`}>
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {post.readingTime}
              </span>
            </div>
            <h3 className={`font-semibold leading-snug text-foreground group-hover:text-primary transition-colors ${isFeatured ? "text-lg" : "text-sm"}`}>
              {post.title}
            </h3>
            <p className={`mt-2 leading-relaxed text-muted-foreground ${isFeatured ? "text-sm" : "text-xs"} line-clamp-2`}>
              {post.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span>{post.views}</span>
              </div>
            </div>
            {isFeatured && (
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Read article <ArrowUpRight className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

function TrendingSidebar({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-rose-500" />
        <h3 className="text-lg font-bold text-foreground">Trending Now</h3>
      </div>
      {posts.map((post, i) => {
        const slug = post.slug
        return (
          <Link key={post.id} href={`/blog/${slug}`} className="group flex gap-3 rounded-xl border border-border bg-white p-4 transition-all hover:shadow-soft-md hover:-translate-y-0.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h4>
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <Eye className="h-3 w-3" />
                {post.views} views
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const featured = blogPosts.filter((p) => p.featured)
  const trending = trendingPosts
  const editorsPicks = editorsPickPosts
  const latestPosts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const filtered = useMemo(() => {
    let results = searchQuery ? searchPosts(searchQuery) : blogPosts
    if (activeCategory !== "All") results = results.filter((p) => p.category === activeCategory)
    return results
  }, [searchQuery, activeCategory])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "AI Blog | LinkDit",
    description: "Latest AI news, comparisons, tutorials, and industry insights. Stay ahead with expert analysis of the AI landscape.",
    url: "https://linkdit.online/blog",
    provider: { "@type": "Organization", name: "LinkDit" },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/20 to-white">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-white via-amber-50/30 to-white px-4 pt-24 pb-16 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_60%)] opacity-[0.03] pointer-events-none" />
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Blog
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  AI Blog
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Latest AI news, in-depth comparisons, tutorials, and industry insights. Stay ahead of the AI revolution.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link href="#featured" className="btn-primary px-6 py-3 text-sm">
                    <BookOpen className="h-4 w-4" />
                    Featured Articles
                  </Link>
                  <Link href="#latest" className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-sm font-medium text-foreground transition-all hover:shadow-soft-md">
                    Latest Posts
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
                  placeholder="Search articles..."
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
              <h2 className="text-2xl font-bold text-foreground">Featured Articles</h2>
              <p className="mt-1 text-sm text-muted-foreground">Our top picks for you</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {featured.slice(0, 2).map((post, i) => (
                <PostCard key={post.id} post={post} index={i} featured />
              ))}
            </div>
            {featured.length > 2 && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.slice(2).map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            )}
          </section>
        </ScrollReveal>

        {/* ─── Editor's Picks + Trending ─── */}
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Editor's Picks */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                <h2 className="text-2xl font-bold text-foreground">Editor&apos;s Picks</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {editorsPicks.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            </div>

            {/* Trending Sidebar */}
            <div>
              <TrendingSidebar posts={trending} />
            </div>
          </div>
        </section>

        {/* ─── All Posts ─── */}
        <section id="latest" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Latest Articles</h2>
              <p className="mt-1 text-sm text-muted-foreground">{filtered.length} article{filtered.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Category filter */}
          <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {["All", ...blogCategories].map((cat) => (
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

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white px-6 py-20 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No articles found</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {searchQuery
                  ? `No articles match "${searchQuery}". Try a different search term.`
                  : "No articles match the selected category."}
              </p>
              {(searchQuery || activeCategory !== "All") && (
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("All") }}
                  className="mt-4 text-sm font-medium text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* ─── Newsletter CTA ─── */}
        <section className="border-t border-border/40 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Stay Ahead of AI</h2>
            <p className="mt-3 text-base text-muted-foreground">
              Get the latest AI news, comparisons, and tutorials delivered to your inbox every week.
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
          <div className="rounded-3xl bg-gradient-to-br from-amber-600 via-orange-500 to-rose-600 px-6 py-16 text-center text-white sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Never Miss an Update</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-white/80">
              Join thousands of readers who stay informed about the latest in AI. New articles published daily.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="#latest" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
                <BookOpen className="h-4 w-4" />
                Browse All Articles
              </Link>
              <Link href="/tutorials" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10">
                Explore Tutorials
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
