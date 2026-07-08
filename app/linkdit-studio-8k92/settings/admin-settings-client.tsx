"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"
import { adminUpdateSettings } from "@/actions/admin/settings"

export default function AdminSettingsClient({ initial }: { initial: Record<string, string> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setMessage(null)
    const fd = new FormData(e.currentTarget)
    const result = await adminUpdateSettings(fd)
    setLoading(false)
    if (result.success) { setMessage("Settings saved."); setTimeout(() => setMessage(null), 3000); router.refresh() }
    else setMessage(result.error || "Error saving settings.")
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      {message && (
        <div className={`rounded-lg p-3 text-sm ${message === "Settings saved." ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-background p-6">
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-foreground">Site</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="site_name" className="text-sm font-medium text-foreground">Site Name</label>
              <input id="site_name" name="site_name" defaultValue={initial.site_name || "LinkDit"}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-1">
              <label htmlFor="site_logo" className="text-sm font-medium text-foreground">Logo URL</label>
              <input id="site_logo" name="site_logo" defaultValue={initial.site_logo || ""}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="site_description" className="text-sm font-medium text-foreground">Site Description</label>
            <textarea id="site_description" name="site_description" defaultValue={initial.site_description || ""} rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
          </div>
          <div className="space-y-1">
            <label htmlFor="theme_color" className="text-sm font-medium text-foreground">Theme Color</label>
            <input id="theme_color" name="theme_color" defaultValue={initial.theme_color || "#2563EB"} type="color"
              className="h-9 w-20 rounded-lg border border-input bg-background px-2" />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-foreground">SEO</legend>
          <div className="space-y-1">
            <label htmlFor="seo_title" className="text-sm font-medium text-foreground">Default SEO Title</label>
            <input id="seo_title" name="seo_title" defaultValue={initial.seo_title || ""}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="space-y-1">
            <label htmlFor="seo_description" className="text-sm font-medium text-foreground">Default SEO Description</label>
            <textarea id="seo_description" name="seo_description" defaultValue={initial.seo_description || ""} rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-foreground">Analytics</legend>
          <div className="space-y-1">
            <label htmlFor="analytics_code" className="text-sm font-medium text-foreground">Analytics Code (e.g. Google Analytics ID)</label>
            <input id="analytics_code" name="analytics_code" defaultValue={initial.analytics_code || ""}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-foreground">Social Links</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label htmlFor="social_twitter" className="text-sm font-medium text-foreground">Twitter</label>
              <input id="social_twitter" name="social_twitter" defaultValue={initial.social_twitter || ""}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-1">
              <label htmlFor="social_github" className="text-sm font-medium text-foreground">GitHub</label>
              <input id="social_github" name="social_github" defaultValue={initial.social_github || ""}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-1">
              <label htmlFor="social_linkedin" className="text-sm font-medium text-foreground">LinkedIn</label>
              <input id="social_linkedin" name="social_linkedin" defaultValue={initial.social_linkedin || ""}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
        </fieldset>

        <button type="submit" disabled={loading}
          className="btn-primary">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </button>
      </form>
    </div>
  )
}
