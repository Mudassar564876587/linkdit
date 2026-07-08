import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ToolForm from "../tool-form"

export const metadata: Metadata = { title: "New Tool | Admin | LinkDit" }

export default async function NewToolPage() {
  const supabase = await createServerSupabaseClient()
  const { data: categories } = await supabase.from("categories").select("id, name").order("name")

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">New Tool</h1>
      <div className="rounded-xl border border-border bg-background p-6">
        <ToolForm categories={categories ?? []} isNew />
      </div>
    </div>
  )
}
