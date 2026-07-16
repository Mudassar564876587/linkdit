import { getAdminClient } from "./admin"

const BUCKET = "hero-media"

export async function ensureHeroMediaBucket() {
  const admin = getAdminClient()
  const { data: buckets } = await admin.storage.listBuckets()
  if (!buckets?.find(b => b.name === BUCKET)) {
    await admin.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 104857600, // 100MB
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "video/mp4", "video/webm", "video/quicktime"],
    })
  }
}

export async function uploadHeroMedia(file: File, path: string): Promise<string> {
  const admin = getAdminClient()
  await ensureHeroMediaBucket()
  const { data, error } = await admin.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  })
  if (error) throw error
  const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(data.path)
  return urlData.publicUrl
}

export async function deleteHeroMedia(path: string) {
  const admin = getAdminClient()
  await admin.storage.from(BUCKET).remove([path])
}

export async function listHeroMedia(folder?: string) {
  const admin = getAdminClient()
  const prefix = folder ? `${folder}/` : ""
  const { data, error } = await admin.storage.from(BUCKET).list(prefix)
  if (error) return []
  return data.map(f => ({
    name: f.name,
    id: f.id,
    metadata: f.metadata,
    updatedAt: f.updated_at,
    url: admin.storage.from(BUCKET).getPublicUrl(`${prefix}${f.name}`).data.publicUrl,
  }))
}

export function getPublicUrl(path: string): string {
  const admin = getAdminClient()
  return admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}
