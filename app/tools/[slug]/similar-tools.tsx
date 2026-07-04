import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function SimilarTools({
  currentToolId,
  categoryId,
}: {
  currentToolId: string
  categoryId: string
}) {
  const supabase = await createServerSupabaseClient()

  const { data: tools } = await supabase
    .from("tools")
    .select("id, name, slug, logo_url, rating, pricing")
    .eq("is_published", true)
    .eq("category_id", categoryId)
    .neq("id", currentToolId)
    .order("rating", { ascending: false })
    .limit(4)

  if (!tools?.length) return null

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground">Similar tools</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((t) => (
          <Link
            key={t.id}
            href={`/tools/${t.slug}`}
            className="rounded-xl border border-border bg-background p-4 transition-colors hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                {t.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.rating}/5 &middot; {t.pricing}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
