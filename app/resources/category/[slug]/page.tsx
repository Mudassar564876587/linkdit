import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ResourceCard from "@/components/resources/resource-card"
import Pagination from "@/components/tools/pagination"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data: category } = await supabase.from("categories").select("name, description").eq("slug", slug).single()

  if (!category) return { title: "Category not found" }

  return {
    title: `${category.name} Resources | LinkDit`,
    description: category.description || `Browse resources in the ${category.name} category.`,
    openGraph: {
      title: `${category.name} Resources | LinkDit`,
      description: category.description || `Browse resources in the ${category.name} category.`,
    },
  }
}

const PAGE_SIZE = 12

export default async function CategoryResourcesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams
  const supabase = await createServerSupabaseClient()

  const { data: category } = await supabase.from("categories").select("*").eq("slug", slug).single()
  if (!category) notFound()

  const page = Math.max(1, Number(sp.page) || 1)

  const query = supabase
    .from("resources")
    .select("id, name, slug, description, cover_image_url, website_url, download_url, pricing, featured, categories(name)", { count: "exact" })
    .eq("is_published", true)
    .eq("category_id", category.id)

  query.order("created_at", { ascending: false })

  const from = (page - 1) * PAGE_SIZE
  query.range(from, from + PAGE_SIZE - 1)

  const { data: resources, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ChevronLeft className="h-4 w-4" /> All Resources
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{category.name} Resources</h1>
          {category.description && (
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{category.description}</p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            {count ?? 0} resource{(count ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>

        {!resources?.length ? (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">No resources in this category yet.</p>
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

        <Pagination currentPage={page} totalPages={totalPages} basePath={`/resources/category/${slug}`} />
      </div>
    </div>
  )
}
