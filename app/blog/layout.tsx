import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Blog",
  description: "Latest AI news, comparisons, tutorials, and industry insights. Stay ahead with expert analysis of the AI landscape from LinkDit.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "AI Blog | LinkDit",
    description: "Latest AI news, comparisons, tutorials, and industry insights. Stay ahead with expert analysis of the AI landscape from LinkDit.",
    url: "/blog",
    siteName: "LinkDit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Blog | LinkDit",
    description: "Latest AI news, comparisons, tutorials, and industry insights. Stay ahead with expert analysis of the AI landscape from LinkDit.",
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
