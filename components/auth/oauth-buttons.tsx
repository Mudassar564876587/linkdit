"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Globe, GitFork } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OAuthButtons() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGitHubLoading, setIsGitHubLoading] = useState(false)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") ?? "/"

  async function handleOAuth(provider: "google" | "github") {
    const isLoading =
      provider === "google" ? isGoogleLoading : isGitHubLoading
    if (isLoading) return

    if (provider === "google") setIsGoogleLoading(true)
    else setIsGitHubLoading(true)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
        },
      })

      if (error) {
        console.error("OAuth error:", error.message)
      }
    } catch {
      console.error("OAuth error")
    } finally {
      if (provider === "google") setIsGoogleLoading(false)
      else setIsGitHubLoading(false)
    }
  }

  return (
    <div className="grid gap-3">
      <Button
        variant="outline"
        className="h-11 w-full"
        onClick={() => handleOAuth("google")}
        disabled={isGoogleLoading || isGitHubLoading}
      >
        {isGoogleLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        ) : (
          <Globe className="h-4 w-4" />
        )}
        Google
      </Button>
      <Button
        variant="outline"
        className="h-11 w-full"
        onClick={() => handleOAuth("github")}
        disabled={isGoogleLoading || isGitHubLoading}
      >
        {isGitHubLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        ) : (
          <GitFork className="h-4 w-4" />
        )}
        GitHub
      </Button>
    </div>
  )
}
