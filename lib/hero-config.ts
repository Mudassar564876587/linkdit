import { getAdminClient } from "@/lib/supabase/admin"
import type { HeroConfig } from "@/components/admin/hero-builder/types"
import { defaultConfig } from "@/components/admin/hero-builder/types"

export async function getHeroConfig(): Promise<HeroConfig> {
  try {
    const admin = getAdminClient()
    const { data, error } = await (admin
      .from("hero_settings") as any)
      .select("config")
      .eq("id", 1)
      .single()

    if (error || !data) return structuredClone(defaultConfig)
    return data.config as HeroConfig
  } catch {
    return structuredClone(defaultConfig)
  }
}
