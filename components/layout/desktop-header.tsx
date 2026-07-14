"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/ui/logo"
import UserMenu from "@/components/layout/user-menu"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/tools", label: "AI Tools" },
  { href: "/articles", label: "Articles" },
  { href: "/categories", label: "Categories" },
  { href: "/compare", label: "Compare" },
  { href: "/store", label: "Store" },
  { href: "/about", label: "About" },
]

export default function DesktopHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-[calc(0.75rem+env(safe-area-inset-top,0px))] left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl rounded-2xl transition-all duration-500",
        scrolled
          ? "bg-white/70 backdrop-blur-2xl saturate-[1.4] border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
          : "bg-white/30 backdrop-blur-xl border border-white/20 shadow-sm"
      )}
    >
      <div className="flex h-14 items-center justify-between px-5">
        <Logo />

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50"
            >
              {link.label}
              <span className="absolute inset-x-3 bottom-0 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/tools"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-accent/50 hover:text-foreground"
            aria-label="Search tools"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/submit-tool"
            className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Submit Tool
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
