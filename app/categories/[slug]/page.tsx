import type { Metadata } from "next"
export const dynamic = 'force-dynamic'
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ToolCard from "@/components/tools/tool-card"
import Pagination from "@/components/tools/pagination"
import type { ToolPlatform } from "@/types/tool"

const PAGE_SIZE = 12

const seoContent: Record<string, { h1: string; text: string }> = {
  coding: {
    h1: "Top AI Coding Tools & Code Assistants",
    text: "Accelerate your development workflow with the world's best AI coding tools and assistants. Whether you are looking for an AI-first code editor like Cursor, an intelligent autocomplete plugin for VS Code, or an AI tool to refactor legacy code, this curated directory has you covered. These tools leverage advanced large language models (LLMs) to help developers write clean code, debug syntax errors instantly, and automate repetitive boilerplate tasks. Compare features, read reviews, and find the perfect artificial intelligence partner to boost your programming productivity today.",
  },
  productivity: {
    h1: "Curated AI Productivity Tools to Work Smarter",
    text: "Transform the way you manage your daily tasks, projects, and schedules with premium AI productivity tools. This curated list features cutting-edge artificial intelligence applications designed to automate mundane workflows, organize chaotic notes, and optimize team collaboration. From smart AI personal assistants to autonomous meeting note-takers, discover software that saves you hours of manual labor every week. Browse our collection, evaluate pricing tiers, and integrate the ideal AI tool to streamline your work and maximize your daily output.",
  },
  video: {
    h1: "Best AI Video Generators & Editors",
    text: "Create professional-grade visual content instantly using the top AI video tools on the market. From generating realistic digital avatars with tools like Synthesia to editing multi-track recordings directly through text transcripts via Descript, artificial intelligence is revolutionizing video production. Whether you are a content creator, a digital marketer, or an enterprise training team, these tools allow you to convert simple scripts into engaging videos in minutes. Filter through the best text-to-video platforms, compare freemium options, and scale your video creation process effortlessly.",
  },
  "image-generation": {
    h1: "Top AI Image Generators & Art Creators",
    text: "Bring your creative concepts to life with the finest AI image generators and digital art platforms. Skip the complex setups and generate high-resolution illustrations, concept art, and marketing graphics directly from simple text descriptions. Featuring market leaders like Midjourney, DALL-E, and Krea AI, this directory highlights tools capable of understanding complex prompts and rendering photorealistic or artistic styles. Find the perfect text-to-image generator for your creative toolkit and start designing without boundaries.",
  },
  design: {
    h1: "Best AI Design Tools for UI/UX & Graphics",
    text: "Elevate your visual projects with the best AI design tools on the market. From automated background removal and smart object selection to AI-powered UI layout generation, these tools help designers and non-designers alike create professional-grade graphics in minutes. Integrate AI plugins directly into Figma, Photoshop, and Canva to speed up your creative workflow. Browse our curated directory, compare freemium options, and discover the perfect AI design assistant to transform your creative process today.",
  },
  "ai-writing": {
    h1: "Top AI Writing Assistants & Content Generators",
    text: "Write blogs, emails, marketing copies, and long-form content 10x faster using premium AI writing assistants. Powered by advanced large language models like GPT-4 and Claude, these tools help you overcome writer's block, improve grammar, and maintain a consistent brand voice across all your content. From AI-powered blog post generators to real-time email assistants, find the perfect writing copilot to streamline your content creation pipeline. Compare features, pricing, and reviews to choose the ideal AI writing tool for your needs.",
  },
  marketing: {
    h1: "AI Marketing Tools for Automation & Growth",
    text: "Supercharge your marketing campaigns with cutting-edge AI marketing tools designed to automate workflows, personalize customer journeys, and optimize ad spend. From AI-powered email marketing platforms to intelligent social media schedulers and predictive analytics tools, this directory covers every aspect of modern marketing automation. Discover tools that generate high-converting ad copy, analyze customer sentiment, and provide actionable insights to grow your business. Evaluate pricing tiers, read real user reviews, and find the right AI marketing stack for your team.",
  },
  analytics: {
    h1: "Advanced AI Analytics & Data Automation Tools",
    text: "Turn raw data into actionable insights instantly with the top AI analytics tools. Leverage artificial intelligence to automate spreadsheet tasks, build data models without code, generate interactive dashboards, and uncover hidden patterns in your business data. Whether you are a data scientist looking for ML-powered analytics or a business leader seeking no-code BI solutions, this curated list has you covered. Compare features, integration capabilities, and pricing to find the best AI analytics platform that fits your workflow.",
  },
  audio: {
    h1: "Best AI Audio Tools & Music Generators",
    text: "Create studio-quality audio content with the latest AI audio tools and music generators. From text-to-speech platforms that produce natural-sounding voiceovers to AI music composers that generate royalty-free tracks, artificial intelligence is transforming the audio production landscape. Perfect for podcasters, musicians, video creators, and audiobook producers, these tools offer features like voice cloning, noise reduction, and stem separation. Browse our collection, compare freemium options, and start producing professional audio with the power of AI.",
  },
  education: {
    h1: "AI Education Tools for Teachers & Students",
    text: "Revolutionize the way you teach and learn with the best AI education tools available today. From intelligent tutoring systems that adapt to individual learning styles to AI-powered grading assistants that save educators hours of work, these tools are reshaping classrooms worldwide. Students can leverage AI study companions for personalized learning, flashcard generation, and instant homework help. Discover platforms designed for schools, universities, and self-learners — compare features, read educator reviews, and find the perfect AI tool to enhance the learning experience.",
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug.toLowerCase()
  const seo = seoContent[slug]

  if (seo) {
    const desc = seo.text.length > 160 ? seo.text.substring(0, 157) + "..." : seo.text
    return {
      title: `${seo.h1} | LinkDit`,
      description: desc,
      alternates: { canonical: `/categories/${slug}` },
      openGraph: {
        title: `${seo.h1} | LinkDit`,
        description: desc,
        type: "website",
        siteName: "LinkDit",
      },
      twitter: {
        card: "summary_large_image",
        title: `${seo.h1} | LinkDit`,
        description: desc,
      },
    }
  }

  const supabase = await createServerSupabaseClient()
  const { data: cat } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single()

  if (!cat) return { title: "Category not found" }

  return {
    title: `${cat.name} AI Tools`,
    description: cat.description,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: {
      title: `${cat.name} AI Tools | LinkDit`,
      description: cat.description,
      type: "website",
      siteName: "LinkDit",
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.name} AI Tools | LinkDit`,
      description: cat.description,
    },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const slug = (await params).slug.toLowerCase()
  const sp = await searchParams
  const supabase = await createServerSupabaseClient()

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!category) notFound()

  const seo = seoContent[slug]

  const page = Math.max(1, Number(sp.page) || 1)
  const from = (page - 1) * PAGE_SIZE

  const { data: tools, count } = await supabase
    .from("tools")
    .select("*, categories(name)", { count: "exact" })
    .eq("is_published", true)
    .eq("category_id", category.id)
    .order("rating", { ascending: false })
    .range(from, from + PAGE_SIZE - 1)

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  const { data: { user } } = await supabase.auth.getUser()
  let bookmarkedIds = new Set<string>()
  if (user) {
    const { data: bm } = await supabase
      .from("bookmarks")
      .select("tool_id")
      .eq("user_id", user.id)
    bookmarkedIds = new Set((bm ?? []).map((b) => b.tool_id!))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{seo?.h1 ?? category.name}</h1>
          {seo ? (
            <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-4xl">
              {seo.text}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              {category.description} &mdash; {count ?? 0} tool{(count ?? 0) !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {!tools?.length ? (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">No tools in this category yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <ToolCard
                key={t.id}
                id={t.id}
                name={t.name}
                slug={t.slug}
                description={t.description}
                logoUrl={t.logo_url}
                websiteUrl={t.website_url}
                pricing={t.pricing}
                platforms={(t.platforms ?? []) as ToolPlatform[]}
                rating={t.rating}
                reviewCount={t.review_count}
                featured={t.featured}
                sponsored={t.sponsored}
                isVerified={t.is_verified}
                categoryName={t.categories?.name ?? ""}
                isBookmarked={bookmarkedIds.has(t.id)}
              />
            ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/categories/${slug}`}
        />
      </div>
    </div>
  )
}
