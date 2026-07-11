import type { TelegramUpdate } from "./types"
import { sendMessage, answerCallbackQuery } from "./api"
import { checkRateLimit } from "./rate-limit"
import {
  handleHelp,
  handleWebsite,
  handleTools,
  handleToolsPage,
  handleCategories,
  handleCategoryTools,
  handleLatest,
  handleFree,
  handleSearch,
  handleCompare,
  handleUnknownCommand,
  handleTextSearch,
} from "./commands"
import { startKeyboard } from "./keyboards"
import { startMessage, rateLimitMessage } from "./messages"

export async function processUpdate(update: TelegramUpdate): Promise<void> {
  try {
    if (update.message) {
      await processMessage(update.message)
    } else if (update.callback_query) {
      await processCallbackQuery(update.callback_query)
    }
  } catch (error) {
    console.error("Error processing Telegram update:", error)
    if (update.message) {
      await sendMessage({
        chat_id: update.message.chat.id,
        text: "⚠️ An internal error occurred. Please try again later.",
      }).catch(() => {})
    }
  }
}

async function processMessage(message: NonNullable<TelegramUpdate["message"]>): Promise<void> {
  const chatId = message.chat.id
  const text = message.text?.trim() ?? ""
  const firstName = message.from?.first_name ?? "User"

  if (!checkRateLimit(chatId)) {
    await sendMessage({ chat_id: chatId, text: rateLimitMessage() }).catch(() => {})
    return
  }

  if (!text) {
    await sendMessage({ chat_id: chatId, text: "Please send a text message." }).catch(() => {})
    return
  }

  const isCommand = text.startsWith("/")

  if (isCommand) {
    const [command, ...args] = text.slice(1).split(/\s+/)
    await handleCommand(chatId, command.toLowerCase(), args)
    return
  }

  const searchResult = await handleTextSearch(text)
  if (searchResult) {
    await sendMessage({ chat_id: chatId, ...searchResult, parse_mode: "Markdown" }).catch(() => {})
    return
  }

  await sendMessage({
    chat_id: chatId,
    text: startMessage(firstName),
    parse_mode: "Markdown",
    reply_markup: startKeyboard(),
  }).catch(() => {})
}

async function handleCommand(chatId: number, command: string, args: string[]): Promise<void> {
  let result: { text: string; reply_markup?: any } | null = null

  switch (command) {
    case "start":
      await sendMessage({
        chat_id: chatId,
        text: startMessage("there"),
        parse_mode: "Markdown",
        reply_markup: startKeyboard(),
      }).catch(() => {})
      return

    case "help":
      result = await handleHelp(chatId, args)
      break

    case "website":
      result = await handleWebsite(chatId, args)
      break

    case "tools":
      result = await handleTools(chatId, args)
      break

    case "categories":
      result = await handleCategories(chatId, args)
      break

    case "latest":
      result = await handleLatest(chatId, args)
      break

    case "free":
      result = await handleFree(chatId, args)
      break

    case "search":
      result = await handleSearch(chatId, args)
      break

    case "compare":
      result = await handleCompare(chatId, args)
      break

    default:
      result = handleUnknownCommand(command)
  }

  if (result) {
    await sendMessage({ chat_id: chatId, ...result, parse_mode: "Markdown" }).catch(() => {})
  }
}

async function processCallbackQuery(callbackQuery: NonNullable<TelegramUpdate["callback_query"]>): Promise<void> {
  const chatId = callbackQuery.message?.chat.id
  const data = callbackQuery.data ?? ""
  const callbackId = callbackQuery.id

  if (!chatId) return

  if (!checkRateLimit(chatId)) {
    await answerCallbackQuery(callbackId, "⏳ Please slow down!").catch(() => {})
    return
  }

  await answerCallbackQuery(callbackId).catch(() => {})

  if (data.startsWith("cmd:")) {
    const command = data.replace("cmd:", "")
    const args: string[] = []

    switch (command) {
      case "start":
        await sendMessage({
          chat_id: chatId,
          text: startMessage(callbackQuery.from.first_name),
          parse_mode: "Markdown",
          reply_markup: startKeyboard(),
        }).catch(() => {})
        return

      case "tools":
        await handleCommand(chatId, "tools", [])
        return

      case "categories":
        await handleCommand(chatId, "categories", [])
        return

      case "latest":
        await handleCommand(chatId, "latest", [])
        return

      case "free":
        await handleCommand(chatId, "free", [])
        return

      case "compare":
        await sendMessage({
          chat_id: chatId,
          text: "Type /compare <tool1> vs <tool2>\n\nExample: /compare ChatGPT vs Claude",
        }).catch(() => {})
        return
    }
  }

  if (data.startsWith("page:tools:")) {
    const page = parseInt(data.replace("page:tools:", ""), 10)
    if (isNaN(page)) return

    const result = await handleToolsPage(chatId, page)
    if (result) {
      await sendMessage({ chat_id: chatId, ...result, parse_mode: "Markdown" }).catch(() => {})
    }
    return
  }

  if (data.startsWith("category:")) {
    const slug = data.replace("category:", "")
    const result = await handleCategoryTools(chatId, [slug])
    if (result) {
      await sendMessage({ chat_id: chatId, ...result, parse_mode: "Markdown" }).catch(() => {})
    }
    return
  }
}
