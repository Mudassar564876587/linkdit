import type { InlineKeyboardMarkup, CommandHandler } from "./types"
import { getAdminClient } from "@/lib/supabase/admin"
import {
  startKeyboard,
  toolsKeyboard,
  categoriesKeyboard,
  toolActionsKeyboard,
  compareKeyboard,
} from "./keyboards"
import {
  startMessage,
  helpMessage,
  websiteMessage,
  toolsMessage,
  categoriesMessage,
  categoryToolsMessage,
  latestToolsMessage,
  freeToolsMessage,
  searchResultsMessage,
  compareMessage,
  unknownCommandMessage,
} from "./messages"

const PAGE_SIZE = 10

export const handleStart: CommandHandler = async (chatId, _args, _userId) => {
  return null
}

export const handleHelp: CommandHandler = async () => {
  return { text: helpMessage() }
}

export const handleWebsite: CommandHandler = async () => {
  return { text: websiteMessage() }
}

export const handleTools: CommandHandler = async (_chatId, _args, _userId) => {
  const supabase = getAdminClient()
  const { data: tools, error } = await supabase
    .from("tools")
    .select("name, slug, description, rating, pricing, website_url, category_id")
    .eq("is_published", true)
    .order("rating", { ascending: false })
    .limit(PAGE_SIZE)

  if (error || !tools || tools.length === 0) {
    return { text: "No tools found.", reply_markup: startKeyboard() }
  }

  const totalCount = await getToolsCount(supabase)
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return {
    text: toolsMessage(tools, 0, totalCount),
    reply_markup: toolsKeyboard(0, totalPages),
  }
}

export async function handleToolsPage(chatId: number, page: number): Promise<{ text: string; reply_markup?: InlineKeyboardMarkup } | null> {
  const supabase = getAdminClient()
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data: tools, error } = await supabase
    .from("tools")
    .select("name, slug, description, rating, pricing, website_url, category_id")
    .eq("is_published", true)
    .order("rating", { ascending: false })
    .range(from, to)

  if (error || !tools || tools.length === 0) {
    return { text: "No tools found.", reply_markup: startKeyboard() }
  }

  const totalCount = await getToolsCount(supabase)
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return {
    text: toolsMessage(tools, page, totalCount),
    reply_markup: toolsKeyboard(page, totalPages),
  }
}

export const handleCategories: CommandHandler = async () => {
  const supabase = getAdminClient()
  const { data: categories, error } = await supabase
    .from("categories")
    .select("name, slug")
    .order("name", { ascending: true })

  if (error || !categories || categories.length === 0) {
    return { text: "No categories found.", reply_markup: startKeyboard() }
  }

  return {
    text: categoriesMessage(categories),
    reply_markup: categoriesKeyboard(categories),
  }
}

export const handleCategoryTools: CommandHandler = async (_chatId, args) => {
  const slug = args[0]
  if (!slug) return { text: "Please specify a category.", reply_markup: startKeyboard() }

  const supabase = getAdminClient()

  const { data: category } = await supabase
    .from("categories")
    .select("id, name")
    .eq("slug", slug)
    .single()

  if (!category) {
    return { text: "Category not found.", reply_markup: startKeyboard() }
  }

  const { data: tools, error } = await supabase
    .from("tools")
    .select("name, slug, rating, pricing, description, website_url")
    .eq("is_published", true)
    .eq("category_id", category.id)
    .order("rating", { ascending: false })
    .limit(PAGE_SIZE)

  if (error || !tools || tools.length === 0) {
    return { text: `No tools found in ${category.name}.` }
  }

  return {
    text: categoryToolsMessage(category.name, tools, 0),
    reply_markup: categoriesKeyboard([]),
  }
}

export const handleLatest: CommandHandler = async () => {
  const supabase = getAdminClient()
  const { data: tools, error } = await supabase
    .from("tools")
    .select("name, slug, rating, pricing, description, website_url")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(10)

  if (error || !tools || tools.length === 0) {
    return { text: "No latest tools found.", reply_markup: startKeyboard() }
  }

  return { text: latestToolsMessage(tools) }
}

export const handleFree: CommandHandler = async () => {
  const supabase = getAdminClient()
  const { data: tools, error } = await supabase
    .from("tools")
    .select("name, slug, rating, pricing, description, website_url")
    .eq("is_published", true)
    .eq("pricing", "Free")
    .order("rating", { ascending: false })
    .limit(10)

  if (error || !tools || tools.length === 0) {
    return { text: "No free tools found.", reply_markup: startKeyboard() }
  }

  return { text: freeToolsMessage(tools) }
}

export const handleSearch: CommandHandler = async (_chatId, args) => {
  const query = args.join(" ").trim()
  if (!query) {
    return { text: "Please provide a search term.\n\nExample: /search ChatGPT" }
  }

  const supabase = getAdminClient()
  const { data: tools, error } = await supabase
    .from("tools")
    .select("name, slug, description, rating, pricing, website_url")
    .eq("is_published", true)
    .ilike("name", `%${query}%`)
    .order("rating", { ascending: false })
    .limit(5)

  if (error || !tools || tools.length === 0) {
    const { data: descTools } = await supabase
      .from("tools")
      .select("name, slug, description, rating, pricing, website_url")
      .eq("is_published", true)
      .ilike("description", `%${query}%`)
      .order("rating", { ascending: false })
      .limit(5)

    if (!descTools || descTools.length === 0) {
      return { text: searchResultsMessage(query, []) }
    }

    return { text: searchResultsMessage(query, descTools) }
  }

  return { text: searchResultsMessage(query, tools) }
}

export const handleCompare: CommandHandler = async (_chatId, args) => {
  const text = args.join(" ")
  const parts = text.split(/\s+vs\s+/i)

  if (parts.length < 2 || !parts[0].trim() || !parts[1].trim()) {
    return { text: "Please specify two tools to compare.\n\nExample: /compare ChatGPT vs Claude" }
  }

  const tool1Name = parts[0].trim()
  const tool2Name = parts[1].trim()

  const supabase = getAdminClient()

  const [tool1Result, tool2Result] = await Promise.all([
    supabase
      .from("tools")
      .select("name, rating, review_count, pricing, description")
      .eq("is_published", true)
      .ilike("name", tool1Name)
      .limit(1)
      .maybeSingle(),
    supabase
      .from("tools")
      .select("name, rating, review_count, pricing, description")
      .eq("is_published", true)
      .ilike("name", tool2Name)
      .limit(1)
      .maybeSingle(),
  ])

  if (!tool1Result.data || !tool2Result.data) {
    return {
      text: compareMessage(
        { name: tool1Name, rating: 0, review_count: 0, pricing: null, description: null },
        { name: tool2Name, rating: 0, review_count: 0, pricing: null, description: null },
        false
      ),
      reply_markup: compareKeyboard(),
    }
  }

  return {
    text: compareMessage(tool1Result.data, tool2Result.data, true),
    reply_markup: compareKeyboard(),
  }
}

export function handleToolAction(slug: string, websiteUrl: string | null): { text: string; reply_markup: InlineKeyboardMarkup } {
  return {
    text: `What would you like to do with this tool?`,
    reply_markup: toolActionsKeyboard(slug, websiteUrl),
  }
}

async function getToolsCount(supabase: ReturnType<typeof getAdminClient>): Promise<number> {
  const { count } = await supabase
    .from("tools")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true)

  return count ?? 0
}

export function handleUnknownCommand(text: string): { text: string } {
  return { text: unknownCommandMessage() }
}

export async function handleTextSearch(text: string): Promise<{ text: string; reply_markup?: InlineKeyboardMarkup } | null> {
  const supabase = getAdminClient()
  const { data: tools, error } = await supabase
    .from("tools")
    .select("name, slug, description, rating, pricing, website_url")
    .eq("is_published", true)
    .ilike("name", `%${text}%`)
    .order("rating", { ascending: false })
    .limit(5)

  if (error || !tools || tools.length === 0) {
    return null
  }

  return { text: searchResultsMessage(text, tools) }
}
