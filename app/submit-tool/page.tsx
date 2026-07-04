import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import SubmissionForm from "@/components/submit-tool/submission-form"

export const metadata: Metadata = {
  title: "Submit an AI Tool | LinkDit",
  description: "Submit your AI tool to be listed on LinkDit's curated directory.",
  openGraph: {
    title: "Submit an AI Tool | LinkDit",
    description: "Submit your AI tool to be listed on LinkDit's curated directory.",
    type: "website",
    siteName: "LinkDit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit an AI Tool | LinkDit",
    description: "Submit your AI tool to be listed on LinkDit's curated directory.",
  },
}

export default async function SubmitToolPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?redirectTo=/submit-tool")

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name")

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Submit an AI Tool</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill out the form below to submit your AI tool for review. Once approved, it will appear in our directory.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
          <SubmissionForm categories={categories ?? []} />
        </div>
      </div>
    </div>
  )
}
