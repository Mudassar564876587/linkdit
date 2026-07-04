"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateProfile } from "@/actions/dashboard/profile"
import { getAvatarColor } from "@/lib/utils"
import { useState } from "react"

const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters.").max(100),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, underscores only."),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal("")),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function ProfileForm({
  email,
  avatarUrl,
  defaultValues,
}: {
  email: string
  avatarUrl: string | null
  defaultValues: FormValues & { bio?: string }
}) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  async function onSubmit(data: FormValues) {
    setServerError(null)
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => fd.append(k, v ?? ""))
    const res = await updateProfile(fd)
    if (res?.error) { setServerError(res.error); return }
    router.refresh()
  }

  const initials = (defaultValues.fullName || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-5">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <span className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white ${getAvatarColor(defaultValues.fullName || "User")}`}>
            {initials}
          </span>
        )}
        <div>
          <p className="font-medium text-foreground">{defaultValues.fullName || "User"}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {[
          ["fullName", "Full name", "text"],
          ["username", "Username", "text"],
          ["website", "Website", "url"],
          ["twitter", "Twitter/X", "text"],
          ["linkedin", "LinkedIn", "text"],
          ["github", "GitHub", "text"],
        ].map(([name, label, type]) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-foreground">{label}</label>
            <input
              id={name}
              type={type}
              className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...register(name as keyof FormValues)}
            />
            {errors[name as keyof FormValues] && (
              <p className="mt-1 text-xs text-destructive">{errors[name as keyof FormValues]?.message}</p>
            )}
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-foreground">Bio</label>
        <textarea
          id="bio"
          rows={4}
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          {...register("bio")}
        />
        {errors.bio && <p className="mt-1 text-xs text-destructive">{errors.bio.message}</p>}
      </div>

      {serverError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{serverError}</div>
      )}

      <Button type="submit" className="h-11" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save profile"}
      </Button>
    </form>
  )
}
