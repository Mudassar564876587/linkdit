import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ComparisonForm from "../comparison-form"

export const metadata: Metadata = { title: "Edit Comparison | Admin | LinkDit" }

export default async function EditComparisonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: comparison } = await supabase
    .from("comparisons")
    .select("*, tool_a:tools!tool_a_id(id, name, slug, logo_url, pricing, rating), tool_b:tools!tool_b_id(id, name, slug, logo_url, pricing, rating)")
    .eq("id", id)
    .single()

  if (!comparison) notFound()

  const { data: categories } = await supabase.from("categories").select("id, name").order("name")

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Edit Comparison</h1>
      <div className="rounded-xl border border-border bg-background p-6">
        <ComparisonForm categories={categories ?? []} initial={comparison} />
      </div>
    </div>
  )
}
