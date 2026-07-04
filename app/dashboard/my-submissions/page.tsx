import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { FileText, Send, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "My Submissions | LinkDit",
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700", icon: FileText },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-700", icon: Send },
  pending_review: { label: "Pending Review", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
}

export default async function MySubmissionsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: submissions } = await supabase
    .from("tool_submissions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Submissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your AI tool submissions.
          </p>
        </div>
        <Link
          href="/submit-tool"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Submit New Tool
        </Link>
      </div>

      {!submissions?.length ? (
        <div className="rounded-xl border border-border bg-background p-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">No submissions yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Submit your first AI tool to get started.
          </p>
          <Link
            href="/submit-tool"
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Submit a Tool
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => {
            const cfg = statusConfig[s.submission_status] || statusConfig.submitted
            const Icon = cfg.icon
            return (
              <div
                key={s.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-accent/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                  {s.tool_name.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-foreground truncate">{s.tool_name}</h3>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {s.tool_url}
                  </p>
                </div>

                <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${cfg.color}`}>
                  <Icon className="h-3 w-3" aria-hidden="true" />
                  {cfg.label}
                </span>

                {s.submission_status === "approved" && s.slug && (
                  <Link
                    href={`/tools/${s.slug}`}
                    className="text-xs font-medium text-primary hover:underline shrink-0"
                  >
                    View tool
                  </Link>
                )}

                {s.submission_status === "rejected" && s.admin_notes && (
                  <div className="hidden sm:block text-xs text-muted-foreground max-w-xs truncate shrink-0">
                    {s.admin_notes}
                  </div>
                )}

                {s.submission_status === "draft" && (
                  <Link
                    href={`/submit-tool?edit=${s.id}`}
                    className="text-xs font-medium text-primary hover:underline shrink-0"
                  >
                    Continue editing
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
