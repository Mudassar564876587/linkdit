import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your LinkDit account security, password, and privacy settings. Update your preferences and account details.",
  alternates: { canonical: "/dashboard/settings" },
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children
}
