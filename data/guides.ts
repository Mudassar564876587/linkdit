export interface Guide {
  id: string
  title: string
  description: string
  section: string
  readingTime: string
  updatedAt: string
  featured: boolean
  icon: string
}

export const guideSections = [
  "Getting Started",
  "Prompt Engineering",
  "AI Automation",
  "Content Creation",
  "AI Coding",
  "Marketing",
  "SEO",
  "Productivity",
  "Business",
  "Freelancing",
] as const

export const guides: Guide[] = [
  {
    id: "1",
    title: "The Complete Beginner's Guide to AI Tools",
    description: "Everything you need to know about AI tools: what they are, how they work, and how to choose the right one for your needs.",
    section: "Getting Started",
    readingTime: "10 min",
    updatedAt: "Jul 12, 2026",
    featured: true,
    icon: "compass",
  },
  {
    id: "2",
    title: "Setting Up Your AI Workspace: Tools and Stack",
    description: "Build the perfect AI-powered workspace with our curated recommendations for tools, extensions, and integrations.",
    section: "Getting Started",
    readingTime: "8 min",
    updatedAt: "Jul 11, 2026",
    featured: true,
    icon: "layout",
  },
  {
    id: "3",
    title: "Prompt Engineering 101: Writing Effective Prompts",
    description: "Master the fundamentals of prompt engineering. Learn structure, context setting, and how to get consistent outputs from any AI model.",
    section: "Prompt Engineering",
    readingTime: "12 min",
    updatedAt: "Jul 10, 2026",
    featured: true,
    icon: "pen-tool",
  },
  {
    id: "4",
    title: "Advanced Prompt Patterns for Complex Tasks",
    description: "Explore chain-of-thought, tree-of-thought, and recursive prompting patterns for solving complex multi-step problems with AI.",
    section: "Prompt Engineering",
    readingTime: "15 min",
    updatedAt: "Jul 9, 2026",
    featured: false,
    icon: "git-branch",
  },
  {
    id: "5",
    title: "Building AI Automation Workflows with No-Code Tools",
    description: "Automate repetitive tasks using AI-powered no-code platforms. Connect your apps and build intelligent workflows without writing code.",
    section: "AI Automation",
    readingTime: "20 min",
    updatedAt: "Jul 8, 2026",
    featured: true,
    icon: "zap",
  },
  {
    id: "6",
    title: "AI-Powered Content Creation: From Outline to Publication",
    description: "Build a complete content creation pipeline using AI tools for research, drafting, editing, and publishing high-quality content.",
    section: "Content Creation",
    readingTime: "14 min",
    updatedAt: "Jul 7, 2026",
    featured: false,
    icon: "file-text",
  },
  {
    id: "7",
    title: "AI Coding Assistants: A Practical Comparison Guide",
    description: "Compare GitHub Copilot, Cursor, Claude, and ChatGPT for coding. Find the best AI coding assistant for your specific workflow.",
    section: "AI Coding",
    readingTime: "16 min",
    updatedAt: "Jul 6, 2026",
    featured: true,
    icon: "code",
  },
  {
    id: "8",
    title: "AI for Marketing: Campaigns, Copy, and Analytics",
    description: "Transform your marketing strategy with AI tools for ad copy generation, audience analysis, campaign optimization, and performance tracking.",
    section: "Marketing",
    readingTime: "11 min",
    updatedAt: "Jul 5, 2026",
    featured: false,
    icon: "megaphone",
  },
  {
    id: "9",
    title: "SEO in the Age of AI: Ranking with AI-Generated Content",
    description: "Learn how to optimize AI-generated content for search engines while maintaining quality, originality, and E-E-A-T standards.",
    section: "SEO",
    readingTime: "13 min",
    updatedAt: "Jul 4, 2026",
    featured: false,
    icon: "search",
  },
  {
    id: "10",
    title: "AI Productivity: Tools and Systems for Peak Efficiency",
    description: "Create a productivity system powered by AI tools for task management, note-taking, scheduling, and deep work optimization.",
    section: "Productivity",
    readingTime: "9 min",
    updatedAt: "Jul 3, 2026",
    featured: false,
    icon: "check-circle",
  },
  {
    id: "11",
    title: "AI for Small Business: Tools That Actually Deliver ROI",
    description: "Discover which AI tools provide real ROI for small businesses. Covers customer service, accounting, HR, and operations automation.",
    section: "Business",
    readingTime: "18 min",
    updatedAt: "Jul 2, 2026",
    featured: false,
    icon: "briefcase",
  },
  {
    id: "12",
    title: "Freelancing with AI: Scale Your Services and Income",
    description: "Learn how freelancers can use AI to deliver more value, take on larger projects, and scale their freelance business without burning out.",
    section: "Freelancing",
    readingTime: "10 min",
    updatedAt: "Jul 1, 2026",
    featured: false,
    icon: "user-check",
  },
]

export function getGuidesBySection(section: string): Guide[] {
  return guides.filter((g) => g.section === section)
}

export function getFeaturedGuides(): Guide[] {
  return guides.filter((g) => g.featured)
}

export function searchGuides(query: string): Guide[] {
  const q = query.toLowerCase()
  return guides.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      g.section.toLowerCase().includes(q)
  )
}
