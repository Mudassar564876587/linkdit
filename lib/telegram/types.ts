export type TelegramUser = {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export type TelegramChat = {
  id: number
  type: "private" | "group" | "supergroup" | "channel"
  title?: string
  username?: string
}

export type TelegramMessageEntity = {
  type: string
  offset: number
  length: number
}

export type TelegramMessage = {
  message_id: number
  from?: TelegramUser
  chat: TelegramChat
  date: number
  text?: string
  entities?: TelegramMessageEntity[]
}

export type TelegramUpdate = {
  update_id: number
  message?: TelegramMessage
  callback_query?: {
    id: string
    from: TelegramUser
    message?: TelegramMessage
    data?: string
  }
}

export type SendMessageParams = {
  chat_id: number | string
  text: string
  parse_mode?: "HTML" | "Markdown" | "MarkdownV2"
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup
  disable_web_page_preview?: boolean
}

export type InlineKeyboardMarkup = {
  inline_keyboard: InlineKeyboardButton[][]
}

export type InlineKeyboardButton = {
  text: string
  url?: string
  callback_data?: string
  web_app?: { url: string }
}

export type ReplyKeyboardMarkup = {
  keyboard: ReplyKeyboardButton[][]
  resize_keyboard?: boolean
  one_time_keyboard?: boolean
}

export type ReplyKeyboardButton = {
  text: string
  request_contact?: boolean
  request_location?: boolean
}

export type BotCommand = {
  command: string
  description: string
}

export type CommandHandler = (
  chatId: number,
  args: string[],
  userId?: number
) => Promise<{ text: string; reply_markup?: InlineKeyboardMarkup } | null>

export type ToolResult = {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  rating: number
  review_count: number
  pricing: string | null
  website_url: string | null
  category_id: string | null
  categories: { name: string } | null
}
