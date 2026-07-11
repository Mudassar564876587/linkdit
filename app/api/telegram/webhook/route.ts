import { NextResponse } from "next/server"
import { processUpdate } from "@/lib/telegram/bot"
import type { TelegramUpdate } from "@/lib/telegram/types"

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const update: TelegramUpdate = await request.json()

    if (!update.update_id) {
      return NextResponse.json({ ok: false, error: "Invalid update" }, { status: 400 })
    }

    await processUpdate(update)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 })
  }
}
