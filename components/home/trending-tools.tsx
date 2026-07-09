import { getTools } from "@/services/tools.service"
import TrendingToolsClient from "./trending-tools-client"

export default async function TrendingTools() {
  let tools: Awaited<ReturnType<typeof getTools>> = []

  try {
    tools = await getTools({ featured: true })
  } catch {
    console.error("Failed to load trending tools")
  }

  if (tools.length === 0) return null

  return (
    <section className="border-t border-border bg-gradient-to-b from-white to-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground sm:text-[2rem] lg:text-[2.25rem]">
            Trending AI Tools
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base lg:text-lg">
            The most popular AI tools our community is exploring right now.
          </p>
        </div>

        <div className="mt-14 sm:mt-16">
          <TrendingToolsClient tools={tools} />
        </div>
      </div>
    </section>
  )
}
