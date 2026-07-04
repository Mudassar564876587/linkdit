import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your LinkDit account.",
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to your account to continue.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
        <LoginForm />
      </div>
    </div>
  )
}
