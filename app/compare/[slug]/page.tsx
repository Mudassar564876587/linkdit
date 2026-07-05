import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Eye, ExternalLink, Check, X, ArrowRightLeft, Star, Clock } from "lucide-react"
import ComparisonTable from "@/components/comparisons/comparison-table"
import SimilarComparisons from "./similar-comparisons"
import IncrementViews from "./increment-views"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const slug = (await params).slug.toLowerCase()
  const supabase = await createServerSupabaseClient()

  const { data: comparison } = await supabase
    .from("comparisons")
    .select("*, tool_a:tools!tool_a_id(name, slug, logo_url, description), tool_b:tools!tool_b_id(name, slug, logo_url, description)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!comparison) return { title: "Comparison not found" }

  const toolAName = comparison.tool_a?.name || "Tool A"
  const toolBName = comparison.tool_b?.name || "Tool B"
  const title =
    comparison.seo_title ||
    `${toolAName} vs ${toolBName} – Side-by-Side Comparison | LinkDit`
  const description =
    comparison.seo_description ||
    comparison.description ||
    `Compare ${toolAName} vs ${toolBName}: pricing, features, ratings, and more. Make an informed decision.`

  const images = []
  if (comparison.tool_a?.logo_url) images.push(comparison.tool_a.logo_url)
  if (comparison.tool_b?.logo_url) images.push(comparison.tool_b.logo_url)

  return {
    title,
    description,
    metadataBase: new URL("https://linkdit.vercel.app"),
    alternates: { canonical: `/compare/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "LinkDit",
      locale: "en_US",
      url: `/compare/${slug}`,
      images: images.length > 0 ? images.map((url) => ({ url, width: 200, height: 200 })) : [],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: images.length > 0 ? [images[0]] : [],
    },
  }
}

export default async function ComparisonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug.toLowerCase()
  const supabase = await createServerSupabaseClient()

  const { data: comparison, error } = await supabase
    .from("comparisons")
    .select("*, tool_a:tools!tool_a_id(*, categories(name)), tool_b:tools!tool_b_id(*, categories(name)), categories(name)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error || !comparison) notFound()

  const mapTool = (t: any) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    logoUrl: t.logo_url,
    websiteUrl: t.website_url,
    websiteLabel: "Visit Website",
    pricing: t.pricing,
    rating: t.rating,
    reviewCount: t.review_count || 0,
    features: t.features ?? [],
    pros: t.pros ?? [],
    cons: t.cons ?? [],
    categoryName: t.categories?.name ?? null,
  })

  const toolA = mapTool(comparison.tool_a)
  const toolB = mapTool(comparison.tool_b)
  const featuresData = comparison.features_comparison ?? []
  const pricingData = comparison.pricing_comparison ?? []
  const ratingsData = comparison.ratings_comparison ?? []
  const prosA: string[] = comparison.pros_a ?? []
  const prosB: string[] = comparison.pros_b ?? []
  const consA: string[] = comparison.cons_a ?? []
  const consB: string[] = comparison.cons_b ?? []

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: comparison.title || `${toolA.name} vs ${toolB.name}`,
    description: comparison.description || `Compare ${toolA.name} vs ${toolB.name}: pricing, features, ratings, and more.`,
    url: `https://linkdit.vercel.app/compare/${comparison.slug}`,
    datePublished: comparison.created_at,
    dateModified: comparison.updated_at,
    author: { "@type": "Organization", name: "LinkDit" },
    about: [
      { "@type": "SoftwareApplication", name: toolA.name, applicationCategory: toolA.categoryName || "AI Tool" },
      { "@type": "SoftwareApplication", name: toolB.name, applicationCategory: toolB.categoryName || "AI Tool" },
    ],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://linkdit.vercel.app/compare/${comparison.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <IncrementViews
        comparisonId={comparison.id}
        slug={comparison.slug}
        title={comparison.title || `${toolA.name} vs ${toolB.name}`}
        toolAName={toolA.name}
        toolBName={toolB.name}
      />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/compare" className="hover:text-foreground transition-colors">Compare</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground font-medium" aria-current="page">
                {comparison.title || `${toolA.name} vs ${toolB.name}`}
              </li>
            </ol>
          </nav>

          {/* Hero */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary overflow-hidden ring-2 ring-border">
                  {toolA.logoUrl ? (
                    <img src={toolA.logoUrl} alt={`${toolA.name} logo`} className="h-full w-full object-cover" />
                  ) : (
                    toolA.name.charAt(0)
                  )}
                </div>
                <ArrowRightLeft className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary overflow-hidden ring-2 ring-border">
                  {toolB.logoUrl ? (
                    <img src={toolB.logoUrl} alt={`${toolB.name} logo`} className="h-full w-full object-cover" />
                  ) : (
                    toolB.name.charAt(0)
                  )}
                </div>
              </div>
              <h1 className="mt-4 text-3xl font-bold text-foreground">
                {comparison.title || `${toolA.name} vs ${toolB.name}`}
              </h1>
              {comparison.description && (
                <p className="mt-2 text-base text-muted-foreground max-w-2xl">
                  {comparison.description}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  {comparison.views} views
                </div>
                {comparison.categories?.name && (
                  <>
                    <span aria-hidden="true">&middot;</span>
                    <span className="rounded-md bg-muted px-2 py-0.5 font-medium">
                      {comparison.categories.name}
                    </span>
                  </>
                )}
                {comparison.is_featured && (
                  <>
                    <span aria-hidden="true">&middot;</span>
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                      Featured
                    </span>
                  </>
                )}
                <span aria-hidden="true">&middot;</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    Updated {new Date(comparison.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary overflow-hidden">
                    {toolA.logoUrl ? (
                      <img src={toolA.logoUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      toolA.name.charAt(0)
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">{toolA.name}</h2>
                </div>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{toolA.pricing}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-lg font-bold text-foreground">{toolA.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-muted-foreground">({toolA.reviewCount} reviews)</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{toolA.description}</p>
              <a
                href={toolA.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {toolA.websiteLabel}
              </a>
            </div>
            <div className="rounded-xl border border-border bg-background p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary overflow-hidden">
                    {toolB.logoUrl ? (
                      <img src={toolB.logoUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      toolB.name.charAt(0)
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">{toolB.name}</h2>
                </div>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{toolB.pricing}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-lg font-bold text-foreground">{toolB.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-muted-foreground">({toolB.reviewCount} reviews)</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{toolB.description}</p>
              <a
                href={toolB.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {toolB.websiteLabel}
              </a>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-10">
            <ComparisonTable
              features={featuresData}
              pricing={pricingData}
              ratings={ratingsData}
              toolAName={toolA.name}
              toolBName={toolB.name}
              toolA={{ pricing: toolA.pricing, rating: toolA.rating, reviewCount: toolA.reviewCount }}
              toolB={{ pricing: toolB.pricing, rating: toolB.rating, reviewCount: toolB.reviewCount }}
              createdAt={comparison.created_at}
              updatedAt={comparison.updated_at}
            />
          </div>

          {/* Pros & Cons Side by Side */}
          {(prosA.length > 0 || prosB.length > 0 || consA.length > 0 || consB.length > 0) && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-foreground">Pros & Cons</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary overflow-hidden">
                      {toolA.logoUrl ? (
                        <img src={toolA.logoUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        toolA.name.charAt(0)
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{toolA.name}</h3>
                  </div>
                  {prosA.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-emerald-600 flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5" /> Pros
                      </p>
                      <ul className="mt-2 space-y-2" role="list">
                        {prosA.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {consA.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-red-600 flex items-center gap-1.5">
                        <X className="h-3.5 w-3.5" /> Cons
                      </p>
                      <ul className="mt-2 space-y-2" role="list">
                        {consA.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="rounded-xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary overflow-hidden">
                      {toolB.logoUrl ? (
                        <img src={toolB.logoUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        toolB.name.charAt(0)
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{toolB.name}</h3>
                  </div>
                  {prosB.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-emerald-600 flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5" /> Pros
                      </p>
                      <ul className="mt-2 space-y-2" role="list">
                        {prosB.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {consB.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-red-600 flex items-center gap-1.5">
                        <X className="h-3.5 w-3.5" /> Cons
                      </p>
                      <ul className="mt-2 space-y-2" role="list">
                        {consB.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tool A Notes */}
          {comparison.tool_a_notes && (
            <div className="mt-8 rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground">About {toolA.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{comparison.tool_a_notes}</p>
            </div>
          )}

          {/* Tool B Notes */}
          {comparison.tool_b_notes && (
            <div className="mt-4 rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground">About {toolB.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{comparison.tool_b_notes}</p>
            </div>
          )}

          {/* Similar Comparisons */}
          <div className="mt-12">
            <SimilarComparisons
              currentId={comparison.id}
              categoryId={comparison.category_id}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
