"use client"

import { useRef, useCallback, type ReactNode } from "react"

type TiltCardProps = {
  children: ReactNode
  className?: string
  maxTilt?: number
  glareColor?: string
  glareOpacity?: number
  disabled?: boolean
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glareColor = "rgba(255,255,255,0.6)",
  glareOpacity = 0.12,
  disabled = false,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const isMobile = typeof window !== "undefined" && "ontouchstart" in window
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || isMobile || prefersReduced || !cardRef.current || !glareRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateY = ((x - centerX) / centerX) * maxTilt
      const rotateX = ((centerY - y) / centerY) * maxTilt

      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      glareRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, ${glareColor} 0%, transparent 70%)`
      glareRef.current.style.opacity = String(glareOpacity)
    },
    [maxTilt, glareColor, glareOpacity, disabled, isMobile, prefersReduced]
  )

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current || !glareRef.current) return
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)"
    cardRef.current.style.transition = "transform 300ms ease"
    glareRef.current.style.opacity = "0"
    setTimeout(() => {
      if (cardRef.current) cardRef.current.style.transition = ""
    }, 300)
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          opacity: 0,
          transition: "opacity 200ms ease",
          borderRadius: "inherit",
        }}
      />
    </div>
  )
}