"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useParallax } from "@/hooks/use-parallax"

export default function HeroClient({ children }: { children: ReactNode }) {
  const { ref, style } = useParallax(0.15)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <div
      ref={ref}
      style={style}
      className={`transition-all duration-[800ms] ease-out ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  )
}