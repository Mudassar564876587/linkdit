import type { Metadata } from "next"
import Image from "next/image"
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
      {/* Premium Hero Card */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="w-full rounded-[24px] shadow-xl bg-gradient-to-br from-primary/5 via-background to-primary/5 ring-1 ring-black/5 overflow-hidden">
          {/* Desktop ≥1024px */}
          <div className="hidden lg:block relative w-full aspect-[2/1]">
            <Image
              src="/images/submit-tool-hero-desktop.png"
              alt="Submit your AI tool"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-contain"
            />
          </div>
          {/* Tablet 768–1023px */}
          <div className="hidden md:block lg:hidden relative w-full aspect-[7/5]">
            <Image
              src="/images/submit-tool-hero-tablet.png"
              alt="Submit your AI tool"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          {/* Mobile <768px */}
          <div className="block md:hidden relative w-full aspect-[4/5]">
            <Image
              src="/images/submit-tool-hero-mobile.png"
              alt="Submit your AI tool"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-6 pb-8 sm:px-6 lg:px-8">
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
