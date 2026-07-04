import type { Metadata } from "next"
import { OnboardingForm } from "./onboarding-form"

export const metadata: Metadata = {
  title: "Complete your profile",
  description: "Set up your LinkDit profile to get started.",
}

export default function OnboardingPage() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Complete your profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set up your public profile to get the most out of LinkDit.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
        <OnboardingForm />
      </div>
    </div>
  )
}
