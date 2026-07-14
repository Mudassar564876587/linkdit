import type { Metadata } from "next"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your LinkDit account.",
  alternates: { canonical: "/reset-password" },
  openGraph: {
    title: "Reset password | LinkDit",
    description: "Set a new password for your LinkDit account.",
    url: "/reset-password",
    siteName: "LinkDit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reset password | LinkDit",
    description: "Set a new password for your LinkDit account.",
  },
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Set new password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a strong password for your account.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
        <ResetPasswordForm />
      </div>
    </div>
  )
}
