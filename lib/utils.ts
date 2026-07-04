import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const avatarColors = [
  "bg-emerald-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-blue-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-pink-500",
]

export function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

const categoryIconMap: Record<string, string> = {
  "ai-writing": "PenLine",
  "image-generation": "Image",
  video: "Video",
  coding: "Code2",
  productivity: "Zap",
  marketing: "BarChart3",
  audio: "Music",
  analytics: "TrendingUp",
  education: "BookOpen",
  design: "Palette",
}

export function getCategoryIcon(slug: string): string {
  return categoryIconMap[slug] ?? "PenLine"
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`
  }
  return num.toString()
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
