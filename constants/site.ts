export const SITE = {
  name: "LinkDit",
  tagline: "Discover, Compare & Master the World's Best AI Tools",
  description:
    "Explore AI tools, tutorials, comparisons and resources designed to help creators, developers, students and businesses work smarter.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://linkdit.online",
  locale: "en-US",
  localeOg: "en_US",
} as const

export const SOCIAL = {
  github: "https://github.com/linkdit",
  twitter: "https://twitter.com/linkdit",
  linkedin: "https://linkedin.com/company/linkdit",
  email: "hello@linkdit.com",
} as const

export const TELEGRAM_BOT = {
  username: process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "YourBotUsername",
} as const
