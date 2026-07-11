"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, CheckCircle, XCircle, ThumbsUp, Briefcase, MapPin, Star, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { adminApproveReview, adminApproveAllReviews, adminSeedReviews, adminDeleteReview } from "@/actions/admin/reviews"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

type ReviewerProfile = {
  id: string
  full_name: string
  username: string
  avatar_url: string | null
  country: string
  city: string | null
  job_title: string
}

type Review = {
  id: string
  is_approved: boolean
  rating: number
  title: string | null
  content: string | null
  pros: string[] | null
  cons: string[] | null
  helpful_count: number | null
  usage_duration: string | null
  primary_use_case: string | null
  verified_user: boolean | null
  verified_purchase: boolean | null
  would_recommend: boolean | null
  created_at: string
  users: { full_name: string | null } | null
  tools: { name: string | null; slug: string | null } | null
  reviewer_profiles: ReviewerProfile | null
}

export default function AdminReviewsClient({ reviews }: { reviews: Review[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [approvingAll, setApprovingAll] = useState(false)
  const [seeding, setSeeding] = useState(false)

  const filtered = reviews.filter((r) => {
    const name = r.reviewer_profiles?.full_name ?? r.users?.full_name ?? ""
    const toolName = r.tools?.name ?? ""
    const m = !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      toolName.toLowerCase().includes(search.toLowerCase())
    const f = filter === "all" || (filter === "pending" && !r.is_approved) || (filter === "approved" && r.is_approved)
    return m && f
  })

  const handleApprove = useCallback(async (id: string) => {
    const result = await adminApproveReview(id)
    if (result.error) toast.error(result.error)
    else { toast.success("Review approved"); router.refresh() }
  }, [router])

  const handleApproveAll = useCallback(async () => {
    if (!confirm(`Approve all ${reviews.filter(r => !r.is_approved).length} pending reviews?`)) return
    setApprovingAll(true)
    const result = await adminApproveAllReviews()
    setApprovingAll(false)
    if (result.error) toast.error(result.error)
    else { toast.success("All reviews approved"); router.refresh() }
  }, [reviews, router])

  const handleSeed = useCallback(async () => {
    if (!confirm("This will add sample reviews to all tools that don't have reviews yet. Continue?")) return
    setSeeding(true)
    try {
      const result = await adminSeedReviews()
      if (result.error) toast.error(result.error)
      else if (result.errors?.length) toast.warning(`Seeded ${result.inserted} reviews (${result.skipped} skipped). ${result.errors.length} errors.`)
      else toast.success(`Seeded ${result.inserted} reviews (${result.skipped} tools skipped, ${result.total} total)`)
    } catch (e: any) {
      toast.error(e?.message ?? "Something went wrong.")
    }
    setSeeding(false)
    router.refresh()
  }, [router])

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Delete this review?")) return
    const result = await adminDeleteReview(id)
    if (result.error) toast.error(result.error)
    else { toast.success("Review deleted"); router.refresh() }
  }, [router])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Reviews ({reviews.length})</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleSeed} disabled={seeding}>
            {seeding ? "Seeding..." : "Seed Reviews"}
          </Button>
          {reviews.some(r => !r.is_approved) && (
            <Button variant="outline" size="sm" onClick={handleApproveAll} disabled={approvingAll}>
              {approvingAll ? "Approving..." : `Approve All (${reviews.filter(r => !r.is_approved).length})`}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by reviewer or tool..."
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No reviews found.</p>
          </div>
        )}
        {filtered.map((r) => {
          const profile = r.reviewer_profiles
          const name = profile?.full_name ?? r.users?.full_name ?? "Anonymous"
          return (
            <div key={r.id} className="flex items-start justify-between rounded-xl border border-border p-4 hover:bg-accent/30 transition-colors">
              <div className="min-w-0 flex-1 space-y-1.5">
                {/* Reviewer + Tool */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground text-sm">{name}</span>
                  {profile?.job_title && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Briefcase className="h-3 w-3" />
                      {profile.job_title}
                    </span>
                  )}
                  {profile?.country && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {profile.country}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">on</span>
                  {r.tools?.slug ? (
                    <Link href={`/tools/${r.tools.slug}`} target="_blank" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-0.5">
                      {r.tools.name} <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">{r.tools?.name}</span>
                  )}
                </div>

                {/* Rating + Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                    ))}
                  </span>
                  {r.verified_purchase && (
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">✓ Purchase</span>
                  )}
                  {r.verified_user && (
                    <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">✓ User</span>
                  )}
                  {r.would_recommend && (
                    <span className="text-[11px] font-medium text-violet-600 dark:text-violet-400">Recommends</span>
                  )}
                  <span className="text-xs text-muted-foreground">{formatDate(r.created_at)}</span>
                </div>

                {/* Title + Content */}
                {r.title && <p className="text-sm font-medium text-foreground">{r.title}</p>}
                {r.content && <p className="text-sm text-muted-foreground line-clamp-2">{r.content}</p>}

                {/* Pros/Cons */}
                {(r.pros && r.pros.length > 0) || (r.cons && r.cons.length > 0) ? (
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    {r.pros && r.pros.length > 0 && (
                      <span className="text-emerald-600 dark:text-emerald-400">+{r.pros.length} pros</span>
                    )}
                    {r.cons && r.cons.length > 0 && (
                      <span className="text-red-600 dark:text-red-400">-{r.cons.length} cons</span>
                    )}
                    {r.helpful_count != null && r.helpful_count > 0 && (
                      <span className="flex items-center gap-0.5 text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" /> {r.helpful_count}
                      </span>
                    )}
                  </div>
                ) : null}
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
          )
        })}
      </div>
    </div>
  )
}
