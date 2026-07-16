import type { Metadata } from "next"
import HeroBuilder from "@/components/admin/hero-builder/HeroBuilder"
import { getHeroConfig } from "@/lib/hero-config"

export const metadata: Metadata = { title: "Hero Builder | Admin | LinkDit" }

export default async function HeroBuilderPage() {
  const config = await getHeroConfig()

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hero Builder</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Customize the homepage hero section. Changes are saved to the database and immediately available for the next deploy.
        </p>
      </div>
      <HeroBuilder initial={config} />
    </div>
  )
}
