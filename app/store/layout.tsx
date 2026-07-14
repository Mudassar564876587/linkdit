import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Store – AI Creator Prompt Vault",
  description: "Premium AI video prompts and digital products for creators. Get 700+ high-converting prompts for TikTok, Reels, and YouTube Shorts.",
  alternates: { canonical: "/store" },
  openGraph: {
    title: "Store – AI Creator Prompt Vault | LinkDit",
    description: "Premium AI video prompts and digital products for creators. Get 700+ high-converting prompts for TikTok, Reels, and YouTube Shorts.",
    url: "/store",
    siteName: "LinkDit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Store – AI Creator Prompt Vault | LinkDit",
    description: "Premium AI video prompts and digital products for creators. Get 700+ high-converting prompts for TikTok, Reels, and YouTube Shorts.",
  },
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return children
}
