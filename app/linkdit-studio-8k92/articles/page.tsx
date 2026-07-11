import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import Link from "next/link"
import { Plus, ExternalLink, Pencil } from "lucide-react"
import ArticleActions from "./article-actions"

export const metadata: Metadata = { title: "Blog | Admin | LinkDit" }

export default async function AdminArticlesPage() {
  const admin = getAdminClient()
  const { data: articles } = await admin
    .from("articles")
    .select("id, title, slug, is_published, featured, created_at, category_id")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Blog Articles ({articles?.length ?? 0})</h1>
        <Link href="/linkdit-studio-8k92/articles/new"
          className="btn-primary">
          <Plus className="h-4 w-4" /> New Article
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-foreground">Title</th>
              <th className="px-4 py-3 text-center font-medium text-foreground">Status</th>
              <th className="px-4 py-3 text-center font-medium text-foreground">Featured</th>
              <th className="px-4 py-3 text-left font-medium text-foreground hidden md:table-cell">Date</th>
              <th className="px-4 py-3 text-right font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles?.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 font-medium text-foreground">{a.title}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    a.is_published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {a.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {a.featured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      Featured
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {new Date(a.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <a href={`/articles/${a.slug}`} target="_blank" className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <Link href={`/linkdit-studio-8k92/articles/${a.id}`} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <ArticleActions id={a.id} isPublished={a.is_published} isFeatured={a.featured} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!articles || articles.length === 0) && (
          <div className="p-8 text-center text-sm text-muted-foreground">No articles yet.</div>
        )}
      </div>
    </div>
  )
}
