"use server"

import { generateWithAI } from "@/lib/ai/provider"

export async function aiAutofill(websiteUrl: string) {
  try {
    new URL(websiteUrl)
  } catch {
    return { error: "Please enter a valid URL." }
  }

  if (!websiteUrl.startsWith("http://") && !websiteUrl.startsWith("https://")) {
    return { error: "URL must start with http:// or https://" }
  }

  let html: string
  try {
    const res = await fetch(websiteUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; LinkDitBot/1.0; +https://linkdit.vercel.app)",
      },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) {
      return { error: `Failed to fetch website (HTTP ${res.status}).` }
    }
    html = await res.text()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error"
    return { error: `Could not fetch website: ${msg}` }
  }

  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || ""
  const desc =
    html.match(
      /<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*\/?>/i
    )?.[1]?.trim() || ""
  const ogTitle =
    html.match(
      /<meta\s+[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*\/?>/i
    )?.[1]?.trim() || ""
  const ogDesc =
    html.match(
      /<meta\s+[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*\/?>/i
    )?.[1]?.trim() || ""
  const keywords =
    html.match(
      /<meta\s+[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["'][^>]*\/?>/i
    )?.[1]?.trim() || ""

  const jsonLdScripts = html.match(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  )
  let jsonLdText = ""
  if (jsonLdScripts) {
    jsonLdText = jsonLdScripts
      .map((s) =>
        s
          .replace(/<script[^>]*>/gi, "")
          .replace(/<\/script>/gi, "")
          .trim()
      )
      .filter(Boolean)
      .join("\n")
  }

  const bodyText = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, " ")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000)

  const contactEmail = await extractEmail(html, websiteUrl)

  const systemPrompt =
    "You are an AI assistant that extracts structured information about an AI tool from its website content. Respond ONLY with valid JSON. No markdown, no code fences, no explanation."

  const userPrompt = `Extract information about this AI tool from the website content below.

Return ONLY valid JSON with these fields:
{
  "toolName": "string (the tool name)",
  "shortDescription": "string (brief description under 200 characters)",
  "fullDescription": "string (detailed description)",
  "categoryName": "string (best matching category like AI Writing, Image Generation, Coding, etc.)",
  "pricing": "Free" | "Freemium" | "Paid",
  "contactEmail": "string (the support/contact email if visible in the content, otherwise empty string)",
  "tags": ["string", "string", ...] (5-10 relevant keywords as tags),
  "features": ["string", "string", ...] (key features, max 10),
  "pros": ["string", "string", ...] (advantages, max 5),
  "cons": ["string", "string", ...] (limitations, max 5),
  "faqs": [{"question": "string", "answer": "string"}, ...] (exactly 5 FAQs)
}

Website page title: ${title}
Meta description: ${desc}
OG title: ${ogTitle}
OG description: ${ogDesc}
Meta keywords: ${keywords}
${jsonLdText ? `Structured data: ${jsonLdText}` : ""}

Website content:
${bodyText}`

  try {
    const response = await generateWithAI(systemPrompt, userPrompt)

    let jsonStr = response.trim()
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim()
    }

    const data = JSON.parse(jsonStr)

    if (!data.toolName && !data.shortDescription) {
      return { error: "Could not identify this as an AI tool. Try a different URL." }
    }

    if (contactEmail) {
      data.contactEmail = contactEmail
    }

    return { data }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error"
    return { error: `AI processing failed: ${msg}. Check your AI_PROVIDER and API key.` }
  }
}

async function extractEmail(html: string, baseUrl: string): Promise<string> {
  const allEmails = new Map<string, boolean>()

  const mailtoRegex = /href=["']mailto:([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = mailtoRegex.exec(html)) !== null) {
    const email = m[1].toLowerCase().trim()
    if (email && isValidEmail(email)) allEmails.set(email, true)
  }

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const found = html.match(emailRegex)
  if (found) {
    for (const e of found) {
      const email = e.toLowerCase().trim()
      if (isValidEmail(email)) allEmails.set(email, true)
    }
  }

  const priorityPrefixes = ["support@", "hello@", "contact@", "team@", "info@", "founder@"]
  const pages = ["/contact", "/support", "/about"]
  for (const page of pages) {
    try {
      const url = new URL(page, baseUrl).href
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; LinkDitBot/1.0; +https://linkdit.vercel.app)",
        },
        signal: AbortSignal.timeout(5000),
      })
      if (res.ok) {
        const pageHtml = await res.text()
        const mailtoMatches = pageHtml.match(/href=["']mailto:([^"']+)["']/gi)
        if (mailtoMatches) {
          for (const match of mailtoMatches) {
            const email = match.replace(/href=["']mailto:/i, "").replace(/["']/g, "").toLowerCase().trim()
            if (email && isValidEmail(email)) allEmails.set(email, true)
          }
        }
        const emailMatches = pageHtml.match(emailRegex)
        if (emailMatches) {
          for (const e of emailMatches) {
            const email = e.toLowerCase().trim()
            if (isValidEmail(email)) allEmails.set(email, true)
          }
        }
      }
    } catch {
      // skip
    }
  }

  if (allEmails.size === 0) return ""

  const emailArr = Array.from(allEmails.keys())

  for (const prefix of priorityPrefixes) {
    const match = emailArr.find((e) => e.startsWith(prefix))
    if (match) return match
  }

  return emailArr[0]
}

function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}
