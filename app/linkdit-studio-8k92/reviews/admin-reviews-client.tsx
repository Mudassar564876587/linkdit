"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { adminApproveReview, adminDeleteReview } from "@/actions/admin/reviews"

type Review = { id: string; is_approved: boolean; rating: number; content: string | null; users: { full_name: string | null } | null; tools: { name: string | null } | null }

export default function AdminReviewsClient({ reviews }: { reviews: Review[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const filtered = reviews.filter((r) => {
    const m = !search || r.tools?.name?.toLowerCase().includes(search.toLowerCase())
    const f = filter === "all" || (filter === "pending" && !r.is_approved) || (filter === "approved" && r.is_approved)
    return m && f
  })

  const handleApprove = useCallback(async (id: string) => {
    const result = await adminApproveReview(id)
    if (result.error) toast.error(result.error)
    else { toast.success("Review approved"); router.refresh() }
  }, [router])

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Delete this review?")) return
    const result = await adminDeleteReview(id)
    if (result.error) toast.error(result.error)
    else { toast.success("Review deleted"); router.refresh() }
  }, [router])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Reviews ({filtered.length})</h1>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by tool..."
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map((r) => (
          <div key={r.id} className="flex items-start justify-between rounded-xl border border-border p-4 hover:bg-accent/30 transition-colors">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{r.users?.full_name || "Anonymous"}</span>
                <span className="text-xs text-muted-foreground">on {r.tools?.name}</span>
                <span className="text-xs text-muted-foreground">• {r.rating}/5</span>
              </div>
              {r.content && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{r.content}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              {!r.is_approved ? (
                <Button variant="default" size="sm" onClick={() => handleApprove(r.id)}>
                  <CheckCircle className="h-3 w-3" /> Approve
                </Button>
              ) : (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium px-2">Approved</span>
              )}
              <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)}>
                <XCircle className="h-3 w-3" /> Delete
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No reviews found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
