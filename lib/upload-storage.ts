import { getBrowserClient } from "./supabase/client"

export async function uploadFileClient(bucket: string, file: File): Promise<string> {
  const supabase = getBrowserClient()

  const { data: { user }, error: userErr } = await supabase.auth.getUser()
  if (userErr || !user) throw new Error("Not authenticated")

  const ext = file.name.split(".").pop()
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) throw error

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
  return urlData.publicUrl
}
