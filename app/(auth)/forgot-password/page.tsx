import type { Metadata } from "next"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your LinkDit account password.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Forgot password?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No worries. Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
