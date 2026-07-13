"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/ui/logo"
import MobileDrawer from "./mobile-drawer"
import { cn } from "@/lib/utils"

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-[calc(0.5rem+env(safe-area-inset-top,0px))] left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl rounded-2xl transition-all duration-500",
          scrolled
            ? "bg-white/75 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
            : "bg-white/40 backdrop-blur-xl border border-white/20"
        )}
      >
        <div className="flex h-14 items-center justify-between px-5">
          <Logo />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
