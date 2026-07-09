import { redirect, notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { LayoutDashboard, Grid3X3, Users, Star, FileText, Image, Settings, Mail, Activity, Send, Newspaper, Tags } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

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

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: adminUser } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", user.id)
    .single()

  if (adminUser?.role !== "admin") notFound()

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col border-r border-border bg-background">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/linkdit-studio-8k92" className="text-lg font-bold text-foreground">
            Admin
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <link.icon className="h-4 w-4" aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            &larr; Dashboard
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-8">{children}</main>
    </div>
  )
}
