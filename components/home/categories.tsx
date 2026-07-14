import Link from "next/link"
import { SectionHeader } from "@/components/ui/section-header"
import { CategoryCardSkeleton } from "@/components/ui/skeleton"
import { getCategories } from "@/services/categories.service"
import { PenLine } from "lucide-react"
import CategoriesClient from "./categories-client"

export default async function Categories() {
  let categories: Awaited<ReturnType<typeof getCategories>> = []

  try {
    categories = await getCategories()
  } catch {
    console.error("Failed to load categories")
  }

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <SectionHeader
          title="Browse by Category"
          description="Find the perfect AI tool for your specific needs across every category."
        />

        {categories.length === 0 ? (
          <div className="mt-14 mx-auto max-w-sm rounded-2xl border border-border/60 bg-white p-8 text-center shadow-premium">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5">
              <PenLine className="h-6 w-6 text-primary/40" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">No categories yet</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Categories will appear once tools are added.
            </p>
          </div>
        ) : (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <CategoriesClient
              categories={categories.map((c) => ({
                id: c.id, name: c.name, slug: c.slug, toolCount: c.toolCount,
                iconName: c.iconName, description: c.description,
              }))}
            />
          </div>
        )}
      </div>
    </section>
  )
}

export function CategoriesSkeleton() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-7 w-44 animate-pulse rounded bg-muted sm:h-8 sm:w-48" />
          <div className="mx-auto mt-3 h-4 w-72 animate-pulse rounded bg-muted sm:mt-4 sm:h-5 sm:w-96" />
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
