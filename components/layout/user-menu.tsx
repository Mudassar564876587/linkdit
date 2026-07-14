"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"
import { User, LogOut, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/actions/auth/logout"
import { cn } from "@/lib/utils"

type UserData = {
  id: string
  email: string | undefined
  fullName: string | undefined
  avatarUrl: string | undefined
} | null

export default function UserMenu() {
  const [user, setUser] = useState<UserData>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        setUser({
          id: u.id,
          email: u.email,
          fullName: u.user_metadata?.full_name ?? u.email?.split("@")[0] ?? "User",
          avatarUrl: u.user_metadata?.avatar_url,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      if (u) {
        setUser({
          id: u.id,
          email: u.email,
          fullName: u.user_metadata?.full_name ?? u.email?.split("@")[0] ?? "User",
          avatarUrl: u.user_metadata?.avatar_url,
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="flex h-9 w-9 items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <Button asChild size="sm">
        <Link href="/login">Sign in</Link>
      </Button>
    )
  }

  const initials = (user.fullName ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-full p-0.5 pr-2.5 transition-all duration-200",
          open ? "bg-accent/80" : "hover:bg-accent/60"
        )}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={user.fullName ? `User menu: ${user.fullName}` : "User menu"}
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="h-8 w-8 rounded-full object-cover ring-2 ring-border/50"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-600 text-xs font-semibold text-white shadow-sm">
            {initials}
          </span>
        )}
        <span className="hidden text-sm font-medium text-foreground sm:block">
          {user.fullName}
        </span>
        <ChevronDown
          className={cn(
            "hidden h-4 w-4 text-muted-foreground transition-transform duration-200 sm:block",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-xl border border-border/60 bg-white p-1.5 shadow-xl animate-dropdown"
          role="menu"
        >
          <div className="border-b border-border/50 px-3 pb-3 pt-2.5">
            <p className="truncate text-sm font-semibold text-foreground">
              {user.fullName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>

          <div className="mt-1 space-y-0.5">
            <Link
              href="/onboarding"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-all duration-150 hover:bg-accent/70"
              role="menuitem"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              Profile settings
            </Link>
            <form
              action={async () => {
                setOpen(false)
                await logout()
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-all duration-150 hover:bg-destructive/8"
                role="menuitem"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
