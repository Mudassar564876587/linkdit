export async function generateWithAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const provider = process.env.AI_PROVIDER || "gemini"

  if (provider !== "gemini") {
    throw new Error(
      `Unknown AI_PROVIDER: "${provider}". Set AI_PROVIDER=gemini in your environment variables.`
    )
  }

  return callGemini(systemPrompt, userPrompt)
}

async function callGemini(system: string, user: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is not set.")

  const models = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.0-flash"]
  let lastError: Error | null = null

  for (const model of models) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
