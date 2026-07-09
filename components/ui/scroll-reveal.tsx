"use client"

import { type ReactNode } from "react"
import { motion } from "framer-motion"

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export default function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, rotateX: -15, y: 40 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      viewport={{ once: true, margin: "-50px" }}
      className={className}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  )
}

export function ScrollRevealGrid({
  children,
  className = "",
  staggerDelay = 0.08,
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, rotateX: -15, y: 40 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * staggerDelay }}
              viewport={{ once: true, margin: "-50px" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </div>
  )
}