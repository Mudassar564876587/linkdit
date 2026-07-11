import type { SendMessageParams } from "./types"

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set")
  return token
}

const BASE_URL = "https://api.telegram.org"

export async function sendMessage(params: SendMessageParams): Promise<{ ok: boolean; description?: string }> {
  const token = getBotToken()
  const res = await fetch(`${BASE_URL}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })
  return res.json() as Promise<{ ok: boolean; description?: string }>
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string): Promise<void> {
  const token = getBotToken()
  await fetch(`${BASE_URL}/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  })
}

export async function setWebhook(url: string): Promise<{ ok: boolean; description?: string }> {
  const token = getBotToken()
  const res = await fetch(`${BASE_URL}/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, allowed_updates: ["message", "callback_query"] }),
  })
  return res.json() as Promise<{ ok: boolean; description?: string }>
}

export async function deleteWebhook(): Promise<void> {
  const token = getBotToken()
  await fetch(`${BASE_URL}/bot${token}/deleteWebhook`, { method: "POST" })
}

export async function getWebhookInfo(): Promise<{ ok: boolean; result?: { url: string; has_custom_certificate: boolean; pending_update_count: number; last_error_date?: number; last_error_message?: string } }> {
  const token = getBotToken()
  const res = await fetch(`${BASE_URL}/bot${token}/getWebhookInfo`)
  return res.json() as Promise<{ ok: boolean; result?: { url: string; has_custom_certificate: boolean; pending_update_count: number; last_error_date?: number; last_error_message?: string } }>
}

export async function setMyCommands(commands: { command: string; description: string }[]): Promise<void> {
  const token = getBotToken()
  await fetch(`${BASE_URL}/bot${token}/setMyCommands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commands }),
  })
}
