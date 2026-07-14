import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Tutorials",
  description: "Learn AI step by step with beginner to advanced tutorials covering ChatGPT, Claude, Gemini, Cursor, and more. Start learning today.",
  alternates: { canonical: "/tutorials" },
  openGraph: {
    title: "AI Tutorials | LinkDit",
    description: "Learn AI step by step with beginner to advanced tutorials covering ChatGPT, Claude, Gemini, Cursor, and more. Start learning today.",
    url: "/tutorials",
    siteName: "LinkDit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tutorials | LinkDit",
    description: "Learn AI step by step with beginner to advanced tutorials covering ChatGPT, Claude, Gemini, Cursor, and more. Start learning today.",
  },
}

export default function TutorialsLayout({ children }: { children: React.ReactNode }) {
  return children
}
