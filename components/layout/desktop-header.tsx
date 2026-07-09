"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Plus, FileEdit } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/ui/logo"
import UserMenu from "@/components/layout/user-menu"

const navLinks = [
  { href: "/ai-tools", label: "AI Tools" },
  { href: "/articles", label: "Articles" },
  { href: "/categories", label: "Categories" },
  { href: "/resources", label: "Resources" },
  { href: "/compare", label: "Compare" },
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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground"
            >
              {link.label}
              <span className="absolute inset-x-3 -bottom-px h-px origin-left scale-x-0 bg-primary transition-transform duration-200 hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" asChild className="hidden lg:inline-flex items-center gap-1.5">
            <Link href="/submit-article">
              <FileEdit className="h-4 w-4" />
              Write Article
            </Link>
          </Button>
          <Button asChild className="hidden lg:inline-flex items-center gap-1.5">
            <Link href="/submit-tool">
              <Plus className="h-4 w-4" />
              Submit Tool
            </Link>
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
