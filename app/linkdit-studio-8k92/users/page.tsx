import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import AdminUsersClient from "./admin-users-client"

export const metadata: Metadata = { title: "Users | Admin | LinkDit" }

export default async function AdminUsersPage() {
  const admin = getAdminClient()
  const { data: users } = await admin.from("users").select("*").order("created_at", { ascending: false })

  return <AdminUsersClient users={users ?? []} />
}
