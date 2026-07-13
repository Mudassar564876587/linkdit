"use client"

import { useEffect, useRef } from "react"

export default function HeroClient({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = section.getBoundingClientRect()
      const x = (e.clientX - left) / width - 0.5
      const y = (e.clientY - top) / height - 0.5

      const bgBlobs = section.querySelectorAll<HTMLElement>("[data-parallax]")
      bgBlobs.forEach((blob, i) => {
        const factor = (i + 1) * 10
        blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return <div ref={sectionRef}>{children}</div>
}
