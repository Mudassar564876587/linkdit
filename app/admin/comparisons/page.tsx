import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, ExternalLink, Pencil } from "lucide-react"
import ComparisonActions from "./comparison-actions"

export const metadata: Metadata = { title: "Comparisons | Admin | LinkDit" }

export default async function AdminComparisonsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: comparisons } = await supabase
    .from("comparisons")
    .select("*, tool_a:tools!tool_a_id(name, slug), tool_b:tools!tool_b_id(name, slug)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Comparisons ({comparisons?.length ?? 0})</h1>
        <Link href="/admin/comparisons/new"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New Comparison
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-foreground">Title</th>
              <th className="px-4 py-3 text-left font-medium text-foreground hidden md:table-cell">Tools</th>
              <th className="px-4 py-3 text-center font-medium text-foreground">Status</th>
              <th className="px-4 py-3 text-center font-medium text-foreground">Featured</th>
              <th className="px-4 py-3 text-center font-medium text-foreground">Views</th>
              <th className="px-4 py-3 text-left font-medium text-foreground hidden md:table-cell">Date</th>
              <th className="px-4 py-3 text-right font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comparisons?.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 font-medium text-foreground">{c.title}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {c.tool_a?.name} vs {c.tool_b?.name}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    c.is_published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {c.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {c.is_featured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      Featured
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">{c.views}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <a href={`/compare/${c.slug}`} target="_blank" className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <Link href={`/admin/comparisons/${c.id}`} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <ComparisonActions
                      id={c.id}
                      isPublished={c.is_published}
                      isFeatured={c.is_featured}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!comparisons || comparisons.length === 0) && (
          <div className="p-8 text-center text-sm text-muted-foreground">No comparisons yet.</div>
        )}
      </div>
    </div>
  )
}
