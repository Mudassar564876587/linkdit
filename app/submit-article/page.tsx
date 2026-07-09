import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ArticleSubmissionForm from "@/components/submit-article/article-submission-form"

export const metadata: Metadata = {
  title: "Submit an Article",
  description: "Submit your AI-related article to be published on LinkDit. Share your knowledge with the community.",
  alternates: { canonical: "/submit-article" },
  openGraph: {
    title: "Submit an Article | LinkDit",
    description: "Share your AI knowledge with the LinkDit community. Submit your article for review.",
    type: "website",
    siteName: "LinkDit",
    url: "/submit-article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit an Article | LinkDit",
    description: "Share your AI knowledge with the LinkDit community. Submit your article for review.",
  },
}

export default async function SubmitArticlePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?redirectTo=/submit-article")

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name")

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/30 to-background">
      <div className="mx-auto max-w-3xl px-4 pt-10 pb-1 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Submit an Article
          </span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
          Share your AI knowledge with the community. Fill out the form below and our team will review it.
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-8 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-background/95 backdrop-blur-sm p-5 sm:p-8 shadow-premium-lg">
          <ArticleSubmissionForm categories={categories ?? []} />
        </div>
      </div>
    </div>
  )
}
