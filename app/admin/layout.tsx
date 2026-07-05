import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { LayoutDashboard, Grid3X3, Users, Star, FileText, Image, Settings, Mail, Activity, Send, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/submissions", label: "Submissions", icon: Send },
  { href: "/admin/tools", label: "Tools", icon: Grid3X3 },
  { href: "/admin/categories", label: "Categories", icon: Grid3X3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/articles", label: "Blog", icon: FileText },
  { href: "/admin/resources", label: "Resources", icon: FileText },
  { href: "/admin/comparisons", label: "Comparisons", icon: Star },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/system", label: "System", icon: Activity },
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

  if (adminUser?.role !== "admin") redirect("/dashboard")

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col border-r border-border bg-background">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/admin" className="text-lg font-bold text-foreground">
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
