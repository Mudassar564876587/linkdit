"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import {
  Search,
  X,
  Plus,
  FileEdit,
  LayoutGrid,
  BookOpen,
  FolderTree,
  Globe,
  GitCompare,
  Info,
  LogIn,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/ui/logo"

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const drawerLinks = [
  { href: "/ai-tools", label: "AI Tools", icon: LayoutGrid },
  { href: "/articles", label: "Articles", icon: BookOpen },
  { href: "/categories", label: "Categories", icon: FolderTree },
  { href: "/resources", label: "Resources", icon: Globe },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/about", label: "About", icon: Info },
]

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onClose])

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-xl" onClick={onClose} />

      <div
        ref={drawerRef}
        className={`absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Logo />
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-6">
            <Link
              href="/tools"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl bg-accent/50 px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              <Search className="h-5 w-5" />
              Search AI tools...
            </Link>
          </div>

          <div className="space-y-1">
            {drawerLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                  onClick={onClose}
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="mt-8 space-y-3">
            <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contribute
            </p>
            <Button asChild className="w-full items-center gap-1.5">
              <Link href="/submit-tool" onClick={onClose}>
                <Plus className="h-4 w-4" />
                Submit Tool
              </Link>
            </Button>
            <Button variant="secondary" asChild className="w-full items-center gap-1.5">
              <Link href="/submit-article" onClick={onClose}>
                <FileEdit className="h-4 w-4" />
                Write Article
              </Link>
            </Button>
          </div>
        </div>

        <div className="border-t border-border px-4 py-5">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login" onClick={onClose}>
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} LinkDit
          </p>
        </div>
      </div>
    </div>
  )
}
