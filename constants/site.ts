export const SITE = {
  name: "LinkDit",
  tagline: "Discover, Compare & Master the World's Best AI Tools",
  description:
    "Explore AI tools, tutorials, comparisons and resources designed to help creators, developers, students and businesses work smarter.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://linkdit-omega.vercel.app",
  locale: "en-US",
} as const

export const SOCIAL = {
  github: "https://github.com/linkdit",
  twitter: "https://twitter.com/linkdit",
  linkedin: "https://linkedin.com/company/linkdit",
  email: "hello@linkdit.com",
} as const
