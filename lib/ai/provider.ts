const AI_PROVIDER = process.env.AI_PROVIDER || "openai"
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "gpt-4o"

export async function generateWithAI(systemPrompt: string, userPrompt: string): Promise<string> {
  switch (AI_PROVIDER) {
    case "openai":
      return callOpenAI(systemPrompt, userPrompt)
    case "gemini":
      return callGemini(systemPrompt, userPrompt)
    case "openrouter":
      return callOpenRouter(systemPrompt, userPrompt)
    default:
      throw new Error(
        `Unknown AI_PROVIDER: "${AI_PROVIDER}". Use "openai", "gemini", or "openrouter".`
      )
  }
}

async function callOpenAI(system: string, user: string): Promise<string> {
  if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY environment variable is not set.")
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.3,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error (${res.status}): ${err}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ""
}

async function callGemini(system: string, user: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY environment variable is not set.")
  const models = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.0-flash"]
  let lastError: Error | null = null
  for (const model of models) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `${system}\n\n${user}` }] }],
          generationConfig: { temperature: 0.3 },
        }),
      }
    )
    if (res.ok) {
      const data = await res.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text || ""
    }
    const errText = await res.text()
    lastError = new Error(`Gemini API error (${res.status}) on ${model}: ${errText}`)
    if (res.status !== 429 && res.status !== 503) break
  }
  throw lastError || new Error("Gemini API error: all models failed.")
}

async function callOpenRouter(system: string, user: string): Promise<string> {
  if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY environment variable is not set.")
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.3,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter API error (${res.status}): ${err}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ""
}
