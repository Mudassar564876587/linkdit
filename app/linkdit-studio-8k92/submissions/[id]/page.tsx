import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { ExternalLink } from "lucide-react"
import ReviewActions from "./review-actions"

export const metadata: Metadata = {
  title: "Review Submission | Admin | LinkDit",
}

export default async function ReviewSubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const admin = getAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: adminUser } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") redirect("/dashboard")

  const { data: raw } = await admin
    .from("tool_submissions")
    .select("*, users(full_name, email)")
    .eq("id", id)
    .single() as unknown as { data: any; error: any }

  if (!raw) notFound()

  const sub = raw

  const features = Array.isArray(sub.features) ? sub.features : []
  const pros = Array.isArray(sub.pros) ? sub.pros : []
  const cons = Array.isArray(sub.cons) ? sub.cons : []
  const faqs = Array.isArray(sub.faqs) ? sub.faqs : []
  const tags = Array.isArray(sub.tags) ? sub.tags : []
  const gallery = Array.isArray(sub.gallery_images) ? sub.gallery_images : []

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{sub.tool_name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Submitted by {sub.users?.full_name || sub.submitter_email}
          </p>
        </div>
        <a
          href={sub.tool_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-4 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Visit site
        </a>
      </div>

      <ReviewActions submission={sub} />

      {/* Details */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase">Status</p>
          <p className="text-sm text-foreground capitalize">{sub.submission_status}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase">Pricing</p>
          <p className="text-sm text-foreground">{sub.pricing}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase">Email</p>
          <p className="text-sm text-foreground">{sub.contact_email || sub.submitter_email}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase">Category</p>
          <p className="text-sm text-foreground">{sub.category_id}</p>
        </div>
      </div>

      {/* Description */}
      <section>
        <h2 className="text-lg font-semibold text-foreground">Description</h2>
        <p className="mt-2 text-sm text-muted-foreground">{sub.description}</p>
      </section>

      {/* Full Description */}
      {sub.full_description && (
        <section>
          <h2 className="text-lg font-semibold text-foreground">Full Description</h2>
          <div
            className="mt-2 text-sm text-muted-foreground prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: sub.full_description }}
          />
        </section>
      )}

      {/* Tags */}
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

      {/* Features, Pros, Cons */}
      <div className="grid gap-6 sm:grid-cols-3">
        {features.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground">Features</h2>
            <ul className="mt-2 space-y-1">
              {features.map((f: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground">• {f}</li>
              ))}
            </ul>
          </section>
        )}
        {pros.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground">Pros</h2>
            <ul className="mt-2 space-y-1">
              {pros.map((p: string, i: number) => (
                <li key={i} className="text-sm text-green-600">✓ {p}</li>
              ))}
            </ul>
          </section>
        )}
        {cons.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground">Cons</h2>
            <ul className="mt-2 space-y-1">
              {cons.map((c: string, i: number) => (
                <li key={i} className="text-sm text-red-600">✗ {c}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
          <div className="mt-2 space-y-3">
            {faqs.map((faq: { question: string; answer: string }, i: number) => (
              <details key={i} className="rounded-lg border border-border">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground">{faq.question}</summary>
                <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Images */}
      {(sub.logo_url || sub.cover_image_url || gallery.length > 0) && (
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Images</h2>
          <div className="flex flex-wrap gap-3">
            {sub.logo_url && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Logo</p>
                <img src={sub.logo_url} alt="Logo" className="h-16 w-16 rounded-lg border border-border object-cover" />
              </div>
            )}
            {sub.cover_image_url && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Cover</p>
                <img src={sub.cover_image_url} alt="Cover" className="h-24 w-48 rounded-lg border border-border object-cover" />
              </div>
            )}
            {gallery.map((url: string, i: number) => (
              <div key={i} className="space-y-1">
                <p className="text-xs text-muted-foreground">Gallery {i + 1}</p>
                <img src={url} alt={`Gallery ${i + 1}`} className="h-20 w-32 rounded-lg border border-border object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Admin notes */}
      {sub.admin_notes && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-800">Admin Notes</h2>
          <p className="mt-1 text-sm text-amber-700">{sub.admin_notes}</p>
        </section>
      )}
    </div>
  )
}
