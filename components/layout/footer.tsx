"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Sparkles, CheckCircle2, Mail } from "lucide-react"
import { subscribeToNewsletter } from "@/services/newsletter.service"

const quickLinks = [
  { href: "/tools", label: "AI Tools" },
  { href: "/articles", label: "Articles" },
  { href: "/categories", label: "Categories" },
  { href: "/compare", label: "Compare" },
  { href: "/about", label: "About" },
  { href: "/submit-tool", label: "Submit Tool" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
]

const resources = [
  { href: "/resources", label: "Tutorials" },
  { href: "/resources", label: "Guides" },
  { href: "/resources", label: "Glossary" },
  { href: "/articles", label: "Blog" },
  { href: "/resources", label: "FAQ" },
]

export default function Footer() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    const result = await subscribeToNewsletter(email)

    if (result.success) {
      setStatus("success")
      setMessage("Thanks for subscribing!")
      setEmail("")
    } else {
      setStatus("error")
      setMessage(result.error ?? "Something went wrong.")
    }
  }

  return (
    <footer className="border-t border-border bg-gradient-to-b from-background to-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              LinkDit
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              LinkDit is your premium destination for discovering, comparing and
              mastering the world&apos;s best AI tools. We help creators,
              developers and businesses work smarter with curated tutorials,
              guides, and expert comparisons.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:translate-x-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              {resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:translate-x-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
              Newsletter
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get the latest AI tools and tutorials delivered to your inbox.
            </p>

            {status === "success" ? (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                <p className="text-sm font-medium text-emerald-700">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary mt-2 w-full justify-center rounded-xl py-2.5 text-sm"
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
                {status === "error" && (
                  <p className="mt-1.5 text-xs text-destructive">{message}</p>
                )}
              </form>
            )}
            <p className="mt-2 text-[10px] text-muted-foreground">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} LinkDit. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
