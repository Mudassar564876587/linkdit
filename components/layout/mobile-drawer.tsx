"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"
import {
  Search, X, Plus, FileEdit, LayoutGrid, BookOpen,
  FolderTree, GitCompare, ShoppingBag, Info,
  LogIn, LogOut, User, Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/ui/logo"
import { logout } from "@/actions/auth/logout"
import { cn } from "@/lib/utils"

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

type UserData = {
  id: string
  email: string | undefined
  fullName: string | undefined
  avatarUrl: string | undefined
} | null

const drawerLinks = [
  { href: "/tools", label: "AI Tools", icon: LayoutGrid },
  { href: "/articles", label: "Articles", icon: BookOpen },
  { href: "/categories", label: "Categories", icon: FolderTree },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/store", label: "Store", icon: ShoppingBag },
  { href: "/about", label: "About", icon: Info },
]

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [user, setUser] = useState<UserData>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        setUser({
          id: u.id, email: u.email,
          fullName: u.user_metadata?.full_name ?? u.email?.split("@")[0] ?? "User",
          avatarUrl: u.user_metadata?.avatar_url,
        })
      }
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      if (u) {
        setUser({
          id: u.id, email: u.email,
          fullName: u.user_metadata?.full_name ?? u.email?.split("@")[0] ?? "User",
          avatarUrl: u.user_metadata?.avatar_url,
        })
      } else {
        setUser(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const initials = (user?.fullName ?? "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] transition-opacity duration-[var(--duration-large)] ease-[var(--ease-smooth)]",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        className={cn(
          "absolute right-0 top-0 flex h-full w-4/5 max-w-sm flex-col border-l border-border/60 bg-white shadow-2xl transition-all duration-[var(--duration-xl)] ease-[var(--ease-spring)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-5">
          <Logo />
          <Button ref={closeButtonRef} variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation menu" className="h-11 w-11">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-8">
            <Link
              href="/tools"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl bg-primary/[0.04] px-4 py-3.5 text-sm font-medium text-foreground transition-all duration-[var(--duration-standard)] ease-[var(--ease-default)] hover:bg-primary/[0.08] hover:scale-[1.02] active:scale-[0.97]"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span>Search AI tools...</span>
            </Link>
          </div>

          <nav aria-label="Mobile navigation">
            <div className="space-y-0.5">
              {drawerLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-foreground transition-all duration-[var(--duration-standard)] ease-[var(--ease-default)] hover:bg-accent hover:scale-[1.02] active:scale-[0.97]"
                    onClick={onClose}
                  >
                    <Icon className="h-[18px] w-[18px] text-muted-foreground" />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </nav>

          <div className="mt-10 space-y-3">
            <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Contribute
            </p>
            <Button asChild className="w-full items-center gap-2 rounded-xl">
              <Link href="/submit-tool" onClick={onClose}>
                <Plus className="h-4 w-4" />
                Submit Tool
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full items-center gap-2 rounded-xl">
              <Link href="/submit-article" onClick={onClose}>
                <FileEdit className="h-4 w-4" />
                Write Article
              </Link>
            </Button>
          </div>
        </div>

        <div className="border-t border-border/50 px-4 py-5">
          {loading ? (
            <div className="flex justify-center py-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-border/50" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-600 text-sm font-semibold text-white">
                    {initials}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{user.fullName}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <form action={async () => { onClose(); await logout() }}>
                <Button type="submit" variant="outline" className="w-full items-center gap-2 rounded-xl">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </form>
            </div>
          ) : (
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link href="/login" onClick={onClose}>
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
          <p className="mt-4 text-center text-xs text-muted-foreground/60">&copy; {new Date().getFullYear()} LinkDit</p>
        </div>
      </div>
    </div>
  )
}
