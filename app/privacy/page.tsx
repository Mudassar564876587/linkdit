import type { Metadata } from "next"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { SITE } from "@/constants/site"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "LinkDit's privacy policy — how we collect, use, and protect your personal information.",
  openGraph: {
    title: "Privacy Policy | LinkDit",
    description: "LinkDit's privacy policy — how we collect, use, and protect your personal information.",
    url: "/privacy",
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | LinkDit",
    description: "LinkDit's privacy policy — how we collect, use, and protect your personal information.",
  },
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <h1 className="brand-gradient-text text-[1.75rem] font-bold leading-tight tracking-tight sm:text-[2rem] lg:text-[2.25rem]">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base sm:leading-relaxed lg:text-lg">
              Last updated: July 8, 2026
            </p>
          </div>
          <div className="mt-12 space-y-8 text-base leading-relaxed text-muted-foreground">
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Information We Collect</h2>
              <p>
                We collect information you provide when creating an account, submitting a tool,
                writing an article, or contacting us. This may include your name, email address,
                and any content you submit to the platform.
              </p>
              <p className="mt-4">
                We also automatically collect certain technical information when you visit
                LinkDit, including your IP address, browser type, operating system, referring
                URLs, and browsing behaviour on our site.
              </p>
            </section>
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">How We Use Your Information</h2>
              <p>
                We use the collected information to provide, maintain, and improve our services;
                to personalise your experience; to communicate with you about your account or
                our platform; and to detect, prevent, or address technical or security issues.
              </p>
            </section>
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Data Sharing</h2>
              <p>
                We do not sell your personal information to third parties. We may share your
                data with trusted service providers who help us operate our platform, subject
                to strict confidentiality agreements. We may also disclose information if
                required by law or to protect our legal rights.
              </p>
            </section>
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Cookies</h2>
              <p>
                LinkDit uses cookies and similar tracking technologies to enhance your
                experience, analyse traffic, and remember your preferences. You can control
                cookie settings through your browser. Disabling certain cookies may affect
                the functionality of our site.
              </p>
            </section>
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Your Rights</h2>
              <p>
                Depending on your jurisdiction, you may have the right to access, correct,
                delete, or port your personal data. You may also object to or restrict certain
                processing activities. To exercise these rights, please contact us using the
                information below.
              </p>
            </section>
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Contact</h2>
              <p>
                If you have any questions about this Privacy Policy, please reach out to us at{" "}
                <a href="mailto:contact@linkdit.online" className="text-primary hover:underline">
                  contact@linkdit.online
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
