import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import AdminUsersClient from "./admin-users-client"

export const metadata: Metadata = { title: "Users | Admin | LinkDit" }

export default async function AdminUsersPage() {
  const supabase = await createServerSupabaseClient()
  const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  return <AdminUsersClient users={users ?? []} />
}
