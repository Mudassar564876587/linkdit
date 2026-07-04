"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, CheckCircle, XCircle, Star, ShieldCheck, Trash2, ExternalLink } from "lucide-react"
import { adminDeleteTool, adminTogglePublish, adminToggleFeatured, adminToggleVerified } from "@/actions/admin/tools"

export default function AdminToolsClient({ tools }: { tools: any[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState("all")

  const filtered = tools.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all"
      || (filter === "published" && t.is_published)
      || (filter === "unpublished" && !t.is_published)
      || (filter === "featured" && t.featured)
      || (filter === "verified" && t.is_verified)
    return matchSearch && matchFilter
  })

  async function toggleSelect(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelected(next)
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selected.size} tools?`)) return
    for (const id of selected) await adminDeleteTool(id)
    setSelected(new Set())
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Tools ({filtered.length})</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Search tools"
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none"
          aria-label="Filter">
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
          <option value="featured">Featured</option>
          <option value="verified">Verified</option>
        </select>
        {selected.size > 0 && (
          <button onClick={handleBulkDelete}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700">
            <Trash2 className="h-4 w-4" /> Delete ({selected.size})
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="w-10 px-4 py-3"><input type="checkbox" onChange={(e) => {
                if (e.target.checked) setSelected(new Set(filtered.map((t) => t.id)))
                else setSelected(new Set())
              }} className="h-4 w-4" /></th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Tool</th>
              <th className="px-4 py-3 text-left font-medium text-foreground hidden md:table-cell">Category</th>
              <th className="px-4 py-3 text-center font-medium text-foreground">Status</th>
              <th className="px-4 py-3 text-center font-medium text-foreground">Featured</th>
              <th className="px-4 py-3 text-center font-medium text-foreground">Verified</th>
              <th className="px-4 py-3 text-right font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(t.id)} onChange={() => toggleSelect(t.id)} className="h-4 w-4" />
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{t.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{t.categories?.name || "—"}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={async () => { await adminTogglePublish(t.id, !t.is_published); router.refresh() }}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      t.is_published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {t.is_published ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {t.is_published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={async () => { await adminToggleFeatured(t.id, !t.featured); router.refresh() }}
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                      t.featured ? "text-amber-500 bg-amber-50" : "text-muted-foreground hover:bg-accent"}`}>
                    <Star className={`h-4 w-4 ${t.featured ? "fill-amber-500" : ""}`} />
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={async () => { await adminToggleVerified(t.id, !t.is_verified); router.refresh() }}
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                      t.is_verified ? "text-emerald-500 bg-emerald-50" : "text-muted-foreground hover:bg-accent"}`}>
                    <ShieldCheck className="h-4 w-4" />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <a href={`/tools/${t.slug}`} target="_blank" className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent" aria-label="View tool">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button onClick={async () => { await adminDeleteTool(t.id); router.refresh() }}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50" aria-label="Delete tool">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">No tools found.</div>
        )}
      </div>
    </div>
  )
}
