"use client"

import { type ReactNode } from "react"
import { useParallax } from "@/hooks/use-parallax"

export default function HeroClient({ children }: { children: ReactNode }) {
  const { ref, style } = useParallax(0.15)

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  )
}