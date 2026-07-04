import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Clock, CheckCircle, XCircle, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Moderate Submissions | Admin | LinkDit",
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700", icon: FileText },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-700", icon: Clock },
  pending_review: { label: "Pending Review", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
}

export default async function AdminSubmissionsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: adminUser } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") redirect("/dashboard")

  const { data: raw } = await supabase
    .from("tool_submissions")
    .select("*, users(full_name, email)")
    .order("created_at", { ascending: false })

  const submissions: any[] = raw ?? []

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tool Submissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review, approve, or reject tool submissions from users.
        </p>
      </div>

      {!submissions.length ? (
        <div className="rounded-xl border border-border bg-background p-12 text-center">
          <p className="text-muted-foreground">No submissions yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-foreground">Tool</th>
                <th className="px-4 py-3 text-left font-medium text-foreground hidden sm:table-cell">Submitter</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-foreground hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-right font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => {
                const cfg = statusConfig[s.submission_status] || statusConfig.submitted
                const Icon = cfg.icon
                return (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground truncate max-w-[200px]">{s.tool_name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{s.tool_url}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-foreground">{s.users?.full_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{s.users?.email || s.submitter_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
                        <Icon className="h-3 w-3" aria-hidden="true" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/submissions/${s.id}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Review
                      </Link>
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
