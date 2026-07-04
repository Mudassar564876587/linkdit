import { createClient } from "@supabase/supabase-js"
import type { Database } from "../database.types"

function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set."
    )
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}

let client: ReturnType<typeof createBrowserClient> | null = null

export function getBrowserClient() {
  if (!client) {
    client = createBrowserClient()
  }
  return client
}
