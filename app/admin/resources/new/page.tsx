import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ResourceForm from "../resource-form"

export const metadata: Metadata = { title: "New Resource | Admin | LinkDit" }

export default async function NewResourcePage() {
  const supabase = await createServerSupabaseClient()
  const { data: categories } = await supabase.from("categories").select("id, name").order("name")

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">New Resource</h1>
      <div className="rounded-xl border border-border bg-background p-6">
        <ResourceForm categories={categories ?? []} />
      </div>
    </div>
  )
}
