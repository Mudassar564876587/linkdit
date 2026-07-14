"use client"

import { Star, BarChart3, BookOpen, Zap, Layers, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { StaggerChildren } from "@/components/ui/reveal-on-scroll"

const items = [
  { icon: Star, title: "Curated Excellence", desc: "Every tool is manually reviewed and categorized based on real-world performance, features, and user feedback." },
  { icon: BarChart3, title: "Side-by-Side Comparisons", desc: "Compare features, pricing, and ratings across similar tools to make informed decisions faster." },
  { icon: BookOpen, title: "Expert Tutorials & Guides", desc: "Learn how to get the most out of AI tools with step-by-step tutorials written by industry experts." },
  { icon: Zap, title: "Verified Ratings", desc: "All ratings come from verified users, ensuring authenticity and helping you avoid overhyped tools." },
  { icon: Layers, title: "Comprehensive Categories", desc: "From AI writing and image generation to coding and analytics — we cover every major AI category." },
  { icon: ShieldCheck, title: "Transparent Pricing", desc: "Clear pricing labels — Free, Freemium, or Paid — so you know exactly what to expect before visiting a tool." },
]

export function ToolsFeaturesGrid() {
  return (
    <StaggerChildren className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <motion.div
          key={item.title}
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          className="group relative rounded-2xl border border-border/40 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 transition-transform duration-300 group-hover:scale-110">
            <item.icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
        </motion.div>
      ))}
    </StaggerChildren>
  )
}
