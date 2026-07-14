import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Glossary",
  description: "Understand every important AI term. Comprehensive glossary covering LLM, RAG, embeddings, tokens, fine-tuning, and hundreds more AI concepts.",
  alternates: { canonical: "/glossary" },
  openGraph: {
    title: "AI Glossary | LinkDit",
    description: "Understand every important AI term. Comprehensive glossary covering LLM, RAG, embeddings, tokens, fine-tuning, and hundreds more AI concepts.",
    url: "/glossary",
    siteName: "LinkDit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Glossary | LinkDit",
    description: "Understand every important AI term. Comprehensive glossary covering LLM, RAG, embeddings, tokens, fine-tuning, and hundreds more AI concepts.",
  },
}

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return children
}
