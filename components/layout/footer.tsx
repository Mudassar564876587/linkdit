"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Sparkles, CheckCircle2, Mail, ChevronDown } from "lucide-react"
import { subscribeToNewsletter } from "@/services/newsletter.service"
import { cn } from "@/lib/utils"

const quickLinks = [
  { href: "/tools", label: "AI Tools" },
  { href: "/articles", label: "Articles" },
  { href: "/categories", label: "Categories" },
  { href: "/compare", label: "Compare" },
  { href: "/store", label: "Store" },
  { href: "/about", label: "About" },
  { href: "/submit-tool", label: "Submit Tool" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
]

const resources = [
  { href: "/tutorials", label: "Tutorials" },
  { href: "/guides", label: "Guides" },
  { href: "/glossary", label: "Glossary" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
]

function AccordionGroup({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const accordionId = `accordion-${title.toLowerCase().replace(/\s+/g, "-")}`

  return (
    <div className="border-b border-border/30 pb-4 sm:pb-0">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={accordionId}
        className="flex w-full items-center justify-between py-3 text-xs font-semibold tracking-wider text-foreground uppercase sm:pointer-events-none sm:py-0"
      >
        {title}
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 sm:hidden", open && "rotate-180")} />
      </button>
      <ul id={accordionId} className={cn("overflow-hidden transition-all duration-300", open ? "mt-3 max-h-96" : "max-h-0 sm:max-h-96 sm:mt-4")}>
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="block text-sm text-muted-foreground transition-all duration-200 hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

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
    <footer className="border-t border-border/40 bg-gradient-to-b from-white to-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              LinkDit
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              Your premium destination for discovering, comparing and
              mastering the world&apos;s best AI tools. Curated tutorials,
              guides, and expert comparisons for creators, developers and businesses.
            </p>

            <div className="mt-6">
              <p className="text-xs font-semibold tracking-wider text-foreground/80 uppercase">Follow Us</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <a
                  href="https://www.instagram.com/linkditofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/30 bg-white/70 text-muted-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 hover:text-primary"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61591639121453"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/30 bg-white/70 text-muted-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 hover:text-primary"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a
                  href="https://twitter.com/linkdit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/30 bg-white/70 text-muted-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 hover:text-primary"
                  aria-label="Twitter"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <AccordionGroup title="Quick Links" links={quickLinks} />
          </div>

          {/* Resources */}
          <div>
            <AccordionGroup title="Resources" links={resources} />
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-semibold tracking-wider text-foreground uppercase">Newsletter</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get the latest AI tools and tutorials delivered to your inbox.
            </p>

            {status === "success" ? (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                <p className="text-sm font-medium text-emerald-700">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="group relative">
                  <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 blur-md transition-opacity duration-300 group-focus-within:opacity-20" />
                  <div className="relative flex items-center rounded-xl border border-input bg-white/80 transition-all duration-300 group-focus-within:border-primary/40 group-focus-within:shadow-[0_0_20px_rgba(37,99,235,0.08)]">
                    <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      aria-label="Email address for newsletter"
                      required
                      className="h-11 w-full rounded-xl bg-transparent pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                </div>
                <button type="submit" disabled={status === "loading"} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60">
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
                {status === "error" && <p className="mt-1.5 text-xs text-destructive">{message}</p>}
              </form>
            )}
            <p className="mt-2 text-[10px] text-muted-foreground">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border/40 pt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} LinkDit. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
