import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { FileText, Send, CheckCircle, XCircle, Clock, Newspaper, type LucideProps } from "lucide-react"
import Link from "next/link"
import type React from "react"

export const metadata: Metadata = {
  title: "My Submissions | LinkDit",
}

const toolStatusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<LucideProps> }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700", icon: FileText },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-700", icon: Send },
  pending_review: { label: "Pending Review", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
}

const articleStatusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<LucideProps> }> = {
  pending: { label: "Pending Review", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
}

export default async function MySubmissionsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: toolSubmissions } = await supabase
    .from("tool_submissions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: articleSubmissions } = await supabase
    .from("article_submissions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const hasTools = toolSubmissions && toolSubmissions.length > 0
  const hasArticles = articleSubmissions && articleSubmissions.length > 0

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Submissions</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track your submissions across tools and articles.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/submit-tool"
              className="btn-primary"
            >
              Submit Tool
            </Link>
            <Link
              href="/submit-article"
              className="btn-secondary"
            >
              Submit Article
            </Link>
          </div>
        </div>

        {!hasTools && !hasArticles ? (
          <div className="rounded-xl border border-border bg-background p-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-foreground">No submissions yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Submit a tool or article to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {hasTools && (
              <section>
                <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Send className="h-4 w-4 text-muted-foreground" />
                  Tool Submissions
                </h2>
                <div className="space-y-2">
                  {toolSubmissions.map((s) => {
                    const cfg = toolStatusConfig[s.submission_status] || toolStatusConfig.submitted
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
                          <Link href={`/tools/${s.slug}`} className="text-xs font-medium text-primary hover:underline shrink-0">View</Link>
                        )}

                        {s.submission_status === "rejected" && s.admin_notes && (
                          <div className="hidden sm:block text-xs text-muted-foreground max-w-xs truncate shrink-0">
                            {s.admin_notes}
                          </div>
                        )}

                        {s.submission_status === "draft" && (
                          <Link href={`/submit-tool?edit=${s.id}`} className="text-xs font-medium text-primary hover:underline shrink-0">Continue</Link>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {hasArticles && (
              <section>
                <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-muted-foreground" />
                  Article Submissions
                </h2>
                <div className="space-y-2">
                  {articleSubmissions.map((s) => {
                    const cfg = articleStatusConfig[s.status] || articleStatusConfig.pending
                    const Icon = cfg.icon
                    return (
                      <div
                        key={s.id}
                        className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                          {s.title.charAt(0)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-foreground truncate">{s.title}</h3>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{s.slug}</p>
                        </div>

                        <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${cfg.color}`}>
                          <Icon className="h-3 w-3" aria-hidden="true" />
                          {cfg.label}
                        </span>

                        {s.status === "approved" && s.slug && (
                          <Link href={`/articles/${s.slug}`} className="text-xs font-medium text-primary hover:underline shrink-0">View</Link>
                        )}

                        {s.status === "rejected" && s.admin_notes && (
                          <div className="hidden sm:block text-xs text-muted-foreground max-w-xs truncate shrink-0">
                            {s.admin_notes}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
