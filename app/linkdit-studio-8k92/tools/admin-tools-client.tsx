"use client"

import { useState, useMemo, useCallback, useEffect, startTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Plus, Search, CheckCircle, XCircle, Star, ShieldCheck, Trash2,
  ExternalLink, Pencil, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal,
  Loader2, CheckCheck, X, BookmarkCheck, BookmarkX, EyeOff, Eye,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  adminDeleteTool, adminTogglePublish, adminToggleFeatured, adminToggleVerified,
  adminBulkVerify, adminBulkUnverify, adminBulkFeature, adminBulkUnfeature,
  adminBulkPublish, adminBulkUnpublish, adminBulkDeleteTools,
} from "@/actions/admin/tools"

type ToolItem = {
  id: string
  name: string
  slug: string
  website_url: string
  is_published: boolean
  featured: boolean
  is_verified: boolean
  rating: number
  review_count: number
  created_at: string
  categories: { name: string } | null
}

type SortField = "name" | "rating" | "review_count" | "created_at"
type SortDir = "asc" | "desc"

const PAGE_SIZES = [10, 25, 50, 100]

export default function AdminToolsClient({ tools }: { tools: ToolItem[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState("all")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(25)
  const [loading, setLoading] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  const filtered = useMemo(() => {
    let result = tools.filter((t) => {
      const q = search.toLowerCase()
      const matchSearch = !q
        || t.name.toLowerCase().includes(q)
        || t.slug.toLowerCase().includes(q)
        || t.categories?.name?.toLowerCase().includes(q)
        || t.website_url?.toLowerCase().includes(q)
      const matchFilter = filter === "all"
        || (filter === "published" && t.is_published)
        || (filter === "unpublished" && !t.is_published)
        || (filter === "featured" && t.featured)
        || (filter === "verified" && t.is_verified)
      return matchSearch && matchFilter
    })

    result.sort((a, b) => {
      let cmp = 0
      if (sortField === "name") cmp = a.name.localeCompare(b.name)
      else if (sortField === "rating") cmp = a.rating - b.rating
      else if (sortField === "review_count") cmp = a.review_count - b.review_count
      else if (sortField === "created_at") cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return sortDir === "asc" ? cmp : -cmp
    })

    return result
  }, [tools, search, filter, sortField, sortDir])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = useMemo(() => {
    const start = page * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  useEffect(() => {
    if (page >= totalPages && totalPages > 0) setPage(totalPages - 1)
  }, [totalPages, page])

  useEffect(() => {
    setPage(0)
  }, [search, filter, pageSize])

  const toggleSort = useCallback((field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortField(field); setSortDir(field === "name" ? "asc" : "desc") }
  }, [sortField])

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }, [])

  const toggleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelected(new Set())
      setSelectAll(false)
    } else {
      setSelected(new Set(paginated.map((t) => t.id)))
      setSelectAll(true)
    }
  }, [selectAll, paginated])

  const handleAction = useCallback(async (
    action: () => Promise<{ success?: boolean; error?: string }>,
    successMsg: string
  ) => {
    const result = await action()
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(successMsg)
      router.refresh()
    }
  }, [router])

  const handleBulkAction = useCallback(async (
    action: (ids: string[]) => Promise<{ success?: boolean; error?: string }>,
    successMsg: string
  ) => {
    if (selected.size === 0) return
    const ids = Array.from(selected)
    const result = await action(ids)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(successMsg)
      setSelected(new Set())
      setSelectAll(false)
      router.refresh()
    }
  }, [selected, router])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tools</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} tool{filtered.length !== 1 ? "s" : ""} total</p>
        </div>
        <Link href="/linkdit-studio-8k92/tools/new">
          <Button>
            <Plus className="h-4 w-4" /> New Tool
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slug, category, website..."
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-8 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            aria-label="Search tools"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          aria-label="Filter"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="unpublished">Draft</option>
          <option value="featured">Featured</option>
          <option value="verified">Verified</option>
        </select>
        <select
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0) }}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          aria-label="Page size"
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>{s} per page</option>
          ))}
        </select>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 p-3 animate-in slide-in-from-top-2">
          <span className="text-sm font-medium text-foreground mr-2">{selected.size} selected</span>
          <Button variant="secondary" size="sm" onClick={() => handleBulkAction(adminBulkVerify, `Verified ${selected.size} tools`)}>
            <ShieldCheck className="h-3.5 w-3.5" /> Verify
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleBulkAction(adminBulkUnverify, `Unverified ${selected.size} tools`)}>
            <XCircle className="h-3.5 w-3.5" /> Unverify
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleBulkAction(adminBulkFeature, `Featured ${selected.size} tools`)}>
            <Star className="h-3.5 w-3.5" /> Feature
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleBulkAction(adminBulkUnfeature, `Unfeatured ${selected.size} tools`)}>
            <Star className="h-3.5 w-3.5" /> Unfeature
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleBulkAction(adminBulkPublish, `Published ${selected.size} tools`)}>
            <Eye className="h-3.5 w-3.5" /> Publish
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleBulkAction(adminBulkUnpublish, `Unpublished ${selected.size} tools`)}>
            <EyeOff className="h-3.5 w-3.5" /> Unpublish
          </Button>
          <Button
            variant="destructive" size="sm"
            onClick={async () => {
              if (!confirm(`Delete ${selected.size} tools? This cannot be undone.`)) return
              await handleBulkAction(adminBulkDeleteTools, `Deleted ${selected.size} tools`)
            }}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setSelected(new Set()); setSelectAll(false) }}>
            Clear
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="sticky top-0 z-10 bg-muted/50 w-10 px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={selectAll && paginated.every((t) => selected.has(t.id))}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    aria-label="Select all"
                  />
                </th>
                <th className="sticky top-0 z-10 bg-muted/50 px-4 py-3.5 text-left font-medium text-foreground">
                  <button onClick={() => toggleSort("name")} className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                    Tool
                    {sortField === "name" ? (sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3 opacity-50" />}
                  </button>
                </th>
                <th className="sticky top-0 z-10 bg-muted/50 px-4 py-3.5 text-left font-medium text-foreground hidden md:table-cell">Category</th>
                <th className="sticky top-0 z-10 bg-muted/50 px-4 py-3.5 text-center font-medium text-foreground">Status</th>
                <th className="sticky top-0 z-10 bg-muted/50 px-4 py-3.5 text-center font-medium text-foreground hidden sm:table-cell">Featured</th>
                <th className="sticky top-0 z-10 bg-muted/50 px-4 py-3.5 text-center font-medium text-foreground hidden sm:table-cell">Verified</th>
                <th className="sticky top-0 z-10 bg-muted/50 px-4 py-3.5 text-center font-medium text-foreground hidden lg:table-cell">
                  <button onClick={() => toggleSort("rating")} className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                    Rating
                    {sortField === "rating" ? (sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3 opacity-50" />}
                  </button>
                </th>
                <th className="sticky top-0 z-10 bg-muted/50 px-4 py-3.5 text-right font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((t, idx) => (
                <tr
                  key={t.id}
                  className="border-b border-border last:border-0 hover:bg-accent/40 transition-colors duration-150"
                  style={{ animationDelay: `${idx * 20}ms` }}
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.has(t.id)}
                      onChange={() => toggleSelect(t.id)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      aria-label={`Select ${t.name}`}
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{t.slug}</p>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground hidden md:table-cell">
                    {t.categories?.name || <span className="italic">None</span>}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => handleAction(
                        () => adminTogglePublish(t.id, !t.is_published),
                        t.is_published ? `Unpublished ${t.name}` : `Published ${t.name}`
                      )}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200 ${
                        t.is_published
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {t.is_published ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {t.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                    <button
                      onClick={() => handleAction(
                        () => adminToggleFeatured(t.id, !t.featured),
                        t.featured ? `Unfeatured ${t.name}` : `Featured ${t.name}`
                      )}
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200 ${
                        t.featured ? "text-amber-500 bg-amber-50 dark:bg-amber-900/20" : "text-muted-foreground hover:bg-accent"
                      }`}
                      aria-label={t.featured ? "Unfeature" : "Feature"}
                    >
                      <Star className={`h-4 w-4 ${t.featured ? "fill-amber-500" : ""}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                    <button
                      onClick={() => handleAction(
                        () => adminToggleVerified(t.id, !t.is_verified),
                        t.is_verified ? `Removed verification from ${t.name}` : `Verified ${t.name}`
                      )}
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200 ${
                        t.is_verified ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "text-muted-foreground hover:bg-accent"
                      }`}
                      aria-label={t.is_verified ? "Unverify" : "Verify"}
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-center hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {t.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground/60 ml-1">({t.review_count})</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/tools/${t.slug}`}
                        target="_blank"
                        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        aria-label="View tool"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <Link
                        href={`/linkdit-studio-8k92/tools/${t.id}`}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
                        aria-label="Edit tool"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={async () => {
                          if (!confirm(`Delete "${t.name}"? This cannot be undone.`)) return
                          await handleAction(() => adminDeleteTool(t.id), `Deleted ${t.name}`)
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Delete tool"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No tools found</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              {search || filter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first tool."}
            </p>
            {!search && filter === "all" && (
              <Link href="/linkdit-studio-8k92/tools/new" className="mt-4">
                <Button variant="default"><Plus className="h-4 w-4" /> New Tool</Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline" size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 7) {
                pageNum = i
              } else if (page < 3) {
                pageNum = i
              } else if (page > totalPages - 4) {
                pageNum = totalPages - 7 + i
              } else {
                pageNum = page - 3 + i
              }
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  className="min-w-[32px]"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum + 1}
                </Button>
              )
            })}
            <Button
              variant="outline" size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
