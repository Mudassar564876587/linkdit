import type { Metadata } from "next"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { SITE } from "@/constants/site"

export const metadata: Metadata = {
  title: "Contact Us | LinkDit",
  description: "Have a question, suggestion, or want to get in touch? We'd love to hear from you.",
  openGraph: {
    title: "Contact Us | LinkDit",
    description: "Have a question, suggestion, or want to get in touch? We'd love to hear from you.",
    url: "/contact",
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | LinkDit",
    description: "Have a question, suggestion, or want to get in touch? We'd love to hear from you.",
  },
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <h1 className="brand-gradient-text text-[1.75rem] font-bold leading-tight tracking-tight sm:text-[2rem] lg:text-[2.25rem]">
              Contact Us
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base sm:leading-relaxed lg:text-lg">
              Have a question, suggestion, or want to get in touch? We&apos;d love to hear from you.
            </p>
          </div>
          <div className="card-depth mt-10 rounded-2xl p-6 sm:p-8">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-soft-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-soft-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground">
                  Subject
                </label>
                <select
                  id="subject"
                  className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-soft-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="suggestion">Tool Suggestion</option>
                  <option value="bug">Bug Report</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Your message..."
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-soft-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
