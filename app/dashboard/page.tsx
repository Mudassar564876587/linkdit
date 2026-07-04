import { Suspense } from "react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import StatsCard from "@/components/dashboard/stats-card"
import { Bookmark, Star, Eye, Clock } from "lucide-react"
import Link from "next/link"

async function DashboardStats() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [{ count: bookmarkCount }, { count: reviewCount }] = await Promise.all([
    supabase.from("bookmarks").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ])

  const stats = [
    { label: "Bookmarks", value: bookmarkCount ?? 0, icon: <Bookmark className="h-5 w-5" /> },
    { label: "Reviews", value: reviewCount ?? 0, icon: <Star className="h-5 w-5" /> },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <StatsCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
      ))}
    </div>
  )
}

async function RecentBookmarks() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("bookmarks")
    .select("id, created_at, tools!inner(name, slug, logo_url, rating)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  if (!data?.length) {
    return <p className="text-sm text-muted-foreground">No bookmarks yet.</p>
  }

  return (
    <div className="space-y-3">
      {data.map((b) => (
        <Link
          key={b.id}
          href={`/tools/${b.tools.slug}`}
          className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
            {b.tools.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{b.tools.name}</p>
            <p className="text-xs text-muted-foreground">{b.tools.rating} / 5</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

async function RecentReviews() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("reviews")
    .select("id, rating, content, created_at, tools!inner(name, slug)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  if (!data?.length) {
    return <p className="text-sm text-muted-foreground">No reviews yet.</p>
  }

  return (
    <div className="space-y-3">
      {data.map((r) => (
        <div key={r.id} className="rounded-lg border border-border p-3">
          <div className="flex items-center justify-between">
            <Link href={`/tools/${r.tools.slug}`} className="text-sm font-medium text-foreground hover:underline">
              {r.tools.name}
            </Link>
            <span className="text-sm text-muted-foreground">{r.rating}/5</span>
          </div>
          {r.content && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{r.content}</p>
          )}
        </div>
      ))}
    </div>
  )
}

function QuickActions() {
  const actions = [
    { href: "/dashboard/bookmarks", label: "View bookmarks", icon: Bookmark },
    { href: "/dashboard/reviews", label: "Manage reviews", icon: Star },
    { href: "/dashboard/profile", label: "Edit profile", icon: Eye },
    { href: "/dashboard/notifications", label: "Notifications", icon: Clock },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {actions.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
        >
          <a.icon className="h-5 w-5 text-primary" />
          {a.label}
        </Link>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back to your LinkDit dashboard.
        </p>
      </div>

      <Suspense fallback={<div className="h-24 animate-pulse rounded-xl bg-muted" />}>
        <DashboardStats />
      </Suspense>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Recent bookmarks</h2>
          <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-muted" />}>
            <RecentBookmarks />
          </Suspense>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Recent reviews</h2>
          <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-muted" />}>
            <RecentReviews />
          </Suspense>
        </section>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Quick actions</h2>
        <QuickActions />
      </section>
    </div>
  )
}
