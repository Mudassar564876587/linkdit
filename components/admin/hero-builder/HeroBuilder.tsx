"use client"

import { useState, useCallback } from "react"
import { RotateCcw, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { HeroConfig } from "./types"
import { defaultConfig } from "./types"
import AnnouncementEditor from "./AnnouncementEditor"
import HeadingEditor from "./HeadingEditor"
import DescriptionEditor from "./DescriptionEditor"
import ButtonEditor from "./ButtonEditor"
import SearchEditor from "./SearchEditor"
import BackgroundEditor from "./BackgroundEditor"
import ClockEditor from "./ClockEditor"
import MediaEditor from "./MediaEditor"
import SEOEditor from "./SEOEditor"
import PreviewPanel from "./PreviewPanel"
import { adminSaveHero } from "@/actions/admin/hero"

export default function HeroBuilder({ initial }: { initial?: HeroConfig }) {
  const [config, setConfig] = useState<HeroConfig>(initial ?? structuredClone(defaultConfig))
  const [saving, setSaving] = useState(false)

  const update = useCallback(<S extends keyof HeroConfig>(section: S, value: Partial<HeroConfig[S]>) => {
    setConfig(prev => ({ ...prev, [section]: { ...prev[section], ...value } }))
  }, [])

  async function handleSave() {
    setSaving(true)
    const result = await adminSaveHero(config)
    setSaving(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Hero configuration saved to database.")
    }
  }

  function handleReset() {
    const fresh = structuredClone(defaultConfig)
    setConfig(fresh)
    toast.success("Form reset to defaults. Click Save to persist.")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={handleReset} className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm">
            <RotateCcw className="h-4 w-4" />
            Reset Defaults
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className="btn-primary inline-flex items-center gap-2 px-6 py-2 text-sm disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Update"}
          </button>
        </div>

        <AnnouncementEditor value={config.announcement} onChange={v => update("announcement", v)} />
        <HeadingEditor value={config.heading} onChange={v => update("heading", v)} />
        <DescriptionEditor value={config.description} onChange={v => update("description", v)} />
        <ButtonEditor value={config.buttons} onChange={v => update("buttons", v)} />
        <SearchEditor value={config.search} onChange={v => update("search", v)} />
        <BackgroundEditor value={config.background} onChange={v => update("background", v)} />
        <ClockEditor value={config.clock} onChange={v => update("clock", v)} />
        <MediaEditor value={config.media} onChange={v => update("media", v)} />
        <SEOEditor value={config.seo} onChange={v => update("seo", v)} />
      </div>

      {/* Preview — hidden on mobile */}
      <div className="hidden lg:block">
        <PreviewPanel config={config} />
      </div>
    </div>
  )
}
