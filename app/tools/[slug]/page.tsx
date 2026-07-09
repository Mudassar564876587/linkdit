import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SITE } from "@/constants/site"
import BackNav from "@/components/ui/back-nav"
import RatingStars from "@/components/tools/rating-stars"
import BookmarkButton from "@/components/tools/bookmark-button"
import ReviewsList from "./reviews-list"
import SimilarTools from "./similar-tools"
import ReviewSection from "@/components/tools/review-section"
import { ExternalLink, Check, X, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug.toLowerCase()
  const supabase = await createServerSupabaseClient()
  const { data: tool } = await supabase
    .from("tools")
    .select("name, description, seo_title, seo_description, logo_url, slug, rating, review_count, pricing")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!tool) return { title: "Tool not found" }

  const title = tool.seo_title || `${tool.name} – Review, Pricing & Features`
  const description = tool.seo_description || tool.description

  return {
    title,
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: `/tools/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "LinkDit",
      locale: "en_US",
      url: `/tools/${slug}`,
      images: tool.logo_url ? [{ url: tool.logo_url, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: tool.logo_url ? [tool.logo_url] : [],
    },
  }
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug.toLowerCase()
  const supabase = await createServerSupabaseClient()

  const { data: tool, error } = await supabase
    .from("tools")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error || !tool) notFound()

  const { data: tagsData } = await supabase
    .from("tool_tags")
    .select("tags(name, slug)")
    .eq("tool_id", tool.id)

  const tags = (tagsData ?? []).map((tt) => tt.tags).filter(Boolean)

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, users(full_name, avatar_url)")
    .eq("tool_id", tool.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })

  const { data: screenshotsData } = await supabase
    .from("tool_screenshots")
    .select("url, alt, sort_order")
    .eq("tool_id", tool.id)
    .order("sort_order", { ascending: true })

  const platforms = Array.isArray(tool.platforms) ? tool.platforms : []

  const { data: { user } } = await supabase.auth.getUser()

  const { data: userReview } = user
    ? await supabase
        .from("reviews")
        .select("*")
        .eq("tool_id", tool.id)
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null }

  let isBookmarked = false
  if (user) {
    const { data: bm } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("tool_id", tool.id)
      .maybeSingle()
    isBookmarked = !!bm
  }

  const screenshots = screenshotsData ?? []
  const features = Array.isArray(tool.features) ? tool.features : []
  const pros = Array.isArray(tool.pros) ? tool.pros : []
  const cons = Array.isArray(tool.cons) ? tool.cons : []
  const faqs = Array.isArray(tool.faqs) ? tool.faqs : []

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: `${SITE.url}/tools/${tool.slug}`,
    applicationCategory: tool.categories?.name || "AI Tool",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: tool.pricing === "Free" ? "0" : tool.pricing === "Freemium" ? "0" : undefined,
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tool.rating,
      reviewCount: tool.review_count,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <BackNav />
          {/* Hero */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                {tool.logo_url ? (
                  <img src={tool.logo_url} alt="" className="h-full w-full rounded-2xl object-cover" />
                ) : (
                  tool.name.charAt(0)
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold text-foreground">{tool.name}</h1>
                  {tool.is_verified && (
                    <ShieldCheck className="h-6 w-6 text-emerald-500" aria-label="Verified tool" />
                  )}
                  {tool.featured && (
                    <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                      Featured
                    </span>
                  )}
                  {tool.sponsored && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-semibold text-white">
                      <Sparkles className="h-3 w-3" />
                      Sponsored
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <RatingStars rating={tool.rating} />
                  <span className="text-sm text-muted-foreground">
                    {tool.rating.toFixed(1)} ({tool.review_count} reviews)
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {tool.categories?.name}
                  </span>
                  <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    tool.pricing === "Free"
                      ? "bg-emerald-50 text-emerald-700"
                      : tool.pricing === "Freemium"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-violet-50 text-violet-700"
                  }`}>
                    {tool.pricing}
                  </span>
                  {platforms.length > 0 && platforms.map((p: string) => (
                    <span key={p} className="rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BookmarkButton toolId={tool.id} isBookmarked={isBookmarked} isAuthenticated={!!user} />
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <ExternalLink className="h-4 w-4" />
                {"Visit Website"}
              </a>
            </div>
          </div>

          {/* Cover Image */}
          {tool.cover_image_url && (
            <div className="mt-10">
              <img
                src={tool.cover_image_url}
                alt={`${tool.name} cover`}
                className="w-full rounded-xl border border-border object-cover shadow-sm"
                loading="lazy"
              />
            </div>
          )}

          {/* Screenshots Gallery */}
          {screenshots.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-foreground">Screenshots</h2>
              <div className="mt-4 flex gap-4 overflow-x-auto pb-4 snap-x" role="region" aria-label="Tool screenshots">
                {screenshots.map((s, i: number) => (
                  <figure key={i} className="snap-start shrink-0">
                    <img
                      src={s.url}
                      alt={s.alt || `${tool.name} screenshot ${i + 1}`}
                      className="h-64 w-auto rounded-xl border border-border object-cover shadow-sm"
                      loading="lazy"
                    />
                    {s.alt && (
                      <figcaption className="mt-1 text-xs text-muted-foreground text-center">{s.alt}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-foreground">About</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {tool.description}
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            {/* Features */}
            {features.length > 0 && (
              <section aria-labelledby="features-heading">
                <h2 id="features-heading" className="text-xl font-semibold text-foreground">Features</h2>
                <ul className="mt-4 space-y-3" role="list">
                  {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700" aria-hidden="true">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Pros & Cons */}
            {(pros.length > 0 || cons.length > 0) && (
              <section aria-labelledby="pros-cons-heading">
                <h2 id="pros-cons-heading" className="sr-only">Pros and Cons</h2>
                {pros.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-foreground">Pros</h3>
                    <ul className="mt-4 space-y-3" role="list">
                      {pros.map((p: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700" aria-hidden="true">
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="text-sm text-muted-foreground">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {cons.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Cons</h3>
                    <ul className="mt-4 space-y-3" role="list">
                      {cons.map((c: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700" aria-hidden="true">
                            <X className="h-3 w-3" />
                          </span>
                          <span className="text-sm text-muted-foreground">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-foreground">Tags</h2>
              <div className="mt-3 flex flex-wrap gap-2" role="list" aria-label="Tool tags">
                {tags.map((t) => (
                  <span
                    key={t.slug}
                    className="rounded-lg bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {faqs.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-foreground">FAQ</h2>
              <div className="mt-4 space-y-4">
                {faqs.map((faq: { question: string; answer: string }, i: number) => (
                  <details key={i} className="group rounded-xl border border-border">
                    <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-foreground">
                      {faq.question}
                      <span className="text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true">▼</span>
                    </summary>
                    <div className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Review Section */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-foreground">
              {userReview ? "Your review" : "Write a review"}
            </h2>
            <div className="mt-4">
              <ReviewSection
                toolId={tool.id}
                isAuthenticated={!!user}
                existingReview={userReview}
              />
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-foreground">Reviews</h2>
            <div className="mt-4">
              <ReviewsList reviews={reviews ?? []} />
            </div>
          </div>

          {/* Similar Tools */}
          <div className="mt-10">
            <SimilarTools currentToolId={tool.id} categoryId={tool.category_id} />
          </div>
        </div>
      </div>
    </>
  )
}
