import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ProfileForm from "./profile-form"

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single()

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your public profile information.</p>
      </div>

      <ProfileForm
        email={authUser.email ?? ""}
        avatarUrl={authUser.user_metadata?.avatar_url ?? profile?.avatar_url ?? null}
        defaultValues={{
          fullName: profile?.full_name ?? "",
          username: profile?.username ?? "",
          bio: profile?.bio ?? "",
          website: profile?.website ?? "",
          twitter: profile?.twitter ?? "",
          linkedin: profile?.linkedin ?? "",
          github: profile?.github ?? "",
        }}
      />
    </div>
  )
}
