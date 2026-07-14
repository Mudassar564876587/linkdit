import type { Metadata } from "next"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { SITE } from "@/constants/site"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "LinkDit's terms of service — the rules and guidelines for using our platform.",
  openGraph: {
    title: "Terms of Service | LinkDit",
    description: "LinkDit's terms of service — the rules and guidelines for using our platform.",
    url: "/terms",
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | LinkDit",
    description: "LinkDit's terms of service — the rules and guidelines for using our platform.",
  },
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <h1 className="brand-gradient-text text-[1.75rem] font-bold leading-tight tracking-tight sm:text-[2rem] lg:text-[2.25rem]">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base sm:leading-relaxed lg:text-lg">
              Last updated: July 8, 2026
            </p>
          </div>
          <div className="mt-12 space-y-8 text-base leading-relaxed text-muted-foreground">
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Acceptance of Terms</h2>
              <p>
                By accessing or using LinkDit, you agree to be bound by these Terms of Service.
                If you do not agree with any part of these terms, you should not use our
                platform. Continued use constitutes acceptance of any future updates to these
                terms.
              </p>
            </section>
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account
                credentials and for all activities that occur under your account. You must
                provide accurate, complete, and up-to-date information when creating an
                account. Notify us immediately of any unauthorised use of your account.
              </p>
            </section>
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">User Submissions</h2>
              <p>
                By submitting tools, articles, reviews, or other content to LinkDit, you grant
                us a non-exclusive, royalty-free, worldwide licence to display, distribute, and
                promote your submission on our platform. You represent that your submissions do
                not infringe any third-party rights.
              </p>
            </section>
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Intellectual Property</h2>
              <p>
                All content, branding, design, and technology on LinkDit — unless submitted by
                users — are the exclusive property of LinkDit and are protected by applicable
                intellectual property laws. You may not reproduce, distribute, or create
                derivative works without our express written consent.
              </p>
            </section>
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Limitation of Liability</h2>
              <p>
                LinkDit is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We make no
                warranties, express or implied, regarding the accuracy, reliability, or
                availability of the platform. In no event shall LinkDit be liable for any
                indirect, incidental, or consequential damages arising from your use of the
                service.
              </p>
            </section>
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at any time, without
                prior notice, for conduct that we believe violates these terms or is harmful to
                other users, third parties, or the platform itself. You may also delete your
                account at any time from your account settings.
              </p>
            </section>
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Changes to These Terms</h2>
              <p>
                We may revise these Terms of Service from time to time. Changes will be posted
                on this page, and your continued use of the platform after such changes
                constitutes acceptance of the new terms. We encourage you to review this page
                periodically.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
