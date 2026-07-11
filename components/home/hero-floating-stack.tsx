"use client"

import { useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Zap, Sparkles, ShieldCheck, Bot } from "lucide-react"

const stackCards = [
  { name: "ChatGPT", gradient: "from-emerald-500 to-emerald-600", pricing: "Free", icon: Sparkles, letterColor: "#059669" },
  { name: "Claude", gradient: "from-orange-500 to-orange-600", pricing: "Preemium", icon: Bot, letterColor: "#ea580c" },
  { name: "Midjourney", gradient: "from-violet-500 to-violet-600", pricing: "Paid", icon: Zap, letterColor: "#7c3aed" },
  { name: "Cursor", gradient: "from-blue-500 to-blue-600", pricing: "Free", icon: ShieldCheck, letterColor: "#2563eb" },
]

export default function HeroFloatingStack() {
  const stackRef = useRef<HTMLDivElement>(null)
  const isMobile = typeof window !== "undefined" && "ontouchstart" in window
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile || prefersReduced || !stackRef.current) return
    const rect = stackRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    stackRef.current.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${y * -4}deg)`
  }, [isMobile, prefersReduced])

  const handleMouseLeave = useCallback(() => {
    if (!stackRef.current) return
    stackRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)"
    stackRef.current.style.transition = "transform 500ms ease"
    setTimeout(() => {
      if (stackRef.current) stackRef.current.style.transition = ""
    }, 500)
  }, [])

  return (
    <div className="flex justify-center" style={{ perspective: "800px" }}>
      <div
        ref={stackRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative"
        style={{
          width: 256,
          height: 210,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {stackCards.map((card, i) => {
          const offset = i * 14
          const rotation = (i - 1.5) * 2
          return (
            <motion.div
              key={card.name}
              className="absolute rounded-xl border border-border/60 bg-white shadow-premium-lg overflow-hidden"
              style={{
                width: 240,
                height: 72,
                top: offset,
                left: 8,
                zIndex: stackCards.length - i,
                transform: `rotate(${rotation}deg)`,
                transformStyle: "preserve-3d",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4, ease: "easeOut" }}
            >
              <div className="flex h-full items-center gap-3 px-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${card.gradient} text-white shadow-sm`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{card.name}</p>
                  <span className="text-xs font-medium text-muted-foreground">{card.pricing}</span>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted font-bold text-sm shadow-sm" style={{ color: card.letterColor }}>
                  {card.name[0]}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}