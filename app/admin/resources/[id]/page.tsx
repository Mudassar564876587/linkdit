import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ResourceForm from "../resource-form"

export const metadata: Metadata = { title: "Edit Resource | Admin | LinkDit" }

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: resource } = await supabase.from("resources").select("*").eq("id", id).single()
  if (!resource) notFound()

  const { data: categories } = await supabase.from("categories").select("id, name").order("name")

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Edit Resource</h1>
      <div className="rounded-xl border border-border bg-background p-6">
        <ResourceForm categories={categories ?? []} initial={resource} />
      </div>
    </div>
  )
}
