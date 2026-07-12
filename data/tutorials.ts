export type Difficulty = "Beginner" | "Intermediate" | "Advanced"

export interface Tutorial {
  id: string
  title: string
  description: string
  difficulty: Difficulty
  readingTime: string
  updatedAt: string
  category: string
  featured: boolean
}

export const tutorialCategories = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Cursor",
  "Lovable",
  "Bolt",
  "Midjourney",
  "Flux",
  "Runway",
  "Perplexity",
] as const

export const tutorials: Tutorial[] = [
  {
    id: "1",
    title: "Getting Started with ChatGPT: From Zero to First Prompt",
    description: "Learn how to create an account, understand the interface, and write your first effective prompt in ChatGPT. Perfect for absolute beginners.",
    difficulty: "Beginner",
    readingTime: "8 min",
    updatedAt: "Jul 12, 2026",
    category: "ChatGPT",
    featured: true,
  },
  {
    id: "2",
    title: "Advanced Prompt Engineering Techniques for ChatGPT",
    description: "Master chain-of-thought, few-shot prompting, and structured outputs. Build complex multi-step workflows that deliver consistent results.",
    difficulty: "Advanced",
    readingTime: "15 min",
    updatedAt: "Jul 11, 2026",
    category: "ChatGPT",
    featured: true,
  },
  {
    id: "3",
    title: "Using Claude for Code Generation and Analysis",
    description: "Discover how to leverage Claude's 200K context window for code review, refactoring, and large-scale codebase analysis.",
    difficulty: "Intermediate",
    readingTime: "12 min",
    updatedAt: "Jul 10, 2026",
    category: "Claude",
    featured: true,
  },
  {
    id: "4",
    title: "Building Your First App with Cursor AI Editor",
    description: "Step-by-step guide to building a full-stack application using Cursor's AI-powered editor with zero boilerplate code.",
    difficulty: "Beginner",
    readingTime: "20 min",
    updatedAt: "Jul 9, 2026",
    category: "Cursor",
    featured: true,
  },
  {
    id: "5",
    title: "Midjourney Prompt Crafting: A Complete Visual Guide",
    description: "Learn how to write Midjourney prompts that produce stunning, consistent results. Covering style references, parameters, and composition.",
    difficulty: "Beginner",
    readingTime: "10 min",
    updatedAt: "Jul 8, 2026",
    category: "Midjourney",
    featured: true,
  },
  {
    id: "6",
    title: "Creating a SaaS Platform with Lovable in One Day",
    description: "From idea to deployed product: learn how to use Lovable's AI-powered development platform to build and launch a SaaS application.",
    difficulty: "Intermediate",
    readingTime: "25 min",
    updatedAt: "Jul 7, 2026",
    category: "Lovable",
    featured: false,
  },
  {
    id: "7",
    title: "Bolt.new Rapid Prototyping: Ship Ideas in Hours",
    description: "Learn the Bolt.new workflow for turning wireframes into working prototypes. Covers component generation, state management, and deployment.",
    difficulty: "Intermediate",
    readingTime: "18 min",
    updatedAt: "Jul 6, 2026",
    category: "Bolt",
    featured: false,
  },
  {
    id: "8",
    title: "Gemini Multimodal: Working with Images, Audio and Video",
    description: "Explore Gemini's native multimodal capabilities. Learn to analyze images, transcribe audio, and understand video content programmatically.",
    difficulty: "Advanced",
    readingTime: "14 min",
    updatedAt: "Jul 5, 2026",
    category: "Gemini",
    featured: false,
  },
  {
    id: "9",
    title: "Flux AI Image Generation: Parameters and Workflows",
    description: "Master Flux's advanced parameters for precise image generation. Learn about guidance scale, step counts, and LoRA integration.",
    difficulty: "Intermediate",
    readingTime: "11 min",
    updatedAt: "Jul 4, 2026",
    category: "Flux",
    featured: false,
  },
  {
    id: "10",
    title: "Runway ML Video Generation: From Text to Motion",
    description: "Create professional video content with Runway's Gen-3 Alpha. Covers text-to-video, image-to-video, and advanced motion controls.",
    difficulty: "Advanced",
    readingTime: "16 min",
    updatedAt: "Jul 3, 2026",
    category: "Runway",
    featured: false,
  },
  {
    id: "11",
    title: "Perplexity AI for Research: Advanced Search Strategies",
    description: "Transform your research workflow with Perplexity's Pro Search, collections, and source-grounded answers with citations.",
    difficulty: "Beginner",
    readingTime: "7 min",
    updatedAt: "Jul 2, 2026",
    category: "Perplexity",
    featured: false,
  },
  {
    id: "12",
    title: "Building AI Agents with Claude and MCP Protocol",
    description: "Learn how to build autonomous AI agents using Claude and the Model Context Protocol for tool use and external API integration.",
    difficulty: "Advanced",
    readingTime: "22 min",
    updatedAt: "Jul 1, 2026",
    category: "Claude",
    featured: false,
  },
  {
    id: "13",
    title: "ChatGPT Plugins and GPTs: Building Custom Assistants",
    description: "Create and publish custom GPTs with specific knowledge bases, actions, and capabilities tailored to your workflow.",
    difficulty: "Intermediate",
    readingTime: "13 min",
    updatedAt: "Jun 30, 2026",
    category: "ChatGPT",
    featured: false,
  },
  {
    id: "14",
    title: "Cursor AI: Advanced Refactoring and Code Migration",
    description: "Use Cursor's AI to refactor legacy code, migrate between frameworks, and automatically fix technical debt across your codebase.",
    difficulty: "Advanced",
    readingTime: "17 min",
    updatedAt: "Jun 29, 2026",
    category: "Cursor",
    featured: false,
  },
  {
    id: "15",
    title: "Midjourney Style Consistency: Character and Scene Control",
    description: "Achieve consistent character designs and scene styles across multiple Midjourney generations using seed parameters and style references.",
    difficulty: "Intermediate",
    readingTime: "9 min",
    updatedAt: "Jun 28, 2026",
    category: "Midjourney",
    featured: false,
  },
]

export function getTutorialsByDifficulty(difficulty: Difficulty): Tutorial[] {
  return tutorials.filter((t) => t.difficulty === difficulty)
}

export function getTutorialsByCategory(category: string): Tutorial[] {
  return tutorials.filter((t) => t.category.toLowerCase() === category.toLowerCase())
}

export function getFeaturedTutorials(): Tutorial[] {
  return tutorials.filter((t) => t.featured)
}

export function searchTutorials(query: string): Tutorial[] {
  const q = query.toLowerCase()
  return tutorials.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.difficulty.toLowerCase().includes(q)
  )
}
