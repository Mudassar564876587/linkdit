"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  onboardingSchema,
  type OnboardingInput,
} from "@/lib/validations/auth"
import { updateProfile } from "@/actions/auth/update-profile"

export function OnboardingForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      username: "",
      bio: "",
      website: "",
    },
  })

  async function onSubmit(data: OnboardingInput) {
    setServerError(null)
    const result = await updateProfile(data)

    if (result?.error) {
      setServerError(result.error)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-foreground"
        >
          Username
        </label>
        <div className="relative mt-1.5">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            @
          </span>
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="johndoe"
            className="h-11 w-full rounded-xl border border-input bg-background pl-8 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register("username")}
          />
        </div>
        {errors.username && (
          <p className="mt-1 text-xs text-destructive">
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-foreground"
        >
          Bio{" "}
          <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="bio"
          rows={3}
          placeholder="Tell us about yourself..."
          className="mt-1.5 h-24 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          {...register("bio")}
        />
        {errors.bio && (
          <p className="mt-1 text-xs text-destructive">
            {errors.bio.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="website"
          className="block text-sm font-medium text-foreground"
        >
          Website{" "}
          <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="website"
          type="url"
          autoComplete="url"
          placeholder="https://yoursite.com"
          className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          {...register("website")}
        />
        {errors.website && (
          <p className="mt-1 text-xs text-destructive">
            {errors.website.message}
          </p>
        )}
      </div>

      {serverError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <Button
        type="submit"
        className="h-11 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Complete setup
          </>
        )}
      </Button>
    </form>
  )
}
