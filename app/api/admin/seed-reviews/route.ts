import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"

const sampleReviews = [
  { rating: 5, title: "Excellent tool for professionals", content: "I've been using this tool for months and it has completely transformed my workflow. Highly recommend it to anyone looking to boost productivity.", pros: ["Easy to use", "Great features", "Excellent support"], cons: ["Could be cheaper"] },
  { rating: 4, title: "Great features, minor drawbacks", content: "Overall a solid tool with great capabilities. A few areas could be improved but definitely worth trying.", pros: ["Powerful features", "Good UI"], cons: ["Learning curve", "Premium pricing"] },
  { rating: 5, title: "Game changer for our team", content: "Our team adopted this tool and saw immediate improvements in efficiency. The AI features are outstanding.", pros: ["AI features", "Team collaboration", "Fast"], cons: ["None so far"] },
  { rating: 4, title: "Good value for money", content: "Compared to alternatives, this offers great value. The free tier is generous and paid plans are reasonable.", pros: ["Affordable", "Regular updates"], cons: ["Missing some advanced features"] },
  { rating: 3, title: "Decent but room for improvement", content: "It does the job but there are better alternatives available. Support response time could be faster.", pros: ["Works as advertised", "Clean interface"], cons: ["Slow support", "Limited integrations"] },
]

async function seed() {
  const userSupabase = await createServerSupabaseClient()
  const { data: { user } } = await userSupabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { data: adminUser } = await userSupabase.from("users").select("role").eq("id", user.id).single()
  if (adminUser?.role !== "admin") return { error: "Permission denied." }

  const admin = getAdminClient()

  const { data: tools } = await admin.from("tools").select("id, name")
  if (!tools || tools.length === 0) return { error: "No tools found." }

  const { data: existing } = await admin.from("reviews").select("tool_id").not("tool_id", "is", null)
  const existingIds = new Set(existing?.map((r: any) => r.tool_id) ?? [])

  let inserted = 0
  let skipped = 0

  for (const tool of tools) {
    if (existingIds.has(tool.id)) { skipped++; continue }

    const count = 2 + Math.floor(Math.random() * 3)
    const selected = [...sampleReviews].sort(() => Math.random() - 0.5).slice(0, count)

    for (const review of selected) {
      const { error } = await admin.from("reviews").insert({
        tool_id: tool.id,
        user_id: user.id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        pros: review.pros,
        cons: review.cons,
        is_approved: true,
      })
      if (!error) inserted++
    }
  }

  return { inserted, skipped, total: tools.length }
}

export async function GET() {
  const result = await seed()
  if (result.error) {
    const html = `<html><body><h2>Error: ${result.error}</h2>
<p>Login to admin panel first, then visit this URL again.</p>
<a href="/linkdit-studio-8k92">Go to Admin Panel</a></body></html>`
    return new NextResponse(html, { headers: { "content-type": "text/html" } })
  }

  const html = `<html><body>
<h2>Reviews Seeded!</h2>
<p>Inserted: ${result.inserted}</p>
<p>Skipped (already had reviews): ${result.skipped}</p>
<p>Total tools: ${result.total}</p>
<a href="/tools">View Tools</a>
</body></html>`
  return new NextResponse(html, { headers: { "content-type": "text/html" } })
}
