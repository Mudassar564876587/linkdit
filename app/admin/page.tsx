import { createServerSupabaseClient } from "@/lib/supabase/server"
import { LayoutDashboard, Grid3X3, Users, Star, Send, Bookmark, Activity } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient()

  const [
    { count: totalUsers },
    { count: totalTools },
    { count: pendingSubmissions },
    { count: approvedTools },
    { count: totalCategories },
    { count: totalReviews },
    { count: totalBookmarks },
    { data: recentLogs },
    { data: recentSubmissions },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("tools").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("tool_submissions").select("*", { count: "exact", head: true }).eq("submission_status", "submitted"),
    supabase.from("tools").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("bookmarks").select("*", { count: "exact", head: true }),
    supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(10),
    supabase.from("tool_submissions").select("id, tool_name, submission_status, created_at").order("created_at", { ascending: false }).limit(5),
  ])

  const stats = [
    { label: "Total Users", value: totalUsers ?? 0, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Published Tools", value: totalTools ?? 0, icon: Grid3X3, color: "bg-emerald-50 text-emerald-600" },
    { label: "Pending Submissions", value: pendingSubmissions ?? 0, icon: Send, color: "bg-amber-50 text-amber-600" },
    { label: "Categories", value: totalCategories ?? 0, icon: LayoutDashboard, color: "bg-violet-50 text-violet-600" },
    { label: "Reviews", value: totalReviews ?? 0, icon: Star, color: "bg-rose-50 text-rose-600" },
    { label: "Bookmarks", value: totalBookmarks ?? 0, icon: Bookmark, color: "bg-cyan-50 text-cyan-600" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of your LinkDit platform.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-background p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>
                <s.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Recent Submissions</h2>
          <div className="space-y-2">
            {recentSubmissions?.length ? recentSubmissions.map((s) => (
              <Link key={s.id} href={`/admin/submissions/${s.id}`}
                className="flex items-center justify-between rounded-lg border border-border p-3 text-sm hover:bg-accent transition-colors">
                <span className="font-medium text-foreground">{s.tool_name}</span>
                <span className="text-xs text-muted-foreground capitalize">{s.submission_status}</span>
              </Link>
            )) : <p className="text-sm text-muted-foreground">No submissions yet.</p>}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Latest Activity</h2>
          <div className="space-y-2">
            {recentLogs?.length ? recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <span className="text-muted-foreground">{log.action} <span className="font-medium text-foreground">{log.entity_type}</span></span>
                <span className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleDateString()}</span>
              </div>
            )) : <p className="text-sm text-muted-foreground">No activity yet.</p>}
          </div>
        </section>
      </div>
    </div>
  )
}
