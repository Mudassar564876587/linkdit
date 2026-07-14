import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Guides",
  description: "Comprehensive AI guides for creators, developers and businesses. Master prompt engineering, AI automation, content creation and more.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "AI Guides | LinkDit",
    description: "Comprehensive AI guides for creators, developers and businesses. Master prompt engineering, AI automation, content creation and more.",
    url: "/guides",
    siteName: "LinkDit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Guides | LinkDit",
    description: "Comprehensive AI guides for creators, developers and businesses. Master prompt engineering, AI automation, content creation and more.",
  },
}

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return children
}
