// Seed 100+ unique reviews per AI tool (6800+ total)
// Run: node scripts/seed-reviews-massive.mjs

import { createClient } from "@supabase/supabase-js"
import { randomUUID } from "crypto"

const supabaseUrl = "https://voavwcfvnviwtweyeeej.supabase.co"
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvYXZ3Y2Z2bnZpd3R3ZXllZWVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzE0MDE1NSwiZXhwIjoyMDk4NzE2MTU1fQ.Me1f_XpDHhChfcUYcp6c5s3ZwE5U6F5WFikPqVEroXs"

const supabase = createClient(supabaseUrl, serviceRoleKey)

// ── Helpers ──────────────────────────────────────────────────
function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN(arr, n) {
  return shuffle(arr).slice(0, n)
}

// ── 200+ Unique First Names from 20+ Countries ──────────────
const FIRST_NAMES = [
  "Michael", "James", "Robert", "John", "David", "William", "Richard", "Joseph", "Thomas", "Christopher",
  "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kenneth",
  "Kevin", "Brian", "George", "Timothy", "Ronald", "Edward", "Jason", "Jeffrey", "Ryan", "Jacob",
  "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon", "Benjamin",
  "Samuel", "Raymond", "Gregory", "Frank", "Alexander", "Patrick", "Jack", "Dennis", "Jerry", "Tyler",
  "Aaron", "Jose", "Nathan", "Henry", "Douglas", "Peter", "Adam", "Zachary", "Walter", "Kyle",
  "Carl", "Arthur", "Gerald", "Roger", "Keith", "Lawrence", "Jeremy", "Albert", "Willie", "Billy",
  "Emma", "Olivia", "Ava", "Isabella", "Sophia", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn",
  "Abigail", "Emily", "Ella", "Elizabeth", "Camila", "Luna", "Sofia", "Avery", "Mila", "Aria",
  "Scarlett", "Penelope", "Layla", "Chloe", "Victoria", "Madison", "Eleanor", "Grace", "Nora", "Riley",
  "Zoey", "Hannah", "Hazel", "Lily", "Lillian", "Aurora", "Savannah", "Audrey", "Brooklyn", "Bella",
  "Claire", "Skylar", "Lucy", "Paisley", "Anna", "Caroline", "Genesis", "Aaliyah", "Kennedy", "Kinsley",
  "Liam", "Oliver", "Noah", "Elijah", "Lucas", "Mason", "Logan", "Ethan", "James", "Sebastian",
  "Mateo", "Levi", "Leo", "Jack", "Owen", "Henry", "Wyatt", "Gabriel", "Julian", "Isaiah",
  "Ryan", "Josiah", "Miles", "Ezra", "Micah", "Carson", "Cole", "Braxton", "Hunter", "Damian",
]

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
  "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
  "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes",
  "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper",
  "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
  "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
  "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez",
]

const COUNTRIES = [
  "USA", "USA", "USA", "USA", "USA", "UK", "UK", "UK", "Canada", "Canada",
  "Germany", "Germany", "France", "France", "Spain", "Italy", "Netherlands", "Sweden",
  "India", "India", "India", "Pakistan", "UAE", "Australia", "Japan", "South Korea",
  "Singapore", "Brazil", "Brazil", "Mexico", "Russia", "Nigeria", "Egypt", "Kenya",
  "China", "Philippines", "Vietnam", "Indonesia", "Turkey", "Poland", "Denmark", "Norway",
  "Switzerland", "Austria", "Belgium", "Portugal", "Greece", "Ireland", "Scotland", "Wales",
  "New Zealand", "South Africa", "Argentina", "Chile", "Colombia", "Peru", "Thailand", "Malaysia",
]

// ── Title templates for huge variety ─────────────────────────
function makeTitle(toolName) {
  const prefixes = [
    "Honest Review of", "My Experience with", "Why I Love", "Why I Switched to",
    "A Deep Dive into", "Everything You Need to Know About", "Getting Started with",
    "How to Master", "The Complete Guide to", "Why Every Team Needs",
    "Is Worth It?", "After 6 Months with", "3 Months Using",
    "Real Talk About", "An Expert Look at", "First Impressions of",
    "Daily Driver:", "My Go-To Tool:", "Finally Found:",
    "The Truth About", "Unbiased Review of", "Detailed Look at",
    "What Nobody Tells You About", "Don't Buy Before Reading This:",
    "I Tried for 30 Days", "worth every penny:",
    "Why I Left for", "Comparing Tools:",
    "Enterprise Review of", "For Freelancers:",
  ]
  const suffixes = [
    "– A Practical Review", "– Pros and Cons", "– 2026 Edition",
    "– What You Need to Know", "– The Good, The Bad, The Verdict",
    "– An Honest Take", "– Full Breakdown",
    "– Is It the Best?", "– Should You Use It?",
    "– Complete Analysis", "– My Verdict",
    "", "", "", "", "", "", "", "", "",
  ]
  const patterns = [
    () => `${pick(prefixes)} ${toolName}`,
    () => `${toolName}: ${pick(["A Comprehensive Review", "The Good and Bad", "My Honest Opinion", "What I Learned", "Why It Works for Me", "Features, Pricing, Verdict"])}`,
    () => `${pick(prefixes)} ${toolName} ${pick(suffixes)}`.replace(/\s+/g, " ").trim(),
    () => `From ${pick(["Skeptic", "Fanboy", "Newbie", "Power User", "Developer", "Designer"])} to ${pick(["Believer", "Advocate", "Expert", "Daily User"])}: My ${toolName} Journey`,
    () => `${pick(["5 Reasons", "10 Things", "3 Ways", "7 Features"])} ${toolName} ${pick(["Wins", "Excels", "Delivers", "Surprises", "Stands Out"])}`,
    () => `${pick(["How", "Why"])} ${toolName} ${pick(["Changed My Workflow", "Saved My Sanity", "Boosted My Productivity", "Transformed My Business", "Became Essential"])}`,
    () => `${pick(["The", "A"])} ${pick(["Developer", "Designer", "Writer", "Marketer", "Student", "Founder", "Freelancer"])}'s Take on ${toolName}`,
  ]
  return pick(patterns)()
}

// ── Review body generator ────────────────────────────────────
const OPENERS = [
  "I've been using this tool daily for the past few months and I'm honestly impressed.",
  "After testing several alternatives, I finally settled on this one.",
  "I'll be straightforward: this tool exceeded my expectations.",
  "I was skeptical at first, but decided to give it a try.",
  "A colleague recommended this to me and I'm glad they did.",
  "I've spent considerable time evaluating this and here's my verdict.",
  "Let me share my honest experience with this tool.",
  "I've tried dozens of similar tools, but this one stands out.",
  "When I first started using this, I wasn't sure what to expect.",
  "After extensive use across multiple projects, I can give a thorough review.",
  "I needed a solution for my workflow and this delivered.",
  "This tool came highly recommended, so I decided to test it.",
  "I've been in the industry for years and this is genuinely impressive.",
  "My team adopted this recently and here's what we discovered.",
  "I was looking for something specific and this tool fit the bill perfectly.",
  "Going in with an open mind, I put this through its paces.",
  "I've used this for both personal and professional projects.",
  "This tool has been on my radar for a while, so I finally tested it.",
  "I run a small business and this tool has been a game changer.",
  "As a freelancer, I need tools that work. Here's my take on this one.",
  "I've been testing AI tools extensively and this one caught my attention.",
  "My first reaction was positive, and after deep use, it only got better.",
  "I bought into the hype and was pleasantly surprised.",
  "I didn't expect much, but this tool proved me wrong.",
  "Here's my detailed experience after putting this through real-world use.",
]

const MIDDLES = [
  "The interface is clean and intuitive, making it easy to get started right away.",
  "Setup was straightforward and I was productive within minutes.",
  "The learning curve is gentle enough for beginners but has depth for power users.",
  "Performance has been consistently reliable with fast response times.",
  "The quality of output is impressive and often requires minimal editing.",
  "Customer support has been responsive whenever I've had questions.",
  "The regular updates show the team is committed to improving the product.",
  "Integration with my existing tools was seamless and well-documented.",
  "The pricing is reasonable considering the value it provides.",
  "What sets it apart is the attention to detail in the user experience.",
  "The AI model handles complex tasks with surprising accuracy.",
  "I particularly appreciate how well it handles nuanced requests.",
  "The documentation is thorough and includes helpful examples.",
  "Collaboration features work well for team projects.",
  "The API is robust and well-designed for custom integrations.",
  "I was impressed by how quickly it processes large amounts of data.",
  "The customization options allow me to tailor it to my specific needs.",
  "It handles multiple languages surprisingly well.",
  "The mobile experience is polished and functional.",
  "Export options cover all the formats I typically need.",
  "The template system saves hours of repetitive work.",
  "Batch processing capabilities are excellent for bulk tasks.",
  "The search functionality is fast and accurate.",
  "Version history and undo features give peace of mind.",
  "The analytics dashboard provides useful insights into my usage.",
  "Keyboard shortcuts and power user features make frequent tasks faster.",
  "The community forum is active and helpful.",
  "Onboarding tutorials helped me get up to speed quickly.",
  "The free tier is generous enough for meaningful evaluation.",
  "Security features meet enterprise standards without being cumbersome.",
]

const ENDERS = [
  "Overall, I highly recommend giving this tool a try.",
  "I'll continue using this and look forward to future updates.",
  "It has become an essential part of my daily toolkit.",
  "I've already recommended it to several colleagues.",
  "While not perfect, the strengths far outweigh the weaknesses.",
  "For the price point, this offers exceptional value.",
  "I'm glad I made the switch and don't see myself going back.",
  "It's earned a permanent spot in my workflow.",
  "Worth every penny for the productivity gains alone.",
  "I'd give it a solid recommendation for most use cases.",
  "The team behind this clearly cares about quality.",
  "I'm excited to see how this evolves over time.",
  "It solved problems I didn't even know I had.",
  "My only regret is not trying it sooner.",
  "This is the standard I now measure other tools against.",
  "A worthy investment for anyone serious about their work.",
  "I'll be upgrading to a higher tier soon.",
  "It does exactly what it promises, and that's refreshing.",
  "The ROI has been significant for my business.",
  "I'm confident this tool will only get better with time.",
]

const SPECIFIC_PRAISE = [
  "The accuracy of the AI is remarkable across different use cases.",
  "I love how the tool adapts to my workflow over time.",
  "The speed improvements over competitors are noticeable.",
  "Batch operations save me hours every week.",
  "The customization depth is exactly what power users need.",
  "Template sharing across my team has been a huge win.",
  "The AI rarely misunderstands context, which is impressive.",
  "Real-time collaboration features work flawlessly.",
  "The export quality is consistently high.",
  "Integration with Slack and other tools is smooth.",
  "I appreciate the thoughtful keyboard shortcut system.",
  "The dark mode is well-implemented and easy on the eyes.",
  "Automatic saves have saved me more than once.",
  "The responsive design works great on all my devices.",
  "Multi-language support is surprisingly robust.",
  "The AI suggestion quality keeps improving with each update.",
  "Version comparison tools make reviewing changes easy.",
  "The smart folder system keeps everything organized.",
  "I love the inline editing capabilities.",
  "The focus mode helps me concentrate on complex tasks.",
]

const SPECIFIC_CRITICISM = [
  "Sometimes the tool slows down during peak hours.",
  "The mobile app could use more features.",
  "Advanced features require a higher-tier subscription.",
  "Some integrations feel less polished than others.",
  "The learning curve for advanced features is steep.",
  "Occasional bugs slip through in new updates.",
  "Customer support can be slow during weekends.",
  "The export options could be more diverse.",
  "Some UI elements feel dated compared to competitors.",
  "The free tier is quite limited for serious use.",
  "Setup for enterprise deployment was more complex than expected.",
  "I wish there were more template options.",
  "The search could be more sophisticated.",
  "Notification settings could be more granular.",
  "File size limits on the basic plan are restrictive.",
  "Some features are buried in deep menus.",
  "The pricing jump between tiers feels steep.",
  "Documentation for advanced features could be better.",
  "Offline mode is missing or limited.",
  "The onboarding could be more interactive.",
]

function generateBody(toolName, toolSlug) {
  const style = Math.random()
  if (style < 0.3) {
    const mid = pick(MIDDLES)
    const ender = pick(ENDERS)
    return `${pick(OPENERS)} ${mid} ${ender}`
  } else if (style < 0.6) {
    const praise = pick(SPECIFIC_PRAISE)
    const criticism = pick(SPECIFIC_CRITICISM)
    const mid = pick(MIDDLES)
    return `${pick(OPENERS)} ${mid} ${praise} On the flip side, ${criticism.toLowerCase()} ${pick(ENDERS)}`
  } else {
    const parts = [
      pick(OPENERS),
      pick(MIDDLES),
      pick(SPECIFIC_PRAISE),
      pick(SPECIFIC_CRITICISM),
      pick(ENDERS),
    ]
    return parts.join(" ")
  }
}

// ── Pros/Cons generator ──────────────────────────────────────
const PROS_POOL = [
  "Excellent output quality", "Fast performance", "Clean interface", "Great value for money",
  "Reliable uptime", "Easy to learn", "Powerful features", "Regular updates",
  "Good documentation", "Responsive customer support", "Active community", "Stable API",
  "Intuitive design", "Consistent results", "Good integrations", "High accuracy",
  "Fast response times", "Affordable pricing", "Regular improvements", "User-friendly interface",
  "Quality AI models", "Good onboarding", "Seamless collaboration", "Robust security",
  "Excellent uptime", "Multi-language support", "Good mobile app", "Excellent templates",
  "Great customization", "Smart suggestions", "Efficient workflow", "Time-saving features",
  "Professional output", "Scalable for teams", "Good analytics", "Reliable exports",
  "Fast search", "Good version history", "Excellent shortcuts", "Responsive design",
  "Generous free tier", "Clear pricing", "Good API docs", "Regular bug fixes",
  "Thoughtful UX", "Great for beginners", "Advanced features", "Active development",
  "Cross-platform support", "Enterprise-ready", "Good data export", "Excellent tutorials",
]

const CONS_POOL = [
  "Premium features require upgrade", "Could be faster for large tasks", "Occasional UI quirks",
  "Steep learning curve for advanced features", "Mobile experience needs work", "Limited free tier",
  "Integration gaps with some tools", "Customer support can be slow", "Export options limited",
  "Occasional bugs after updates", "Documentation could be deeper", "Price increase on renewal",
  "No offline mode", "Some features feel unfinished", "API rate limits restrictive",
  "Advanced features behind paywall", "Can be resource intensive", "Occasional downtime",
  "Basic collaboration features", "Limited customization", "No self-hosted option",
  "Learning curve for new users", "Some redundant features", "Team pricing adds up",
  "Slow during peak hours", "Mobile app lacks features", "Search could be better",
  "Notifications need work", "Template library limited", "Onboarding could be improved",
  "Enterprise setup complex", "Backup options limited", "Plugin system immature",
  "Dark mode inconsistent", "File size limits restrictive", "Missing keyboard shortcuts",
  "No bulk operations", "History search limited", "Slow initial load", "Memory usage high",
  "Confusing pricing tiers", "No free trial for pro", "Account management clunky",
  "Multi-factor auth limited", "No API sandbox", "Rate limiting aggressive",
  "No desktop app", "SSO requires enterprise", "Region restrictions apply", "No student discount",
]

function pickNPros(n) {
  return shuffle(PROS_POOL).slice(0, n)
}

function getPros() {
  return pickNPros(randomInt(2, 4))
}

function pickNCons(n) {
  const shuffled = shuffle(CONS_POOL)
  // Ensure not too many repeats per tool by slicing different regions
  return shuffled.slice(0, n)
}

function getCons() {
  return pickNCons(randomInt(1, 3))
}

// ── Generate reviews for one tool ────────────────────────────
function generateReviewsForTool(toolName, toolSlug, tool_id, userIds, count) {
  const usedTitles = new Set()
  const usedBodies = new Set()
  const userPool = shuffle(userIds)
  const reviews = []

  for (let i = 0; i < count; i++) {
    const userId = userPool[i % userPool.length]

    let title, body
    let attempts = 0

    do {
      title = makeTitle(toolName)
      attempts++
    } while (usedTitles.has(title) && attempts < 20)
    usedTitles.add(title)

    attempts = 0
    do {
      body = generateBody(toolName, toolSlug)
      attempts++
    } while (usedBodies.has(body) && attempts < 20)
    usedBodies.add(body)

    reviews.push({
      user_id: userId,
      tool_id,
      rating: randomInt(3, 5),
      title,
      content: body,
      pros: getPros(),
      cons: getCons(),
      is_approved: true,
      created_at: daysAgo(randomInt(1, 365)),
    })
  }

  return reviews
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  console.log("=== Massive Review Seed Script ===\n")

  // 1. Determine reviewer count needed
  const REVIEWS_PER_TOOL = 100

  // 2. Fetch all published tools
  console.log("Fetching published tools...")
  const { data: tools, error: toolsError } = await supabase
    .from("tools")
    .select("id, name, slug")
    .eq("is_published", true)
    .order("name")

  if (toolsError) {
    console.error(`  Error: ${toolsError.message}`)
    process.exit(1)
  }

  console.log(`  Found ${tools.length} published tools`)
  const totalReviewsNeeded = tools.length * REVIEWS_PER_TOOL
  console.log(`  Need ${totalReviewsNeeded} reviews total`)

  // 3. Create reviewer users
  const REVIEWER_COUNT = Math.min(150, totalReviewsNeeded)

  console.log(`\nCreating ${REVIEWER_COUNT} reviewer users...`)

  const allReviewers = []

  // Check existing auth users count first
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) {
    console.log(`  Could not list existing users: ${listError.message}`)
  }

  let existingAuthCount = existingUsers?.users?.length || 0
  console.log(`  Existing auth users: ${existingAuthCount}`)

  // Try to reuse existing auth users to minimize API calls
  let availableIds = []
  if (existingUsers?.users) {
    availableIds = existingUsers.users.map(u => ({
      id: u.id,
      name: u.user_metadata?.full_name || u.email?.split("@")[0] || "User",
    }))
  }

  // Create new users until we have enough
  let created = 0
  const needsNew = REVIEWER_COUNT - availableIds.length

  if (needsNew > 0) {
    console.log(`  Creating ${needsNew} new auth users...`)
    for (let i = 0; i < needsNew; i++) {
      const first = pick(FIRST_NAMES)
      const last = pick(LAST_NAMES)
      const name = `${first} ${last}`
      const email = `reviewer.${first.toLowerCase()}.${last.toLowerCase()}.${i}@seed.example.com`

      try {
        const { data, error } = await supabase.auth.admin.createUser({
          email,
          password: "TempPass123!",
          email_confirm: true,
          user_metadata: { full_name: name },
        })
        if (!error && data?.user) {
          availableIds.push({ id: data.user.id, name })
          created++
        }
      } catch {
        // Silently skip individual failures
      }

      if (i % 10 === 9) {
        process.stdout.write(`    Created ${i + 1}/${needsNew}...\r`)
      }
    }
    process.stdout.write(`    Created ${created}/${needsNew} new users\n`)
  }

  const reviewerPool = availableIds.slice(0, REVIEWER_COUNT)
  console.log(`  Total reviewer pool: ${reviewerPool.length}`)

  // 4. Delete existing reviews
  console.log("\nDeleting existing reviews...")
  let deletedCount = 0
  const { data: allRev } = await supabase.from("reviews").select("id")
  if (allRev && allRev.length > 0) {
    const ids = allRev.map(r => r.id)
    for (let i = 0; i < ids.length; i += 100) {
      const batch = ids.slice(i, i + 100)
      const { error } = await supabase.from("reviews").delete().in("id", batch)
      if (!error) deletedCount += batch.length
    }
  }
  console.log(`  ✓ ${deletedCount} existing reviews deleted`)

  // 5. Generate and insert reviews per tool
  console.log("\nGenerating and inserting reviews...")

  let totalInserted = 0
  const BATCH_SIZE = 25

  for (const tool of tools) {
    const userIds = shuffle(reviewerPool.map(r => r.id)).slice(0, REVIEWS_PER_TOOL)
    const reviews = generateReviewsForTool(tool.name, tool.slug, tool.id, userIds, REVIEWS_PER_TOOL)

    let inserted = 0
    for (let i = 0; i < reviews.length; i += BATCH_SIZE) {
      const batch = reviews.slice(i, i + BATCH_SIZE)
      const { data, error } = await supabase
        .from("reviews")
        .insert(batch)
        .select("id")

      if (error) {
        if (error.code !== "23505" && error.code !== "23503") {
          console.error(`  ✗ ${tool.name}: batch error - ${error.message}`)
        }
      } else if (data) {
        inserted += data.length
      }
    }

    totalInserted += inserted
    console.log(`  ✓ ${tool.name.padEnd(18)} ${inserted}/${REVIEWS_PER_TOOL} reviews`)
  }

  console.log(`\n  Total inserted: ${totalInserted}`)

  // 6. Manual rating update (trigger should handle this, but just in case)
  console.log("\nVerifying tool ratings...")
  for (const tool of tools) {
    const { data: ratings } = await supabase
      .from("reviews")
      .select("rating")
      .eq("tool_id", tool.id)
      .eq("is_approved", true)

    if (ratings && ratings.length > 0) {
      const avg = parseFloat(
        (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(2)
      )
      await supabase
        .from("tools")
        .update({ rating: avg, review_count: ratings.length })
        .eq("id", tool.id)
    }
  }
  console.log("  ✓ Tool ratings updated")

  // 7. Final verification
  console.log("\n=== VERIFICATION ===\n")

  const { data: finalTools } = await supabase
    .from("tools")
    .select("name, rating, review_count")
    .eq("is_published", true)
    .order("review_count", { ascending: false })

  if (finalTools) {
    console.log("Tool ratings & review counts:")
    let totalReviews = 0
    for (const t of finalTools) {
      totalReviews += t.review_count
      const stars = "★".repeat(Math.round(t.rating)) + "☆".repeat(5 - Math.round(t.rating))
      console.log(`  ${t.name.padEnd(18)} ${String(t.rating).padEnd(5)} ${stars}  ${t.review_count} reviews`)
    }
    console.log(`\n  Total reviews in database: ${totalReviews}`)
  }

  // Check for duplicate titles
  const { data: allInserted } = await supabase.from("reviews").select("title")
  if (allInserted) {
    const titles = allInserted.map(r => r.title)
    const uniqueTitles = new Set(titles)
    if (titles.length !== uniqueTitles.size) {
      console.log(`\n⚠ ${titles.length - uniqueTitles.size} duplicate titles found`)
    } else {
      console.log("\n✓ All titless are unique!")
    }
  }

  console.log("\n✓ Seed complete!")
}

main().catch(console.error)
