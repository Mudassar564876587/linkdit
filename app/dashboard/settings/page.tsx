"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"
import { updatePassword, deleteAccount } from "@/actions/dashboard/settings"
import { logout } from "@/actions/auth/logout"

function PasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const res = await updatePassword(fd)
    setSubmitting(false)
    if (res?.error) { setError(res.error); return }
    setSuccess(true)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground">Current password</label>
        <input id="currentPassword" name="currentPassword" type="password" required
          className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-foreground">New password</label>
        <input id="newPassword" name="newPassword" type="password" required minLength={8}
          className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-emerald-600">Password updated.</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
      </Button>
    </form>
  )
}

function DeleteAccountSection() {
  const [confirm, setConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setError(null)
    setSubmitting(true)
    const res = await deleteAccount()
    setSubmitting(false)
    if (res?.error) { setError(res.error); return }
    await logout()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      {!confirm ? (
        <Button variant="destructive" onClick={() => setConfirm(true)}>Delete account</Button>
      ) : (
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-destructive flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" /> Are you sure?
          </p>
          <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes, delete"}
          </Button>
          <Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account settings.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Change password</h2>
        <PasswordForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-destructive">Danger zone</h2>
        <DeleteAccountSection />
      </section>
    </div>
  )
}
