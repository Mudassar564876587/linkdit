import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ResourceCard from "@/components/resources/resource-card"
import Pagination from "@/components/tools/pagination"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Resources",
  description: "Curated resources, templates, guides and tools to help you work smarter with AI.",
  openGraph: {
    title: "Resources",
    description: "Curated resources, templates, guides and tools to help you work smarter with AI.",
    type: "website",
    siteName: "LinkDit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources | LinkDit",
    description: "Curated resources, templates, guides and tools to help you work smarter with AI.",
  },
}

const PAGE_SIZE = 12

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; pricing?: string; page?: string }>
}) {
  const sp = await searchParams
  const supabase = await createServerSupabaseClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("slug, name")
    .order("name")

  const page = Math.max(1, Number(sp.page) || 1)

  const query = supabase
    .from("resources")
    .select("id, name, slug, description, cover_image_url, website_url, download_url, pricing, featured, categories(name)", { count: "exact" })
    .eq("is_published", true)

  if (sp.category) {
    query.eq("categories.slug", sp.category.toLowerCase())
  }
  if (sp.pricing) {
    query.eq("pricing", sp.pricing)
  }
  if (sp.q) {
    query.or(`name.ilike.%${sp.q}%,description.ilike.%${sp.q}%`)
  }

  query.order("featured", { ascending: false })
  query.order("created_at", { ascending: false })

  const from = (page - 1) * PAGE_SIZE
  query.range(from, from + PAGE_SIZE - 1)

  const { data: resources, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  const searchParamsRecord: Record<string, string> = {}
  if (sp.q) searchParamsRecord.q = sp.q
  if (sp.category) searchParamsRecord.category = sp.category
  if (sp.pricing) searchParamsRecord.pricing = sp.pricing

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Resources</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {count ?? 0} resource{(count ?? 0) !== 1 ? "s" : ""} found
            </p>
          </div>
          <form action="/resources" method="GET" className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="text" name="q" defaultValue={sp.q || ""}
              placeholder="Search resources..."
              className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Search resources"
            />
          </form>
        </div>

        <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Category filter">
          <a
            href={buildUrl("/resources", { ...searchParamsRecord, category: "" })}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              !sp.category
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            All
          </a>
          {categories?.map((c) => (
            <a
              key={c.slug}
              href={buildUrl("/resources", { ...searchParamsRecord, category: sp.category === c.slug ? "" : c.slug })}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                sp.category === c.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {c.name}
            </a>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <a
            href={buildUrl("/resources", { ...searchParamsRecord, pricing: "" })}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              !sp.pricing
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            All Pricing
          </a>
          {["Free", "Freemium", "Paid"].map((p) => (
            <a
              key={p}
              href={buildUrl("/resources", { ...searchParamsRecord, pricing: sp.pricing === p ? "" : p })}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                sp.pricing === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {p}
            </a>
          ))}
        </div>

        {sp.q && (
          <div className="mb-6 text-sm text-muted-foreground">
            Showing results for &ldquo;<span className="font-medium text-foreground">{sp.q}</span>&rdquo;
          </div>
        )}

        {!resources?.length ? (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">No resources found.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => (
              <ResourceCard
                key={r.id}
                name={r.name}
                slug={r.slug}
                description={r.description}
                coverImageUrl={r.cover_image_url}
                websiteUrl={r.website_url}
                downloadUrl={r.download_url}
                pricing={r.pricing}
                featured={r.featured}
                categoryName={r.categories?.name ?? null}
              />
            ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/resources"
          searchParams={searchParamsRecord}
        />
      </div>
    </div>
  )
}

function buildUrl(base: string, params: Record<string, string>): string {
  const filtered = Object.entries(params).filter(([, v]) => v)
  if (filtered.length === 0) return base
  return `${base}?${new URLSearchParams(Object.fromEntries(filtered)).toString()}`
}
