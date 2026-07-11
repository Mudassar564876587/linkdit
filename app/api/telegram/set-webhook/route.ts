import { NextResponse } from "next/server"
import { setWebhook, getWebhookInfo, setMyCommands } from "@/lib/telegram/api"

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN
    if (!token) {
      return NextResponse.json({ ok: false, error: "TELEGRAM_BOT_TOKEN is not set" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (url) {
      const webhookResult = await setWebhook(url)

      if (webhookResult.ok) {
        await setMyCommands([
          { command: "start", description: "Start the bot and see the menu" },
          { command: "help", description: "Show available commands" },
          { command: "tools", description: "Browse all AI tools" },
          { command: "categories", description: "Browse tools by category" },
          { command: "latest", description: "Latest AI tools" },
          { command: "free", description: "Free AI tools" },
          { command: "search", description: "Search for a tool" },
          { command: "compare", description: "Compare two tools (e.g., /compare ChatGPT vs Claude)" },
          { command: "website", description: "Open LinkDit website" },
        ])
      }

      return NextResponse.json(webhookResult)
    }

    const info = await getWebhookInfo()
    return NextResponse.json(info)
  } catch (error) {
    console.error("set-webhook error:", error)
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 })
  }
}
