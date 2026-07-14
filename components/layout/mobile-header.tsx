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
          "fixed top-[calc(0.5rem+env(safe-area-inset-top,0px))] left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl rounded-2xl transition-all duration-500 ease-out",
          scrolled
            ? "glass-nav-scrolled h-14"
            : "bg-white/40 backdrop-blur-xl border border-white/20 shadow-sm h-16"
        )}
      >
        <div className="flex h-full items-center justify-between px-5">
          <Logo />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
            className="h-11 w-11"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
