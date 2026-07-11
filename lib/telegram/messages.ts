export function startMessage(firstName: string): string {
  return (
    `👋 *Welcome to LinkDit, ${escapeMarkdown(firstName)}!*\n\n` +
    `LinkDit is your ultimate directory of AI tools and resources.\n\n` +
    `*What you can do here:*\n` +
    `🔍 Find the perfect AI tool for your needs\n` +
    `⚖ Compare different tools side by side\n` +
    `🆕 Discover the latest AI innovations\n` +
    `🆓 Find free AI tools\n\n` +
    `Use the buttons below or type /help to see all commands.`
  )
}

export function helpMessage(): string {
  return (
    `*LinkDit Bot — Commands*\n\n` +
    `/start — Start the bot and see the menu\n` +
    `/help — Show this help message\n` +
    `/tools — Browse all AI tools\n` +
    `/categories — Browse by category\n` +
    `/latest — Latest AI tools\n` +
    `/free — Free AI tools\n` +
    `/compare <tool1> vs <tool2> — Compare two tools\n` +
    `/search <query> — Search for a tool\n` +
    `/website — Open LinkDit website\n\n` +
    `_Tip: You can also just type a tool name to search!_`
  )
}

export function websiteMessage(): string {
  return (
    `🌐 *LinkDit*\n\n` +
    `Visit our website to explore the full directory:\n` +
    `[linkdit.vercel.app](https://linkdit.vercel.app)`
  )
}

export function toolsMessage(tools: {
  name: string
  slug: string
  description: string | null
  rating: number
  pricing: string | null
}[], page: number, total: number): string {
  if (tools.length === 0) {
    return "No tools found."
  }

  const lines = tools.map((t, i) => {
    const num = page * 10 + i + 1
    const rating = t.rating > 0 ? `⭐ ${t.rating.toFixed(1)}` : ""
    const pricing = t.pricing ? `💰 ${t.pricing}` : ""
    const badges = [rating, pricing].filter(Boolean).join(" • ")
    return `${num}. *${escapeMarkdown(t.name)}*\n${badges}\n${escapeMarkdown(t.description ?? "No description")}`
  })

  return `*AI Tools* (page ${page + 1})\n\n${lines.join("\n\n")}`
}

export function categoriesMessage(categories: { name: string; tool_count?: number }[]): string {
  const lines = categories.map((c, i) => {
    const count = c.tool_count ? ` (${c.tool_count} tools)` : ""
    return `${i + 1}. *${escapeMarkdown(c.name)}*${count}`
  })
  return `*Categories*\n\n${lines.join("\n")}\n\nSelect a category to browse tools.`
}

export function categoryToolsMessage(categoryName: string, tools: {
  name: string
  slug: string
  rating: number
}[], page: number): string {
  if (tools.length === 0) {
    return `No tools found in *${escapeMarkdown(categoryName)}*.`
  }

  const lines = tools.map((t, i) => {
    const num = page * 10 + i + 1
    return `${num}. *${escapeMarkdown(t.name)}* ⭐ ${t.rating.toFixed(1)}`
  })

  return `*${escapeMarkdown(categoryName)}* (page ${page + 1})\n\n${lines.join("\n")}`
}

export function latestToolsMessage(tools: {
  name: string
  slug: string
  rating: number
  pricing: string | null
}[]): string {
  if (tools.length === 0) {
    return "No latest tools found."
  }

  const lines = tools.map((t, i) => {
    const pricing = t.pricing ? `💰 ${t.pricing}` : ""
    return `${i + 1}. *${escapeMarkdown(t.name)}* ⭐ ${t.rating.toFixed(1)}${pricing ? ` • ${pricing}` : ""}`
  })

  return `*🆕 Latest AI Tools*\n\n${lines.join("\n")}`
}

export function freeToolsMessage(tools: {
  name: string
  slug: string
  rating: number
}[]): string {
  if (tools.length === 0) {
    return "No free tools found."
  }

  const lines = tools.map((t, i) => {
    return `${i + 1}. *${escapeMarkdown(t.name)}* ⭐ ${t.rating.toFixed(1)}`
  })

  return `*🆓 Free AI Tools*\n\n${lines.join("\n")}`
}

export function searchResultsMessage(query: string, tools: {
  name: string
  slug: string
  description: string | null
  rating: number
  pricing: string | null
}[]): string {
  if (tools.length === 0) {
    return `No tools found matching *${escapeMarkdown(query)}*.\n\nTry a different search term.`
  }

  const lines = tools.slice(0, 5).map((t) => {
    const rating = t.rating > 0 ? `⭐ ${t.rating.toFixed(1)}` : ""
    const pricing = t.pricing ? `💰 ${t.pricing}` : ""
    const badges = [rating, pricing].filter(Boolean).join(" • ")
    return `*${escapeMarkdown(t.name)}*\n${badges}\n${escapeMarkdown(t.description ?? "No description")}`
  })

  return `*Search results for "${escapeMarkdown(query)}"*\n\n${lines.join("\n\n")}`
}

export function compareMessage(
  tool1: { name: string; rating: number; review_count: number; pricing: string | null; description: string | null },
  tool2: { name: string; rating: number; review_count: number; pricing: string | null; description: string | null },
  fromDb: boolean
): string {
  if (!fromDb) {
    return `We don't have a saved comparison for these tools yet.\n\nVisit [LinkDit](https://linkdit.vercel.app/compare) to create your own comparison!`
  }

  return (
    `*⚖ Comparison: ${escapeMarkdown(tool1.name)} vs ${escapeMarkdown(tool2.name)}*\n\n` +
    `*${escapeMarkdown(tool1.name)}*\n` +
    `⭐ Rating: ${tool1.rating.toFixed(1)} (${tool1.review_count} reviews)\n` +
    `💰 ${tool1.pricing ?? "N/A"}\n` +
    `${escapeMarkdown(tool1.description ?? "")}\n\n` +
    `*${escapeMarkdown(tool2.name)}*\n` +
    `⭐ Rating: ${tool2.rating.toFixed(1)} (${tool2.review_count} reviews)\n` +
    `💰 ${tool2.pricing ?? "N/A"}\n` +
    `${escapeMarkdown(tool2.description ?? "")}\n\n` +
    `[View full comparison on LinkDit](https://linkdit.vercel.app/compare)`
  )
}

export function errorMessage(): string {
  return "Sorry, something went wrong. Please try again later."
}

export function rateLimitMessage(): string {
  return "⏳ You're going too fast! Please wait a moment before sending another request."
}

export function unknownCommandMessage(): string {
  return "Sorry, I didn't understand that command. Use /help to see available commands."
}

function escapeMarkdown(text: string): string {
  return text
    .replace(/_/g, "\\_")
    .replace(/\*/g, "\\*")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/~/g, "\\~")
    .replace(/`/g, "\\`")
    .replace(/>/g, "\\>")
    .replace(/#/g, "\\#")
    .replace(/\+/g, "\\+")
    .replace(/-/g, "\\-")
    .replace(/=/g, "\\=")
    .replace(/\|/g, "\\|")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\./g, "\\.")
    .replace(/!/g, "\\!")
}
