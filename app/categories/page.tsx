import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { CategoriesPageContent } from "./categories-page-content"
import { Layers } from "lucide-react"

export const metadata: Metadata = {
  title: "AI Tool Categories",
  description: "Browse AI tools by category and find the perfect tool for your workflow.",
  openGraph: {
    title: "AI Tool Categories | LinkDit",
    description: "Browse AI tools by category and find the perfect tool for your workflow.",
    type: "website",
    siteName: "LinkDit",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tool Categories | LinkDit",
    description: "Browse AI tools by category and find the perfect tool for your workflow.",
  },
}

export default async function CategoriesPage() {
  const supabase = await createServerSupabaseClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  if (!categories?.length) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-[#FAFBFF]">
          <div className="mx-auto max-w-7xl px-4 pt-32 pb-24 text-center sm:px-6 lg:pt-44 lg:pb-24 lg:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Layers className="h-7 w-7 text-muted-foreground" />
            </div>
            <h1 className="mt-4 text-xl font-semibold text-foreground">No categories yet</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Categories will appear once tools are added.</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const [{ data: publishedTools }, { count: totalTools }] = await Promise.all([
    supabase.from("tools").select("category_id").eq("is_published", true),
    supabase.from("tools").select("*", { count: "exact", head: true }).eq("is_published", true),
  ])

  const countMap: Record<string, number> = {}
  for (const t of publishedTools ?? []) {
    countMap[t.category_id] = (countMap[t.category_id] ?? 0) + 1
  }

  const enriched = categories
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      iconName: cat.icon_name,
      toolCount: countMap[cat.id] ?? 0,
    }))
    .sort((a, b) => b.toolCount - a.toolCount)

  const sortedByUpdate = [...categories].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  )
  const latestUpdate = sortedByUpdate[0]?.updated_at ?? null

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <CategoriesPageContent
          categories={enriched}
          totalCategories={categories.length}
          totalTools={totalTools ?? 0}
          latestUpdate={latestUpdate}
        />
      </main>
      <Footer />
    </>
  )
}
