import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import AdminCategoriesClient from "./admin-categories-client"

export const metadata: Metadata = { title: "Categories | Admin | LinkDit" }

export default async function AdminCategoriesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return <AdminCategoriesClient categories={categories ?? []} />
}
