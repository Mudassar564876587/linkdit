import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { startKeyboard } from "@/lib/telegram/keyboards"
import { startMessage, helpMessage, websiteMessage } from "@/lib/telegram/messages"
import {
  handleTools,
  handleToolsPage,
  handleCategories,
  handleCategoryTools,
  handleLatest,
  handleFree,
  handleSearch,
  handleCompare,
  handleTextSearch,
} from "@/lib/telegram/commands"

export type ButtonRow = {
  text: string
  value: string
  url?: string
}

export type ChatResponse = {
  text: string
  buttons?: ButtonRow[][]
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { message, callbackData } = await request.json() as {
      message?: string
      callbackData?: string
    }

    if (!message && !callbackData) {
      return NextResponse.json({ text: "Please send a message." } satisfies ChatResponse)
    }

    let result: { text: string; buttons?: ButtonRow[][] } | null = null

    if (callbackData) {
      result = await handleCallback(callbackData)
    } else if (message) {
      const text = message.trim()
      const isCommand = text.startsWith("/")

      if (isCommand) {
        const [command, ...args] = text.slice(1).split(/\s+/)
        result = await handleWebCommand(command.toLowerCase(), args)
      } else {
        const searchResult = await handleTextSearch(text)
        if (searchResult) {
          result = {
            text: searchResult.text,
            buttons: searchResult.reply_markup
              ? convertKeyboard(searchResult.reply_markup.inline_keyboard)
              : undefined,
          }
        } else {
          result = {
            text: startMessage("there"),
            buttons: convertKeyboard(startKeyboard().inline_keyboard),
          }
        }
      }
    }

    if (!result) {
      result = {
        text: "Welcome to LinkDit AI Assistant! How can I help you?",
        buttons: convertKeyboard(startKeyboard().inline_keyboard),
      }
    }

    return NextResponse.json(result satisfies ChatResponse)
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { text: "Sorry, something went wrong. Please try again." } satisfies ChatResponse,
      { status: 500 }
    )
  }
}

async function handleWebCommand(command: string, args: string[]): Promise<{ text: string; buttons?: ButtonRow[][] } | null> {
  switch (command) {
    case "start": {
      const reply_markup = startKeyboard()
      return {
        text: startMessage("there"),
        buttons: convertKeyboard(reply_markup.inline_keyboard),
      }
    }

    case "help":
      return { text: helpMessage() }

    case "website":
      return { text: websiteMessage() }

    case "tools": {
      const result = await handleTools(0, [])
      if (!result) return null
      return {
        text: result.text,
        buttons: result.reply_markup
          ? convertKeyboard(result.reply_markup.inline_keyboard)
          : undefined,
      }
    }

    case "categories": {
      const result = await handleCategories(0, [])
      if (!result) return null
      return {
        text: result.text,
        buttons: result.reply_markup
          ? convertKeyboard(result.reply_markup.inline_keyboard)
          : undefined,
      }
    }

    case "latest": {
      const result = await handleLatest(0, [])
      if (!result) return null
      return { text: result.text }
    }

    case "free": {
      const result = await handleFree(0, [])
      if (!result) return null
      return { text: result.text }
    }

    case "search": {
      const result = await handleSearch(0, args)
      if (!result) return null
      return { text: result.text }
    }

    case "compare": {
      const result = await handleCompare(0, args)
      if (!result) return null
      return {
        text: result.text,
        buttons: result.reply_markup
          ? convertKeyboard(result.reply_markup.inline_keyboard)
          : undefined,
      }
    }

    default:
      return {
        text: "Unknown command. Try /help to see available commands.",
      }
  }
}

async function handleCallback(data: string): Promise<{ text: string; buttons?: ButtonRow[][] } | null> {
  if (data.startsWith("cmd:")) {
    const cmd = data.slice(4)
    switch (cmd) {
      case "start": {
        const reply_markup = startKeyboard()
        return {
          text: startMessage("there"),
          buttons: convertKeyboard(reply_markup.inline_keyboard),
        }
      }
      case "tools": {
        const result = await handleTools(0, [])
        if (!result) return null
        return {
          text: result.text,
          buttons: result.reply_markup
            ? convertKeyboard(result.reply_markup.inline_keyboard)
            : undefined,
        }
      }
      case "categories": {
        const result = await handleCategories(0, [])
        if (!result) return null
        return {
          text: result.text,
          buttons: result.reply_markup
            ? convertKeyboard(result.reply_markup.inline_keyboard)
            : undefined,
        }
      }
      case "latest": {
        const result = await handleLatest(0, [])
        if (!result) return null
        return { text: result.text }
      }
      case "free": {
        const result = await handleFree(0, [])
        if (!result) return null
        return { text: result.text }
      }
      case "compare":
        return { text: "Type /compare <tool1> vs <tool2>\n\nExample: /compare ChatGPT vs Claude" }
      default:
        return null
    }
  }

  if (data.startsWith("page:tools:")) {
    const page = parseInt(data.slice(11), 10)
    if (isNaN(page)) return null
    const result = await handleToolsPage(0, page)
    if (!result) return null
    return {
      text: result.text,
      buttons: result.reply_markup
        ? convertKeyboard(result.reply_markup.inline_keyboard)
        : undefined,
    }
  }

  if (data.startsWith("category:")) {
    const slug = data.slice(9)
    const result = await handleCategoryTools(0, [slug])
    if (!result) return null
    return {
      text: result.text,
      buttons: result.reply_markup
        ? convertKeyboard(result.reply_markup.inline_keyboard)
        : undefined,
    }
  }

  return null
}

function convertKeyboard(
  inlineKeyboard: { text: string; url?: string; callback_data?: string }[][]
): ButtonRow[][] {
  return inlineKeyboard.map((row) =>
    row.map((btn) => ({
      text: btn.text,
      value: btn.callback_data ?? btn.url ?? "",
      url: btn.url,
    }))
  )
}
