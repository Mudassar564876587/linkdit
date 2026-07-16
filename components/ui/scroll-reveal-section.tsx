"use client"

import { useEffect, useRef, useState } from "react"

type RevealAnimation = "fade-in" | "slide-up" | "slide-up-sm" | "scale-in"

type ScrollRevealSectionProps = {
  children: React.ReactNode
  className?: string
  animation?: RevealAnimation
  delay?: number
  duration?: string
}

export default function ScrollRevealSection({
  children,
  className = "",
  animation = "slide-up",
  delay = 0,
  duration = "var(--duration-large)",
}: ScrollRevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? `animate-${animation}` : "opacity-0"}`}
      style={{
        animationDuration: duration,
        animationFillMode: "both",
        animationTimingFunction: "var(--ease-smooth)",
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
