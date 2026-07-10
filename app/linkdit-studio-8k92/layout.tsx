import { redirect, notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { AdminShell } from "./admin-shell"
import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: adminUser } = await supabase
    .from("users")
    .select("role, full_name, avatar_url")
    .eq("id", user.id)
    .single()

  if (adminUser?.role !== "admin") notFound()

  return <AdminShell userName={adminUser.full_name || "Admin"}>{children}</AdminShell>
}
