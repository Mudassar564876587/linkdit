import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import BookmarksList from "./bookmarks-list"

export default async function BookmarksPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("id, created_at, tool_id, tools!inner(id, name, slug, description, logo_url, rating, pricing)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bookmarks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {bookmarks?.length ?? 0} saved tool{(bookmarks?.length ?? 0) !== 1 ? "s" : ""}
        </p>
      </div>

      <BookmarksList bookmarks={bookmarks ?? []} />
    </div>
  )
}
