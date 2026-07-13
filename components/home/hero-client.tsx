"use client"

import { type ReactNode } from "react"
import { motion } from "framer-motion"
import { useParallax } from "@/hooks/use-parallax"

export default function HeroClient({ children }: { children: ReactNode }) {
  const { ref, style } = useParallax(0.15)

  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}