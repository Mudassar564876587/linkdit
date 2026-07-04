"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { z } from "zod"

const profileSchema = z.object({
  fullName: z.string().min(2).max(100),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal("")),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
})

export async function updateProfile(formData: FormData) {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    username: formData.get("username"),
    bio: formData.get("bio") || undefined,
    website: formData.get("website") || undefined,
    twitter: formData.get("twitter") || undefined,
    linkedin: formData.get("linkedin") || undefined,
    github: formData.get("github") || undefined,
  })

  if (!parsed.success) {
    const field = String(parsed.error.issues[0]?.path[0] ?? "form")
    return { error: `Invalid ${field}.` }
  }

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const { error } = await supabase
    .from("users")
    .update({
      full_name: parsed.data.fullName,
      username: parsed.data.username,
      bio: parsed.data.bio ?? null,
      website: parsed.data.website || null,
      twitter: parsed.data.twitter || null,
      linkedin: parsed.data.linkedin || null,
      github: parsed.data.github || null,
    })
    .eq("id", user.id)

  if (error) {
    if (error.code === "23505") return { error: "Username already taken." }
    return { error: error.message }
  }

  return { success: true }
}
