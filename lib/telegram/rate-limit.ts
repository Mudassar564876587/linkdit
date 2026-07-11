const rateLimitStore = new Map<number, { count: number; resetAt: number }>()

const WINDOW_MS = 60_000
const MAX_REQUESTS = 20

export function checkRateLimit(chatId: number): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(chatId)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(chatId, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (entry.count >= MAX_REQUESTS) {
    return false
  }

  entry.count++
  return true
}

setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}, 60_000)
