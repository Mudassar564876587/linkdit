import type { Metadata } from "next"
import AdminMediaClient from "./admin-media-client"

export const metadata: Metadata = { title: "Media | Admin | LinkDit" }

export default function AdminMediaPage() {
  return <AdminMediaClient />
}
