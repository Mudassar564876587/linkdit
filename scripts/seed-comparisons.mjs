// Seed comparison records into Supabase
// Run: node scripts/seed-comparisons.mjs

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://voavwcfvnviwtweyeeej.supabase.co"
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvYXZ3Y2Z2bnZpd3R3ZXllZWVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzE0MDE1NSwiZXhwIjoyMDk4NzE2MTU1fQ.Me1f_XpDHhChfcUYcp6c5s3ZwE5U6F5WFikPqVEroXs"

const supabase = createClient(supabaseUrl, serviceRoleKey)

// Define comparisons with tool slugs
const COMPARISONS = [
  { toolA: "chatgpt", toolB: "claude", title: "ChatGPT vs Claude", description: "Compare ChatGPT vs Claude: features, pricing, ratings, and more to find the best AI chatbot for your needs.", isFeatured: true },
  { toolA: "cursor", toolB: "github-copilot", title: "Cursor vs GitHub Copilot", description: "Which AI coding assistant is better? Compare Cursor vs GitHub Copilot side-by-side.", isFeatured: true },
  { toolA: "midjourney", toolB: "canva", title: "Midjourney vs Canva", description: "Compare Midjourney vs Canva for AI image generation and design.", isFeatured: true },
  { toolA: "claude", toolB: "perplexity", title: "Claude vs Perplexity", description: "Compare Claude vs Perplexity for research, analysis, and AI-powered search.", isFeatured: true },
  { toolA: "chatgpt", toolB: "perplexity", title: "ChatGPT vs Perplexity", description: "Compare ChatGPT vs Perplexity: which AI search and chat tool is right for you?", isFeatured: true },
  { toolA: "runway", toolB: "elevenlabs", title: "Runway vs ElevenLabs", description: "Compare Runway vs ElevenLabs for AI video and voice generation.", isFeatured: false },
  { toolA: "jasper", toolB: "chatgpt", title: "Jasper vs ChatGPT", description: "Compare Jasper vs ChatGPT for content creation and copywriting.", isFeatured: false },
  { toolA: "notion-ai", toolB: "chatgpt", title: "Notion AI vs ChatGPT", description: "Compare Notion AI vs ChatGPT for productivity and workspace AI.", isFeatured: false },
  { toolA: "cursor", toolB: "cline", title: "Cursor vs Cline", description: "Compare Cursor vs Cline for AI-assisted coding and development.", isFeatured: false },
  { toolA: "github-copilot", toolB: "augment-code", title: "GitHub Copilot vs Augment Code", description: "Compare GitHub Copilot vs Augment Code for AI code completion.", isFeatured: false },
  { toolA: "grammarly", toolB: "jasper", title: "Grammarly vs Jasper", description: "Compare Grammarly vs Jasper for AI writing assistance.", isFeatured: false },
  { toolA: "devin-ai", toolB: "openhands", title: "Devin AI vs OpenHands", description: "Compare Devin AI vs OpenHands for autonomous AI software development.", isFeatured: false },
  { toolA: "claude", toolB: "kimi-ai", title: "Claude vs Kimi AI", description: "Compare Claude vs Kimi AI for long-context AI assistants.", isFeatured: false },
  { toolA: "minimax-ai", toolB: "hunyuan-ai", title: "MiniMax AI vs Hunyuan AI", description: "Compare MiniMax AI vs Hunyuan AI for AI video and image generation.", isFeatured: false },
  { toolA: "qwen-chat", toolB: "kimi-ai", title: "Qwen Chat vs Kimi AI", description: "Compare Qwen Chat vs Kimi AI for Chinese AI assistants.", isFeatured: false },
  { toolA: "trae-ai", toolB: "cursor", title: "Trae AI vs Cursor", description: "Compare Trae AI vs Cursor for AI-powered IDE features.", isFeatured: false },
  { toolA: "skyvern", toolB: "browser-use", title: "Skyvern vs Browser Use", description: "Compare Skyvern vs Browser Use for AI browser automation.", isFeatured: false },
  { toolA: "tavily-ai", toolB: "exa-ai", title: "Tavily AI vs Exa AI", description: "Compare Tavily AI vs Exa AI for AI-powered search APIs.", isFeatured: false },
  { toolA: "elevenlabs", toolB: "tavus-ai", title: "ElevenLabs vs Tavus AI", description: "Compare ElevenLabs vs Tavus AI for AI voice and video generation.", isFeatured: false },
  { toolA: "lindy-ai", toolB: "n8n-ai-agent", title: "Lindy AI vs n8n AI Agent", description: "Compare Lindy AI vs n8n AI Agent for AI workflow automation.", isFeatured: false },
]

async function main() {
  console.log("Fetching tools...")
  const { data: tools, error: toolsErr } = await supabase.from("tools").select("id, name, slug").eq("is_published", true)
  if (toolsErr) { console.error("Error fetching tools:", toolsErr.message); process.exit(1) }

  const toolMap = {}
  for (const t of tools) toolMap[t.slug] = t
  console.log("  Found", tools.length, "tools")

  console.log("Deleting existing comparisons...")
  await supabase.from("comparisons").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  let created = 0
  for (const cmp of COMPARISONS) {
    const toolA = toolMap[cmp.toolA]
    const toolB = toolMap[cmp.toolB]
    if (!toolA || !toolB) {
      console.log("  Skipping", cmp.title, "- tool not found:", !toolA ? cmp.toolA : cmp.toolB)
      continue
    }

    const slug = `${cmp.toolA}-vs-${cmp.toolB}`
    const { error } = await supabase.from("comparisons").insert({
      slug,
      title: cmp.title,
      description: cmp.description,
      tool_a_id: toolA.id,
      tool_b_id: toolB.id,
      category_id: null,
      is_published: true,
      is_featured: cmp.isFeatured,
      views: Math.floor(Math.random() * 500) + 50,
      pros_a: [],
      pros_b: [],
      cons_a: [],
      cons_b: [],
      features_comparison: [],
      pricing_comparison: [],
      ratings_comparison: [],
      seo_title: cmp.title + " | LinkDit",
      seo_description: cmp.description,
    })

    if (error && error.code !== "23505") {
      console.log("  Error creating", cmp.title + ":", error.message)
    } else {
      created++
      console.log("  Created:", cmp.title)
    }
  }

  console.log("\nTotal comparisons created:", created)

  // Verify
  const { data: final, count } = await supabase.from("comparisons").select("id, title, slug, is_featured, is_published", { count: "exact" })
  console.log("Total in DB:", count)
  console.log("Featured:", final?.filter(c => c.is_featured).length || 0)
  console.log("Published:", final?.filter(c => c.is_published).length || 0)
}

main().catch(console.error)
