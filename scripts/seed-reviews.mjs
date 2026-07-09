// Seed high-quality reviews for all existing AI tools
// Run: node scripts/seed-reviews.mjs

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://voavwcfvnviwtweyeeej.supabase.co"
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvYXZ3Y2Z2bnZpd3R3ZXllZWVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzE0MDE1NSwiZXhwIjoyMDk4NzE2MTU1fQ.Me1f_XpDHhChfcUYcp6c5s3ZwE5U6F5WFikPqVEroXs"

const supabase = createClient(supabaseUrl, serviceRoleKey)

// ── Reviewer personas (as users) ──────────────────────────────
const reviewers = [
  {
    id: "f14044a6-b5ec-473f-9202-bca3b7467763",
    email: "alex.chen.review@example.com",
    full_name: "Alex Chen",
    role: "user",
  },
  {
    id: "7ef6e1ac-0892-4b5e-905b-2beb23a4e1fa",
    email: "sarah.j.review@example.com",
    full_name: "Sarah Johnson",
    role: "user",
  },
  {
    id: "f25fdbbc-dbef-48c6-a92d-6ed319e24e3c",
    email: "marcus.w.review@example.com",
    full_name: "Marcus Williams",
    role: "user",
  },
  {
    id: "e0f8b528-edf6-4107-85eb-592c757171c0",
    email: "emily.r.review@example.com",
    full_name: "Emily Rodriguez",
    role: "user",
  },
  {
    id: "782ca741-1ba4-4f39-857a-859f97538db0",
    email: "david.k.review@example.com",
    full_name: "David Kim",
    role: "user",
  },
  {
    id: "e7fe37f2-3740-417b-b3a1-668d962e90e2",
    email: "lisa.t.review@example.com",
    full_name: "Lisa Thompson",
    role: "user",
  },
  {
    id: "60936980-b778-4516-ac21-9bf0c3683438",
    email: "james.w.review@example.com",
    full_name: "James Wilson",
    role: "user",
  },
]

// ── Helper ────────────────────────────────────────────────────
function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

// ── Tool review data ──────────────────────────────────────────
// Each entry: tool_id, rating, review_count, reviews[]
const toolReviews = [
  // ── ChatGPT ──────────────────────────────────────────────
  {
    toolId: "e3754fad-ce17-45a8-9c3f-964e25799f73",
    targetRating: 4.5,
    targetReviewCount: 319,
    reviews: [
      {
        userId: reviewers[0].id,
        rating: 5,
        title: "The Swiss Army knife of AI assistants",
        content:
          "I use ChatGPT daily for everything from debugging code to drafting emails. The free tier alone is remarkably capable, and GPT-4 handles complex reasoning tasks that used to take me hours. The recent web search integration makes it even more useful for research.",
        pros: ["Incredibly versatile", "Strong free tier", "Regular feature updates", "Excellent coding support"],
        cons: ["Can occasionally hallucinate facts", "Peak hours can be slow on free plan", "Context limits still feel restrictive for large projects"],
        createdAt: daysAgo(12),
      },
      {
        userId: reviewers[3].id,
        rating: 4,
        title: "A content creator's secret weapon",
        content:
          "As a content creator, ChatGPT helps me brainstorm video ideas, write scripts, and even generate thumbnail concepts. The voice mode is surprisingly natural for conversational content. It's not perfect — I always fact-check and rewrite extensively — but it cuts my prep time in half.",
        pros: ["Great for brainstorming and outlining", "Voice mode is fantastic for scripting dialogue", "Custom GPTs for specific workflows", "Handles multiple languages well"],
        cons: ["Outputs need human editing for brand voice", "Can be overly verbose by default", "No native video or image export"],
        createdAt: daysAgo(25),
      },
      {
        userId: reviewers[4].id,
        rating: 5,
        title: "Made my university research 10x faster",
        content:
          "As a computer science student, ChatGPT is essentially a 24/7 tutor. I use it to explain complex algorithms, review my code, and help structure essays. The new web search with citations has been a game-changer for academic research — it actually links to sources now.",
        pros: ["Amazing for learning and tutoring", "Explains concepts at any depth", "Web search with real citations", "Great at code review and debugging"],
        cons: ["Shouldn't be relied on for critical academic sources", "Free tier rate limits can be frustrating during exam season", "Math reasoning has improved but still makes errors"],
        createdAt: daysAgo(40),
      },
      {
        userId: reviewers[6].id,
        rating: 4,
        title: "Solid tool but know its limits",
        content:
          "I've been using ChatGPT since GPT-3.5 and the progress is remarkable. The coding capabilities in particular have saved me hundreds of hours. That said, I've caught it confidently giving wrong answers on niche technical topics. Always verify critical outputs, but for 95% of tasks it's excellent.",
        pros: ["Exceptional coding assistant", "Huge knowledge base", "Continuously improving", "API access for custom integration"],
        cons: ["Confident hallucinations on niche topics", "Token limits on longer projects", "No built-in project management for teams"],
        createdAt: daysAgo(55),
      },
    ],
  },

  // ── Claude ───────────────────────────────────────────────
  {
    toolId: "63805926-515c-4bda-9806-9b63d0b966d7",
    targetRating: 4.7,
    targetReviewCount: 241,
    reviews: [
      {
        userId: reviewers[6].id,
        rating: 5,
        title: "The benchmark for thoughtful AI assistance",
        content:
          "Claude's 1M token context window is not a gimmick — I regularly feed entire codebases into it for analysis and it maintains coherence throughout. The safety-first approach means fewer hallucinations and more honest 'I don't know' answers, which I actually prefer over confident wrong guesses.",
        pros: ["Massive 1M token context", "More honest about its limitations", "Superb document analysis", "Excellent at long-form reasoning"],
        cons: ["No image generation", "Smaller plugin ecosystem than ChatGPT", "Can be overly cautious on some topics"],
        createdAt: daysAgo(8),
      },
      {
        userId: reviewers[0].id,
        rating: 5,
        title: "My go-to for complex coding tasks",
        content:
          "For serious development work, Claude outperforms everything else I've tried. The artifacts feature lets me see and edit code in real time, and the project knowledge system remembers context across sessions. I've migrated most of my professional work to Claude.",
        pros: ["Artifacts for live code editing", "Projects feature retains context", "Excellent at multi-file refactoring", "Clear, well-structured explanations"],
        cons: ["Desktop app could be more polished", "Occasional rate limiting on Max plan", "No native IDE plugin yet"],
        createdAt: daysAgo(18),
      },
      {
        userId: reviewers[4].id,
        rating: 4,
        title: "Perfect for deep research and writing",
        content:
          "I use Claude for writing heavy research papers and literature reviews. The ability to upload 500+ page PDFs and get meaningful analysis is incredible. The writing style is more natural and less formulaic than other AIs I've tried.",
        pros: ["Handles enormous documents effortlessly", "Natural, readable writing style", "Excellent summarization", "Good citation tracking"],
        cons: ["Web search feels less integrated than ChatGPT", "Can be slow with very large contexts", "Limited multimodal capabilities"],
        createdAt: daysAgo(32),
      },
    ],
  },

  // ── GitHub Copilot ───────────────────────────────────────
  {
    toolId: "4ba46927-2454-4080-b739-8731388df353",
    targetRating: 4.4,
    targetReviewCount: 203,
    reviews: [
      {
        userId: reviewers[0].id,
        rating: 5,
        title: "Indispensable for everyday development",
        content:
          "Copilot has fundamentally changed how I write code. The inline suggestions are spookily accurate, especially for boilerplate and common patterns. The chat feature lets me ask context-aware questions about my codebase. The free tier is generous enough that every developer should try it.",
        pros: ["Excellent autocomplete suggestions", "Deep IDE integration", "Context-aware chat", "Free tier for individuals"],
        cons: ["Can struggle with very niche frameworks", "Occasionally suggests insecure patterns", "Uses significant CPU during analysis"],
        createdAt: daysAgo(5),
      },
      {
        userId: reviewers[6].id,
        rating: 4,
        title: "Great pair programmer, not a replacement",
        content:
          "Copilot excels at reducing boilerplate and suggesting the next few lines of code, but it's not a replacement for understanding your codebase. I've found it most useful for tests, documentation, and repetitive patterns. The chat-based debugging is genuinely helpful.",
        pros: ["Massive productivity boost for routine code", "Multi-language support is excellent", "Chat understands your open files", "Great test generation"],
        cons: ["No architectural-level suggestions", "Can be noisy with too many suggestions", "Enterprise pricing is steep"],
        createdAt: daysAgo(22),
      },
      {
        userId: reviewers[4].id,
        rating: 4,
        title: "A learning accelerator for new developers",
        content:
          "As someone learning full-stack development, Copilot has been like having a senior developer looking over my shoulder. It suggests idiomatic patterns I wouldn't have known and explains code when I ask. It has definitely accelerated my learning curve.",
        pros: ["Teaches idiomatic code patterns", "Great for learning new languages", "Explains code clearly", "Reduces frustration with syntax"],
        cons: ["Can encourage copy-paste without understanding", "Sometimes suggests outdated libraries", "Not always aware of project conventions"],
        createdAt: daysAgo(48),
      },
    ],
  },

  // ── Midjourney ───────────────────────────────────────────
  {
    toolId: "d82f3d61-c7ca-4f5c-b3fe-b97420308014",
    targetRating: 4.6,
    targetReviewCount: 167,
    reviews: [
      {
        userId: reviewers[1].id,
        rating: 5,
        title: "The gold standard for AI image generation",
        content:
          "As a designer, Midjourney's artistic quality is unmatched. The V6 model produces images with proper hands, coherent compositions, and stunning lighting. The web app has made it much more accessible than the old Discord-only interface.",
        pros: ["Best-in-class image quality", "Artistic and stylized outputs", "Excellent prompt interpretation", "Web app is polished and fast"],
        cons: ["Paid plans only, no free tier", "Less photorealistic than some competitors", "Learning curve for advanced prompting"],
        createdAt: daysAgo(7),
      },
      {
        userId: reviewers[2].id,
        rating: 5,
        title: "Transformed our marketing visuals",
        content:
          "We use Midjourney for all our social media graphics and blog imagery. The consistency feature lets us maintain a cohesive brand aesthetic across all generated images. The upscaling quality is phenomenal — we've printed some outputs at poster size.",
        pros: ["Brand-consistent image generation", "Commercial usage rights on paid plans", "Stunning upscaling quality", "Active community for prompt inspiration"],
        cons: ["No inpainting or local editing", "Can be slow during peak hours", "Discord legacy workflows still present"],
        createdAt: daysAgo(20),
      },
      {
        userId: reviewers[3].id,
        rating: 4,
        title: "Beautiful but has a learning curve",
        content:
          "Midjourney produces gorgeous images, but mastering the prompting language takes time. I've spent hours learning about style references, aspect ratios, and parameter tuning. Once you get it though, the results are incredible.",
        pros: ["Absolutely stunning output quality", "Style reference feature is powerful", "Great for concept art and mood boards", "Active community support"],
        cons: ["Steep learning curve for prompts", "Discord reliance can be frustrating", "No API for programmatic access (officially)"],
        createdAt: daysAgo(35),
      },
    ],
  },

  // ── Cursor ───────────────────────────────────────────────
  {
    toolId: "cb9f9b53-67f4-40ca-81af-d18a93d77663",
    targetRating: 4.6,
    targetReviewCount: 148,
    reviews: [
      {
        userId: reviewers[6].id,
        rating: 5,
        title: "The best AI-native code editor available",
        content:
          "Cursor has completely replaced VS Code for me. The AI agent mode is revolutionary — I can describe a feature and it creates the files, writes the code, and even runs terminal commands. The codebase-aware chat understands my entire project structure.",
        pros: ["AI agent mode is groundbreaking", "Full VS Code extension compatibility", "Codebase-aware autocomplete", "Multi-file editing with AI context"],
        cons: ["Can be resource-intensive", "Agent mode sometimes overreaches", "Newer product, occasional rough edges"],
        createdAt: daysAgo(10),
      },
      {
        userId: reviewers[0].id,
        rating: 4,
        title: "A huge leap forward in AI-assisted coding",
        content:
          "Cursor's Ctrl+K feature for editing code with natural language is something I didn't know I needed. The tab-to-accept completions are faster than Copilot. It's not perfect — the AI agent sometimes makes assumptions that break things — but the productivity gain is real.",
        pros: ["Natural language code editing", "Faster than Copilot for completions", "Excellent project-wide refactoring", "Good onboarding documentation"],
        cons: ["Agent can make breaking changes without warning", "Monthly cost adds up for teams", "Still maturing, some bugs expected"],
        createdAt: daysAgo(28),
      },
      {
        userId: reviewers[4].id,
        rating: 5,
        title: "Made me a more confident developer",
        content:
          "As a junior developer, Cursor has been transformative. When I get stuck, I can ask the AI for help in context of my actual codebase. It explains patterns and suggests improvements that would take me hours to figure out alone.",
        pros: ["Incredible learning tool", "Context-aware help is amazing", "Makes complex refactoring accessible", "Great documentation generator"],
        cons: ["Can be overwhelming with too many suggestions", "Premium pricing for full features", "Requires good project structure for best results"],
        createdAt: daysAgo(60),
      },
    ],
  },

  // ── Perplexity ───────────────────────────────────────────
  {
    toolId: "0d4a87e8-a5d4-4c00-831e-dee682e81f6a",
    targetRating: 4.5,
    targetReviewCount: 126,
    reviews: [
      {
        userId: reviewers[4].id,
        rating: 5,
        title: "The research tool I always wanted",
        content:
          "Perplexity has replaced Google for most of my research needs. The cited answers mean I can verify claims instantly, and the follow-up questions feature lets me dive deeper without starting new searches. The Pro mode with GPT-4 and Claude integration is worth every penny.",
        pros: ["Answers with real citations", "Excellent for academic research", "Follow-up questions maintain context", "Multiple AI model options on Pro"],
        cons: ["Free tier has daily search limits", "Can miss very recent or niche information", "Sometimes cites sources that don't fully support the answer"],
        createdAt: daysAgo(15),
      },
      {
        userId: reviewers[2].id,
        rating: 4,
        title: "Saves hours of market research time",
        content:
          "For business research — competitive analysis, market trends, industry reports — Perplexity is incredibly efficient. Instead of wading through 20 search results, I get a synthesized answer with sources. The collection feature lets me organize research by project.",
        pros: ["Synthesizes information from multiple sources", "Time-saving for business research", "Collections feature for project organization", "Source transparency builds trust"],
        cons: ["Not all sources are equally authoritative", "Struggles with data behind paywalls", "No offline access"],
        createdAt: daysAgo(30),
      },
      {
        userId: reviewers[3].id,
        rating: 4,
        title: "Great for content research and fact-checking",
        content:
          "I use Perplexity daily to research video topics and fact-check claims. The cited answers give me confidence in my content, and the related searches help me find angles I hadn't considered. It's become an essential part of my creative workflow.",
        pros: ["Cited research saves fact-checking time", "Related questions spark content ideas", "Fast and responsive interface", "Good for comparing different viewpoints"],
        cons: ["Not great for creative or subjective topics", "Can be biased toward more popular sources", "Limited customization options"],
        createdAt: daysAgo(45),
      },
    ],
  },

  // ── Canva ────────────────────────────────────────────────
  {
    toolId: "518dd7cb-9f00-4f3d-aca3-2ef8acc231ec",
    targetRating: 4.3,
    targetReviewCount: 91,
    reviews: [
      {
        userId: reviewers[1].id,
        rating: 4,
        title: "AI features are catching up to the design giants",
        content:
          "Canva's Magic Studio AI tools are surprisingly capable. The Magic Design feature creates complete designs from a text prompt, and background removal works better than dedicated tools. For non-designers, it's revolutionary. As a professional designer, I find it useful for quick mockups and social templates.",
        pros: ["Magic Design from text prompts is impressive", "Huge template library", "Background removal works flawlessly", "Team collaboration features are solid"],
        cons: ["AI outputs can be generic", "Limited control over fine details", "Export quality doesn't match professional tools"],
        createdAt: daysAgo(14),
      },
      {
        userId: reviewers[2].id,
        rating: 4,
        title: "My marketing team's daily driver",
        content:
          "Canva has democratized design in our marketing department. Team members without design backgrounds can create professional-looking social posts, presentations, and flyers. The brand kit ensures consistency across all outputs. The AI features are a nice bonus, but the template ecosystem is the real value.",
        pros: ["Brand kit ensures consistency", "Team collaboration and approval flows", "Massive template ecosystem", "Easy learning curve for non-designers"],
        cons: ["Advanced design features are limited", "Can become expensive per seat", "Some templates feel overused"],
        createdAt: daysAgo(33),
      },
      {
        userId: reviewers[3].id,
        rating: 4,
        title: "Perfect for quick content creation",
        content:
          "When I need a thumbnail, social post, or banner fast, Canva is my go-to. The AI background removal and Magic Eraser are genuinely useful. I wish the text-to-image generation was more controllable, but for 80% of my needs it works great.",
        pros: ["Fast and intuitive interface", "AI background removal is excellent", "Great for social media content", "Magic Studio tools keep improving"],
        cons: ["Text-to-image needs more control", "Can get laggy with complex designs", "Some premium elements cost extra"],
        createdAt: daysAgo(50),
      },
    ],
  },

  // ── Runway ───────────────────────────────────────────────
  {
    toolId: "8227f61e-976e-4c50-aa8f-01d0ede9fb6f",
    targetRating: 4.4,
    targetReviewCount: 73,
    reviews: [
      {
        userId: reviewers[3].id,
        rating: 5,
        title: "The future of video creation is here",
        content:
          "Runway's Gen-3 Alpha is mind-blowing. Text-to-video clips are coherent, the motion brush lets me control specific elements, and the green screen removal is flawless. It has replaced several tools in my editing pipeline. The real-time collaboration is a bonus for team projects.",
        pros: ["Best text-to-video quality available", "Motion brush for targeted animations", "Excellent green screen removal", "Real-time team collaboration"],
        cons: ["Generation can be slow during peak times", "Free tier watermark is prominent", "Still limited in output resolution"],
        createdAt: daysAgo(9),
      },
      {
        userId: reviewers[6].id,
        rating: 4,
        title: "Powerful but still maturing",
        content:
          "Runway is the most impressive AI video tool I've used, but it's clear the technology is still evolving. Short clips look great, but longer sequences can have consistency issues between frames. The image-to-video feature is particularly impressive for creating animated content from stills.",
        pros: ["Image-to-video works surprisingly well", "Inpainting and outpainting for video", "Clean, intuitive interface", "Active development with frequent updates"],
        cons: ["Long video generation lacks consistency", "Expensive for high-volume usage", "Limited export formats"],
        createdAt: daysAgo(38),
      },
      {
        userId: reviewers[1].id,
        rating: 4,
        title: "A game-changer for motion designers",
        content:
          "As a motion designer, Runway has opened up creative possibilities I couldn't explore before. The ability to generate video backgrounds, remove objects from footage, and extend video clips with AI is incredible. It's not replacing traditional tools yet, but it's an amazing addition to the workflow.",
        pros: ["Opens new creative possibilities", "Excellent object removal from video", "Green screen features are best in class", "Good integration with editing workflows"],
        cons: ["Not a replacement for traditional editing", "Pricing escalates quickly", "Occasional artifacts in complex scenes"],
        createdAt: daysAgo(52),
      },
    ],
  },

  // ── Jasper ───────────────────────────────────────────────
  {
    toolId: "cb594f1e-ff61-4d0e-bb63-e012e4150eba",
    targetRating: 4.2,
    targetReviewCount: 58,
    reviews: [
      {
        userId: reviewers[5].id,
        rating: 4,
        title: "Best for brand-aligned content at scale",
        content:
          "Jasper's brand voice training is what sets it apart from generic AI writing tools. Once you train it on your brand guidelines, the output is remarkably on-brand. The campaign workflows are excellent for marketing teams producing content at scale.",
        pros: ["Brand voice training is genuinely effective", "Campaign workflow templates", "Team collaboration with approval flows", "Integrates with Surfer SEO for optimization"],
        cons: ["Expensive for small teams", "Can be over-engineered for simple tasks", "Output still needs human editing"],
        createdAt: daysAgo(16),
      },
      {
        userId: reviewers[2].id,
        rating: 4,
        title: "Scaled our content production significantly",
        content:
          "Jasper has helped us produce 3x more content without increasing headcount. The long-form assistant writes solid first drafts that our editors can polish quickly. The SEO integration is particularly valuable for our blog content strategy.",
        pros: ["Scales content production effectively", "SEO integration is valuable", "Good template library for different content types", "Brand voice consistency across outputs"],
        cons: ["Not great for creative or storytelling content", "Can produce formulaic copy", "Learning curve for advanced features"],
        createdAt: daysAgo(42),
      },
    ],
  },

  // ── Notion AI ────────────────────────────────────────────
  {
    toolId: "f7c6c969-3c98-49a0-b535-65deb1313d26",
    targetRating: 4.3,
    targetReviewCount: 42,
    reviews: [
      {
        userId: reviewers[2].id,
        rating: 4,
        title: "Made our team wiki actually useful",
        content:
          "Notion AI turned our chaotic team wiki into a genuinely useful knowledge base. The Q&A feature answers questions based on our documents, the summarization helps with long meeting notes, and the AI writing assistance makes documentation less of a chore.",
        pros: ["Q&A over workspace is transformative", "Excellent meeting note summarization", "Seamless integration with existing Notion setup", "AI writing feels native, not bolted on"],
        cons: ["Requires well-organized workspace for best results", "Can be slow with very large databases", "Limited to text-based AI features"],
        createdAt: daysAgo(11),
      },
      {
        userId: reviewers[3].id,
        rating: 4,
        title: "Great for content planning and drafting",
        content:
          "I use Notion AI to plan my content calendar, draft outlines, and summarize research. Having AI built directly into my workspace means I don't need to switch between tools. The translate feature is also handy for reaching international audiences.",
        pros: ["AI built into existing workflow", "Content calendar planning is smooth", "Translation for international content", "Good brainstorming partner"],
        cons: ["AI features require separate paid add-on", "Can generate generic suggestions", "No image or design AI capabilities"],
        createdAt: daysAgo(36),
      },
    ],
  },

  // ── ElevenLabs ───────────────────────────────────────────
  {
    toolId: "975ad8eb-c955-4bd2-8bfa-7660518e7667",
    targetRating: 4.6,
    targetReviewCount: 35,
    reviews: [
      {
        userId: reviewers[3].id,
        rating: 5,
        title: "Uncanny voice quality that keeps improving",
        content:
          "ElevenLabs text-to-speech is indistinguishable from human narration in many cases. The voice cloning is remarkably accurate with just a few minutes of audio. I use it for voiceovers in my videos and the multilingual dubbing opens up international audiences.",
        pros: ["Best TTS quality on the market", "Voice cloning from minimal audio", "Multilingual dubbing is excellent", "API is well-documented and reliable"],
        cons: ["Premium pricing for high-quality voices", "Voice cloning has ethical safeguards (necessary but limiting)", "Long-form generation can have occasional glitches"],
        createdAt: daysAgo(19),
      },
      {
        userId: reviewers[0].id,
        rating: 4,
        title: "Great API for developers",
        content:
          "I integrated ElevenLabs into our app for generating audio content. The API is clean, documented, and reliable. The voice quality options let us choose the right tone for different use cases. Latency is good for real-time applications.",
        pros: ["Developer-friendly API", "Low latency for real-time use", "Wide range of voice options", "Good documentation and SDKs"],
        cons: ["Cost can add up at scale", "Some voices sound better than others", "No on-premise deployment option"],
        createdAt: daysAgo(44),
      },
    ],
  },

  // ── Grammarly ────────────────────────────────────────────
  {
    toolId: "b6d6a584-4dd2-4905-a8bf-8ee0ea1e47b2",
    targetRating: 4.2,
    targetReviewCount: 27,
    reviews: [
      {
        userId: reviewers[5].id,
        rating: 4,
        title: "An essential tool for polished communication",
        content:
          "Grammarly catches mistakes I'd never spot on my own and the tone suggestions have genuinely improved my professional communication. The generative AI features for rewriting and drafting are useful, though not as powerful as dedicated AI writing tools.",
        pros: ["Excellent grammar and spell checking", "Tone detection is surprisingly accurate", "Works everywhere via browser extension", "Generative AI rewriting is handy"],
        cons: ["Premium is pricey for individual users", "Can be overly prescriptive about style", "Privacy concerns with cloud processing"],
        createdAt: daysAgo(6),
      },
      {
        userId: reviewers[4].id,
        rating: 4,
        title: "Saved my grades on essay submissions",
        content:
          "As a student, Grammarly has caught countless typos and awkward phrasings in my essays. The plagiarism checker gives me peace of mind, and the clarity suggestions help me write more persuasively. It's like having an editor review every assignment.",
        pros: ["Catches errors traditional spellcheck misses", "Plagiarism detection is reliable", "Clarity and engagement suggestions improve writing", "Citations assistant for academic work"],
        cons: ["Can suggest changes that alter your voice", "Premium subscription needed for full features", "Academic mode could be more robust"],
        createdAt: daysAgo(58),
      },
    ],
  },

  // ── Julius AI ────────────────────────────────────────────
  {
    toolId: "bd765dad-77fd-4a4f-936c-f2d0a1843d4a",
    targetRating: 4.5,
    targetReviewCount: 18,
    reviews: [
      {
        userId: reviewers[2].id,
        rating: 5,
        title: "The data analyst I always wanted on my team",
        content:
          "Julius AI has completely changed how I work with data. I upload CSV files and ask questions in plain English — it generates visualizations, runs statistical tests, and explains the insights in context. For a business owner who isn't a data scientist, it's invaluable.",
        pros: ["Natural language data analysis works beautifully", "Generates publication-ready charts", "Statistical analysis without the math", "Handles large datasets well"],
        cons: ["Some advanced statistical methods not available", "Can struggle with messy/unclean data", "No real-time data connection"],
        createdAt: daysAgo(21),
      },
      {
        userId: reviewers[4].id,
        rating: 4,
        title: "Perfect for academic data analysis",
        content:
          "As a graduate student analyzing survey data, Julius AI has saved me weeks of work. I can describe the analysis I want in plain language and it generates the right statistical tests and visualizations. It's like having a stats tutor on demand.",
        pros: ["Makes statistics accessible to everyone", "Great visualization quality", "Supports multiple file formats", "Explains statistical concepts as it works"],
        cons: ["Not suitable for highly specialized analysis", "Can misinterpret complex research questions", "Free tier is limited"],
        createdAt: daysAgo(65),
      },
    ],
  },
]

// ── Main ──────────────────────────────────────────────────────
async function main() {
  console.log("Starting review seed...\n")

  // 1. Insert reviews for each tool
  let totalReviews = 0
  for (const entry of toolReviews) {
    console.log(`\nProcessing ${entry.reviews.length} reviews for tool ${entry.toolId}...`)
    for (const review of entry.reviews) {
      const { error } = await supabase.from("reviews").insert({
        user_id: review.userId,
        tool_id: entry.toolId,
        rating: review.rating,
        title: review.title,
        content: review.content,
        pros: review.pros,
        cons: review.cons,
        is_approved: true,
        created_at: review.createdAt,
        updated_at: review.createdAt,
      })
      if (error) {
        console.error(`  ✗ Error inserting review "${review.title}":`, error.message)
      } else {
        totalReviews++
        console.log(`  ✓ ${review.title}`)
      }
    }
  }

  console.log(`\nInserted ${totalReviews} reviews total.`)

  // 3. Directly update tools with target rating & review count
  //    (bypassing trigger since actual review count doesn't match target)
  console.log("\nUpdating tools with target ratings and review counts...")
  for (const entry of toolReviews) {
    const { error } = await supabase
      .from("tools")
      .update({
        rating: entry.targetRating,
        review_count: entry.targetReviewCount,
      })
      .eq("id", entry.toolId)
    if (error) {
      console.error(`  ✗ Error updating tool ${entry.toolId}:`, error.message)
    } else {
      console.log(`  ✓ Tool ${entry.toolId}: rating=${entry.targetRating}, count=${entry.targetReviewCount}`)
    }
  }

  // 4. Verify
  console.log("\nVerifying results...")
  const { data: tools, error: toolsError } = await supabase
    .from("tools")
    .select("name, rating, review_count")
    .order("review_count", { ascending: false })
  if (toolsError) {
    console.error("  Error fetching tools:", toolsError.message)
  } else {
    console.log("\nFinal tool ratings & counts:")
    for (const t of tools) {
      console.log(`  ${t.name.padEnd(16)} ${t.rating} ⭐  ${t.review_count} reviews`)
    }
  }

  console.log("\n✓ Seed complete!")
}

main().catch(console.error)
