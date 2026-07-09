"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { Search, Menu, X, Plus, FileEdit } from "lucide-react"
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen])

  const closeMenu = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-border/60 bg-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-1 md:flex">
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
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile slide-over drawer */}
      {mounted && (
        <div
          className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-white/70 backdrop-blur-xl"
            onClick={closeMenu}
          />

          {/* Drawer panel */}
          <div
            ref={drawerRef}
            className={`absolute right-0 top-0 flex h-full w-[85%] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <Logo />
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Contribute
                </p>
                <Button asChild className="w-full items-center gap-1.5">
                  <Link href="/submit-tool" onClick={closeMenu}>
                    <Plus className="h-4 w-4" />
                    Submit Tool
                  </Link>
                </Button>
                <Button variant="secondary" asChild className="w-full items-center gap-1.5">
                  <Link href="/submit-article" onClick={closeMenu}>
                    <FileEdit className="h-4 w-4" />
                    Write Article
                  </Link>
                </Button>
              </div>
            </nav>

            <div className="border-t border-border px-4 py-5">
              <p className="text-xs text-muted-foreground text-center">
                &copy; {new Date().getFullYear()} LinkDit
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}