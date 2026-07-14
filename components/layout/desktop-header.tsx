"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Plus } from "lucide-react"
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
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-[calc(0.75rem+env(safe-area-inset-top,0px))] left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl rounded-2xl transition-all duration-500 ease-out",
        scrolled
          ? "glass-nav-scrolled h-14"
          : "bg-white/40 backdrop-blur-xl border border-white/20 shadow-sm h-16"
      )}
    >
      <div className="flex h-full items-center justify-between px-6">
        <Logo />

        <nav className="flex items-center gap-0.5" role="navigation" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative rounded-lg px-4 py-2 text-[0.9375rem] font-medium transition-all duration-200",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/tools"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-accent/60 hover:text-foreground hover:scale-105 active:scale-95"
            aria-label="Search tools"
          >
            <Search className="h-[18px] w-[18px]" />
          </Link>
          <Link
            href="/submit-tool"
            className="hidden xl:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Submit Tool
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
