import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, ExternalLink, Pencil } from "lucide-react"
import ResourceActions from "./resource-actions"

export const metadata: Metadata = { title: "Resources | Admin | LinkDit" }

export default async function AdminResourcesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: resources } = await supabase
    .from("resources")
    .select("*, categories(name)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Resources ({resources?.length ?? 0})</h1>
        <Link href="/linkdit-studio-8k92/resources/new"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New Resource
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-foreground hidden md:table-cell">Category</th>
              <th className="px-4 py-3 text-center font-medium text-foreground">Status</th>
              <th className="px-4 py-3 text-center font-medium text-foreground">Featured</th>
              <th className="px-4 py-3 text-left font-medium text-foreground hidden md:table-cell">Date</th>
              <th className="px-4 py-3 text-right font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources?.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{r.categories?.name || "—"}</td>
                <td className="px-4 py-3 text-center">
                  <ResourceActions id={r.id} isPublished={r.is_published} isFeatured={r.featured} />
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <a href={`/resources/${r.slug}`} target="_blank" className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <Link href={`/linkdit-studio-8k92/resources/${r.id}`} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!resources || resources.length === 0) && (
          <div className="p-8 text-center text-sm text-muted-foreground">No resources yet.</div>
        )}
      </div>
    </div>
  )
}
