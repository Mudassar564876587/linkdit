import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SITE } from "@/constants/site"
import { ExternalLink, Download, ChevronLeft, Check, Star } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug.toLowerCase()
  const supabase = await createServerSupabaseClient()
  const { data: resource } = await supabase
    .from("resources")
    .select("name, description, seo_title, seo_description, cover_image_url, slug")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!resource) return { title: "Resource not found" }

  const title = resource.seo_title || `${resource.name} Resources`
  const description = resource.seo_description || resource.description || ""

  return {
    title,
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: `/resources/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "LinkDit",
      locale: "en_US",
      url: `/resources/${slug}`,
      images: resource.cover_image_url ? [{ url: resource.cover_image_url, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: resource.cover_image_url ? [resource.cover_image_url] : [],
    },
  }
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug.toLowerCase()
  const supabase = await createServerSupabaseClient()

  const { data: resource, error } = await supabase
    .from("resources")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error || !resource) notFound()

  const res = resource
  const { data: related } = await supabase
    .from("resources")
    .select("id, name, slug, description, cover_image_url, pricing, featured, categories(name)")
    .eq("is_published", true)
    .eq("category_id", res.category_id ?? "")
    .neq("id", res.id)
    .order("created_at", { ascending: false })
    .limit(3)

  const features = Array.isArray(res.features) ? res.features : []
  const tags = Array.isArray(res.tags) ? res.tags : []

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: res.name,
    description: res.description,
    url: `${SITE.url}/resources/${slug}`,
    image: res.cover_image_url,
    offers: res.pricing === "Free" ? {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    } : undefined,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ChevronLeft className="h-4 w-4" /> Back to Resources
          </Link>

          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {res.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      <Star className="h-3 w-3 fill-amber-500" /> Featured
                    </span>
                  )}
                  {res.categories && (
                    <Link href={`/resources?category=${res.categories.slug}`}
                      className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                      {res.categories.name}
                    </Link>
                  )}
                  <span className={`rounded-md px-2.5 py-0.5 text-xs font-medium ${
                    res.pricing === "Free" ? "bg-emerald-50 text-emerald-700" :
                    res.pricing === "Freemium" ? "bg-amber-50 text-amber-700" :
                    "bg-violet-50 text-violet-700"
                  }`}>
                    {res.pricing}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{res.name}</h1>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {res.download_url && (
                  <a href={res.download_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Download className="h-4 w-4" /> Download
                  </a>
                )}
                {res.website_url && (
                  <a href={res.website_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-5 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                    <ExternalLink className="h-4 w-4" /> Visit
                  </a>
                )}
              </div>
            </div>

            {res.cover_image_url && (
              <div className="overflow-hidden rounded-2xl border border-border">
                <img src={res.cover_image_url} alt={res.name} className="w-full object-cover" style={{ maxHeight: "400px" }} />
              </div>
            )}

            {res.description && (
              <div>
                <h2 className="text-xl font-semibold text-foreground">About</h2>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{res.description}</p>
              </div>
            )}

            {res.content && (
              <div className="prose prose-gray max-w-none prose-headings:scroll-mt-20 prose-img:rounded-xl prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: res.content }} />
            )}

            {features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-foreground">Features</h2>
                <ul className="mt-4 space-y-3">
                  {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tags.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, i: number) => (
                    <span key={i} className="rounded-lg bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {related && related.length > 0 && (
          <section className="border-t border-border bg-secondary/50">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground">Related Resources</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.id} href={`/resources/${r.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                    {r.cover_image_url ? (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={r.cover_image_url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <span className="text-3xl font-bold text-primary/30">{r.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{r.name}</h3>
                      <p className="mt-1 flex-1 text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className={`rounded-md px-2.5 py-0.5 text-xs font-medium ${
                          r.pricing === "Free" ? "bg-emerald-50 text-emerald-700" :
                          r.pricing === "Freemium" ? "bg-amber-50 text-amber-700" :
                          "bg-violet-50 text-violet-700"
                        }`}>{r.pricing}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
