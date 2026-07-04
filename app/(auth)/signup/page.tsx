import type { Metadata } from "next"
import { SignupForm } from "@/components/auth/signup-form"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your LinkDit account and start discovering AI tools.",
}

export default function SignupPage() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join thousands of professionals discovering the best AI tools.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
        <SignupForm />
      </div>
    </div>
  )
}
