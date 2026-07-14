import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about LinkDit — accounts, AI tools, pricing, store, privacy, security, submissions, SEO, affiliate program, and advertising.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ | LinkDit",
    description: "Frequently asked questions about LinkDit — accounts, AI tools, pricing, store, privacy, security, submissions, SEO, affiliate program, and advertising.",
    url: "/faq",
    siteName: "LinkDit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | LinkDit",
    description: "Frequently asked questions about LinkDit — accounts, AI tools, pricing, store, privacy, security, submissions, SEO, affiliate program, and advertising.",
  },
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children
}
