import type { Metadata } from "next"
import Image from "next/image"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import SubmissionForm from "@/components/submit-tool/submission-form"

export const metadata: Metadata = {
  title: "Submit an AI Tool",
  description: "Submit your AI tool to be listed on LinkDit's curated directory of AI tools.",
  openGraph: {
    title: "Submit an AI Tool | LinkDit",
    description: "Get your AI tool featured on LinkDit's growing directory. Reach thousands of users looking for the best AI solutions.",
    type: "website",
    siteName: "LinkDit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit an AI Tool | LinkDit",
    description: "Get your AI tool featured on LinkDit's growing directory. Reach thousands of users looking for the best AI solutions.",
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
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/30 to-background">
      {/* Hero */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="w-full rounded-[24px] shadow-premium-lg overflow-hidden bg-muted/20" style={{ aspectRatio: "1080 / 720" }}>
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/submit-tool-hero-desktop.png" />
            <Image
              src="/images/submit-tool-hero-mobile.png"
              alt="Submit your AI tool"
              width={1080}
              height={720}
              priority
              className="w-full h-full object-cover"
            />
          </picture>
        </div>
      </div>

      {/* Title section */}
      <div className="mx-auto max-w-3xl px-4 pt-10 pb-1 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          Get Featured on LinkDit
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Submit Your AI Tool
          </span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
          Join hundreds of AI tools featured on LinkDit. Fill out the form below and get discovered by thousands of users looking for the best AI solutions.
        </p>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-5xl px-4 pt-8 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-background/95 backdrop-blur-sm p-5 sm:p-8 shadow-premium-lg">
          <SubmissionForm categories={categories ?? []} />
        </div>
      </div>
    </div>
  )
}
