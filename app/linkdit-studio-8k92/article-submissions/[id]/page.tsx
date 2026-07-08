import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ArticleReviewActions from "./review-actions"

export const metadata: Metadata = {
  title: "Review Article Submission | Admin | LinkDit",
}

export default async function ReviewArticleSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: adminUser } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") redirect("/dashboard")

  const { data: raw } = await supabase
    .from("article_submissions")
    .select("*, users(full_name, email)")
    .eq("id", id)
    .single() as unknown as { data: any; error: any }
  if (!raw) notFound()
  const sub = raw

  const tags = Array.isArray(sub.tags) ? sub.tags : []

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{sub.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Submitted by {sub.users?.full_name || sub.submitter_email}</p>
      </div>

      <ArticleReviewActions submission={sub} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase">Status</p>
          <p className="text-sm text-foreground capitalize">{sub.status}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase">Submitted</p>
          <p className="text-sm text-foreground">{new Date(sub.created_at).toLocaleDateString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase">Category ID</p>
          <p className="text-sm text-foreground">{sub.category_id}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase">Slug</p>
          <p className="text-sm text-foreground">{sub.slug}</p>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-foreground">Description</h2>
        <p className="mt-2 text-sm text-muted-foreground">{sub.description}</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground">Content</h2>
        <div className="mt-2 rounded-xl border border-border bg-muted/30 p-4">
          <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">{sub.content}</pre>
        </div>
      </section>

      {tags.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-foreground">Tags</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((t: string, i: number) => (
              <span key={i} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
            ))}
          </div>
        </section>
      )}

      {sub.cover_image_url && (
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Cover Image</h2>
          <img src={sub.cover_image_url} alt="Cover" className="max-h-80 w-full rounded-xl border border-border object-cover" />
        </section>
      )}

      {sub.admin_notes && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-800">Admin Notes</h2>
          <p className="mt-1 text-sm text-amber-700">{sub.admin_notes}</p>
        </section>
      )}
    </div>
  )
}
