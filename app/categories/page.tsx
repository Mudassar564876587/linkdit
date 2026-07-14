import type { Metadata } from "next"
export const dynamic = 'force-dynamic'
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getCategoryIcon } from "@/lib/utils"
import { PenLine } from "lucide-react"

export const metadata: Metadata = {
  title: "AI Tool Categories",
  description: "Browse AI tools organized by category. Find writing, design, development, marketing, video, and productivity AI tools all in one place.",
  openGraph: {
    title: "AI Tool Categories | LinkDit",
    description: "Browse AI tools organized by category. Find writing, design, development, marketing, video, and productivity AI tools all in one place.",
    type: "website",
    siteName: "LinkDit",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tool Categories | LinkDit",
    description: "Browse AI tools organized by category. Find writing, design, development, marketing, video, and productivity AI tools all in one place.",
  },
}

const iconMap: Record<string, React.ReactNode> = {
  PenLine: <PenLine className="h-5 w-5" />,
}

export default async function CategoriesPage() {
  const supabase = await createServerSupabaseClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  if (!categories?.length) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-muted-foreground">No categories found.</p>
        </div>
      </div>
    )
  }

  const { data: publishedTools } = await supabase
    .from("tools")
    .select("category_id")
    .eq("is_published", true)

  const countMap: Record<string, number> = {}
  for (const t of publishedTools ?? []) {
    countMap[t.category_id] = (countMap[t.category_id] ?? 0) + 1
  }

  const enriched = categories
    .map((cat) => ({
      ...cat,
      tool_count: countMap[cat.id] ?? 0,
    }))
    .sort((a, b) => b.tool_count - a.tool_count)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse AI tools by category.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enriched.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group card-depth p-6"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {iconMap[getCategoryIcon(cat.slug)] ?? <PenLine className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {cat.tool_count > 0 ? `${cat.tool_count} tool${cat.tool_count !== 1 ? "s" : ""}` : "Coming Soon"}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
