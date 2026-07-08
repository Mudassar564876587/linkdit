import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Clock, CheckCircle, XCircle, FileText, type LucideProps } from "lucide-react"
import type React from "react"

export const metadata: Metadata = {
  title: "Article Submissions | Admin | LinkDit",
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<LucideProps> }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
}

export default async function AdminArticleSubmissionsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: adminUser } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") redirect("/dashboard")

  const { data: raw } = await supabase
    .from("article_submissions")
    .select("*, users(full_name, email)")
    .order("created_at", { ascending: false }) as unknown as { data: any; error: any }
  const submissions = raw ?? []

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Article Submissions ({submissions.length})</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review, approve, or reject article submissions from users.</p>
      </div>
      {!submissions.length ? (
        <div className="rounded-xl border border-border bg-background p-12 text-center">
          <p className="text-muted-foreground">No article submissions yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-foreground">Title</th>
                <th className="px-4 py-3 text-left font-medium text-foreground hidden sm:table-cell">Submitter</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-foreground hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-right font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s: any) => {
                const cfg = statusConfig[s.status] || statusConfig.pending
                const Icon = cfg.icon
                return (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground truncate max-w-[250px]">{s.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[250px]">{s.slug}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-foreground">{s.users?.full_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{s.users?.email || s.submitter_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
                        <Icon className="h-3 w-3" /> {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/linkdit-studio-8k92/article-submissions/${s.id}`} className="text-xs font-medium text-primary hover:underline">Review</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
