import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import AdminCategoriesClient from "./admin-categories-client"

export const metadata: Metadata = { title: "Categories | Admin | LinkDit" }

export default async function AdminCategoriesPage() {
  const admin = getAdminClient()
  const { data: categories } = await admin.from("categories").select("*").order("name")

  return <AdminCategoriesClient categories={categories ?? []} />
}
