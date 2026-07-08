"use client"

import { useState, useCallback } from "react"
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

  const closeMenu = useCallback(() => setIsOpen(false), [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              <span className="absolute inset-x-3 -bottom-px h-px scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-0" />
              <span className="absolute inset-x-3 -bottom-px h-px origin-left scale-x-0 bg-primary transition-transform duration-200 hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" asChild className="hidden sm:inline-flex items-center gap-1.5">
            <Link href="/submit-article">
              <FileEdit className="h-4 w-4" />
              Write Article
            </Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex items-center gap-1.5">
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
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-border md:hidden">
          <div className="space-y-1 px-4 pb-6 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 sm:hidden">
              <Button asChild className="w-full items-center gap-1.5">
                <Link href="/submit-article" onClick={closeMenu}>
                  <FileEdit className="h-4 w-4" />
                  Write Article
                </Link>
              </Button>
              <Button asChild className="w-full items-center gap-1.5">
                <Link href="/submit-tool" onClick={closeMenu}>
                  <Plus className="h-4 w-4" />
                  Submit Tool
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
