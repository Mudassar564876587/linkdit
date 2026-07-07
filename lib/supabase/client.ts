import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "../database.types"

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getBrowserClient() {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set."
      )
    }

    client = createBrowserClient<Database>(supabaseUrl, supabaseKey)
  }
  return client
}
