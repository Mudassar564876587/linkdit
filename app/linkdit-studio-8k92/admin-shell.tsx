"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Grid3X3, Users, Star, FileText, Image, Settings,
  Mail, Activity, Send, Newspaper, Tags, Menu, X, ChevronLeft,
  Sun, Moon, ShieldCheck, Bell, Search,
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/linkdit-studio-8k92", label: "Dashboard", icon: LayoutDashboard },
  { href: "/linkdit-studio-8k92/submissions", label: "Tool Submissions", icon: Send },
  { href: "/linkdit-studio-8k92/article-submissions", label: "Article Submissions", icon: Newspaper },
  { href: "/linkdit-studio-8k92/tools", label: "Tools", icon: Grid3X3 },
  { href: "/linkdit-studio-8k92/categories", label: "Categories", icon: Grid3X3 },
  { href: "/linkdit-studio-8k92/tags", label: "Tags", icon: Tags },
  { href: "/linkdit-studio-8k92/users", label: "Users", icon: Users },
  { href: "/linkdit-studio-8k92/reviews", label: "Reviews", icon: Star },
  { href: "/linkdit-studio-8k92/articles", label: "Articles", icon: FileText },
  { href: "/linkdit-studio-8k92/resources", label: "Resources", icon: FileText },
  { href: "/linkdit-studio-8k92/comparisons", label: "Comparisons", icon: Star },
  { href: "/linkdit-studio-8k92/media", label: "Media", icon: Image },
  { href: "/linkdit-studio-8k92/settings", label: "Settings", icon: Settings },
  { href: "/linkdit-studio-8k92/newsletter", label: "Newsletter", icon: Mail },
  { href: "/linkdit-studio-8k92/system", label: "System", icon: Activity },
]

const SIDEBAR_EXPANDED = 260
const SIDEBAR_COLLAPSED = 72

export function AdminShell({ children, userName }: { children: React.ReactNode; userName: string }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("admin-sidebar-open")
    if (saved !== null) setSidebarOpen(saved === "true")
  }, [])

  useEffect(() => {
    if (mounted) localStorage.setItem("admin-sidebar-open", String(sidebarOpen))
  }, [sidebarOpen, mounted])

  const isActive = useCallback((href: string) => {
    if (href === "/linkdit-studio-8k92") return pathname === href
    return pathname.startsWith(href)
  }, [pathname])

  const sidebarWidth = useMemo(() => sidebarOpen ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED, [sidebarOpen])

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-border bg-background transition-all duration-300 ease-in-out",
          "lg:static lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        style={{ width: sidebarOpen ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED }}
      >
        {/* Logo area */}
        <div className={cn(
          "flex h-16 items-center border-b border-border shrink-0",
          sidebarOpen ? "justify-between px-5" : "justify-center px-3"
        )}>
          {sidebarOpen ? (
            <>
              <Link href="/linkdit-studio-8k92" className="text-lg font-bold text-foreground tracking-tight">
                LinkDit<span className="text-primary">Admin</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link href="/linkdit-studio-8k92" className="text-lg font-bold text-primary" aria-label="Admin Home">
                <ShieldCheck className="h-6 w-6" />
              </Link>
              <div className="hidden lg:flex" /> {/* spacer */}
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "mx-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive(link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                !sidebarOpen && "justify-center mx-1.5"
              )}
              title={!sidebarOpen ? link.label : undefined}
            >
              <link.icon className={cn("h-4 w-4 shrink-0", sidebarOpen ? "" : "h-5 w-5")} aria-hidden="true" />
              <span className={cn(
                "transition-opacity duration-200 truncate",
                sidebarOpen ? "opacity-100" : "hidden"
              )}>
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Bottom link */}
        <div className="border-t border-border p-4">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors",
              !sidebarOpen && "justify-center"
            )}
            title={!sidebarOpen ? "User Dashboard" : undefined}
          >
            <ChevronLeft className={cn("h-4 w-4 shrink-0", !sidebarOpen && "h-5 w-5")} />
            <span className={cn(
              "transition-opacity duration-200",
              sidebarOpen ? "opacity-100" : "hidden"
            )}>
              User Dashboard
            </span>
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <div
        className="flex flex-1 flex-col transition-all duration-300"
        style={{ marginLeft: 0 }}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger - visible on mobile, also on desktop for collapse */}
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileOpen(true)
                } else {
                  setSidebarOpen((prev) => !prev)
                }
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Mobile close button */}
            {mobileOpen && (
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}

            {/* Admin avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {userName?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
