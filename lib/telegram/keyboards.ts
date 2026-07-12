import type { InlineKeyboardMarkup } from "./types"

export function startKeyboard(): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: "🔍 Find AI Tool", callback_data: "cmd:tools" },
        { text: "⚖ Compare Tools", callback_data: "cmd:compare" },
      ],
      [
        { text: "🆕 Latest AI Tools", callback_data: "cmd:latest" },
        { text: "🆓 Free AI Tools", callback_data: "cmd:free" },
      ],
      [
        { text: "🌐 Open LinkDit", url: "https://linkdit.online" },
      ],
    ],
  }
}

export function toolsKeyboard(page: number, totalPages: number): InlineKeyboardMarkup {
  const buttons: InlineKeyboardMarkup["inline_keyboard"] = []

  if (totalPages > 1) {
    const navButtons = []
    if (page > 0) navButtons.push({ text: "◀ Previous", callback_data: `page:tools:${page - 1}` })
    if (page < totalPages - 1) navButtons.push({ text: "Next ▶", callback_data: `page:tools:${page + 1}` })
    if (navButtons.length > 0) buttons.push(navButtons)
  }

  buttons.push([
    { text: "🏠 Back to Menu", callback_data: "cmd:start" },
  ])

  return { inline_keyboard: buttons }
}

export function categoriesKeyboard(categories: { name: string; slug: string }[]): InlineKeyboardMarkup {
  const rows: InlineKeyboardMarkup["inline_keyboard"] = []
  for (let i = 0; i < categories.length; i += 2) {
    const row = [
      { text: categories[i].name, callback_data: `category:${categories[i].slug}` },
    ]
    if (categories[i + 1]) {
      row.push({ text: categories[i + 1].name, callback_data: `category:${categories[i + 1].slug}` })
    }
    rows.push(row)
  }
  rows.push([{ text: "🏠 Back to Menu", callback_data: "cmd:start" }])
  return { inline_keyboard: rows }
}

export function toolActionsKeyboard(slug: string, websiteUrl: string | null): InlineKeyboardMarkup {
  const buttons: InlineKeyboardMarkup["inline_keyboard"] = [
    [
      { text: "👁 View on LinkDit", url: `https://linkdit.online/tools/${slug}` },
    ],
  ]
  if (websiteUrl) {
    buttons[0].unshift({ text: "🌐 Website", url: websiteUrl })
  }
  buttons.push([{ text: "🏠 Back to Menu", callback_data: "cmd:start" }])
  return { inline_keyboard: buttons }
}

export function compareKeyboard(): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: "🏠 Back to Menu", callback_data: "cmd:start" },
      ],
    ],
  }
}
