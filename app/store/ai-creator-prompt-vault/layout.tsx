import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Creator Prompt Vault",
  description: "Premium collection of 700+ AI video prompts for TikTok, Reels, and YouTube Shorts. Copy, paste, and create viral content instantly.",
  alternates: { canonical: "/store/ai-creator-prompt-vault" },
  openGraph: {
    title: "AI Creator Prompt Vault | LinkDit",
    description: "Premium collection of 700+ AI video prompts for TikTok, Reels, and YouTube Shorts. Copy, paste, and create viral content instantly.",
    url: "/store/ai-creator-prompt-vault",
    siteName: "LinkDit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Creator Prompt Vault | LinkDit",
    description: "Premium collection of 700+ AI video prompts for TikTok, Reels, and YouTube Shorts. Copy, paste, and create viral content instantly.",
  },
}

export default function PromptVaultLayout({ children }: { children: React.ReactNode }) {
  return children
}
