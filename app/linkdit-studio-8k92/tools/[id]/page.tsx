import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ToolForm from "../tool-form"

export const metadata: Metadata = { title: "Edit Tool | Admin | LinkDit" }

export default async function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: tool } = await supabase.from("tools").select("*, categories(name)").eq("id", id).single()
  if (!tool) notFound()

  const { data: categories } = await supabase.from("categories").select("id, name").order("name")

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Edit Tool</h1>
      <div className="rounded-xl border border-border bg-background p-6">
        <ToolForm categories={categories ?? []} initial={tool} />
      </div>
    </div>
  )
}
