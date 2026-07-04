import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ArticleForm from "../article-form"

export const metadata: Metadata = { title: "Edit Article | Admin | LinkDit" }

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: article } = await supabase.from("articles").select("*").eq("id", id).single()
  if (!article) notFound()

  const { data: categories } = await supabase.from("categories").select("id, name").order("name")

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Edit Article</h1>
      <div className="rounded-xl border border-border bg-background p-6">
        <ArticleForm categories={categories ?? []} initial={article} />
      </div>
    </div>
  )
}
