import type { Metadata } from "next"
import Link from "next/link"
import { Mail } from "lucide-react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { SITE } from "@/constants/site"
import { ContactForm } from "@/components/forms/contact-form"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Have a question, suggestion, or want to get in touch? We'd love to hear from you.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | LinkDit",
    description: "Have a question, suggestion, or want to get in touch? We'd love to hear from you.",
    url: "/contact",
    siteName: SITE.name,
    type: "website",
    images: [{ url: "/images/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | LinkDit",
    description: "Have a question, suggestion, or want to get in touch? We'd love to hear from you.",
    images: ["/images/og-default.png"],
  },
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-[1.75rem] font-bold leading-tight tracking-tight sm:text-[2rem] lg:text-[2.25rem]">
              Contact Us
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base sm:leading-relaxed lg:text-lg">
              Have a question, suggestion, or want to get in touch? We&apos;d love to hear from you.
            </p>
          </div>
          <div className="mt-10 rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
            <div className="mb-8 flex items-center justify-center gap-3 rounded-xl bg-primary/5 px-4 py-3 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Or email us directly at</span>
              <Link href="mailto:contact@linkdit.online" className="font-medium text-primary hover:underline">
                contact@linkdit.online
              </Link>
            </div>
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}


