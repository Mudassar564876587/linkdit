import type { Metadata } from "next"
import Link from "next/link"
import { MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Verify email",
  description: "Verify your email address to complete registration.",
}

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-background p-8 shadow-sm sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-7 w-7 text-primary" />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
            Check your inbox
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We&apos;ve sent a verification link to your email address. Click
            the link to activate your account and start exploring AI tools.
          </p>

          <div className="mt-8 space-y-3">
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or try
              again.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">Back to sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
