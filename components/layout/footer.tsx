"use client"

import { useState, useEffect, type FormEvent } from "react"
import Link from "next/link"
import { Sparkles, CheckCircle2, Mail, ArrowUp, ChevronDown } from "lucide-react"
import { subscribeToNewsletter } from "@/services/newsletter.service"
import { cn } from "@/lib/utils"

const discoverLinks = [
  { href: "/tools", label: "AI Tools" },
  { href: "/categories", label: "Categories" },
  { href: "/compare", label: "Comparisons" },
  { href: "/articles", label: "Latest Articles" },
]

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/submit-tool", label: "Submit Tool" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
]

const resourceLinks = [
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
    <div className="border-b border-border/40 pb-4 sm:border-b-0 sm:pb-0">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={accordionId}
        className="flex w-full items-center justify-between py-3 text-sm font-semibold text-foreground sm:pointer-events-none sm:py-0 sm:text-xs sm:font-semibold sm:tracking-wider sm:text-foreground/60 sm:uppercase"
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-250 sm:hidden", open && "rotate-180")} />
      </button>
      <ul id={accordionId} className={cn("overflow-hidden transition-all duration-250", open ? "mt-3 max-h-96" : "max-h-0 sm:max-h-96 sm:mt-5")}>
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1.5 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:translate-x-0.5"
            >
              <span className="relative">
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary/60 transition-all duration-200 group-hover:w-full" />
              </span>
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
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
    <>
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={cn(
          "group fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-2xl border border-border/40 bg-white/90 shadow-premium-md backdrop-blur-sm transition-all duration-250 hover:shadow-premium-lg hover:-translate-y-1 hover:border-primary/20",
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.06] to-indigo-500/[0.03] opacity-0 transition-opacity duration-250 group-hover:opacity-100" />
        <ArrowUp className="h-4 w-4 text-muted-foreground relative transition-colors duration-250 group-hover:text-primary" />
      </button>

      <footer className="relative border-t border-border/40 bg-gradient-to-b from-secondary to-white">
        {/* Decorative gradient accent bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" aria-hidden="true" />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-3">
              <Link href="/" className="inline-flex items-center gap-3 text-xl font-bold text-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-premium-sm">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                LinkDit
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Your premium destination for discovering, comparing and mastering the world&apos;s best AI tools.
              </p>

              <div className="mt-6">
                <p className="text-xs font-semibold tracking-wider text-foreground/60 uppercase">Follow Us</p>
                <div className="mt-3 flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/linkditofficial/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border/30 bg-white text-muted-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-pink-300 hover:text-pink-500"
                    aria-label="Instagram (opens in new tab)"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61591639121453"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border/30 bg-white text-muted-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-400 hover:text-blue-600"
                    aria-label="Facebook (opens in new tab)"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  <a
                    href="https://twitter.com/linkdit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border/30 bg-white text-muted-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-neutral-400 hover:text-neutral-900"
                    aria-label="Twitter (opens in new tab)"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Discover */}
            <div>
              <AccordionGroup title="Discover" links={discoverLinks} />
            </div>

            {/* Company */}
            <div>
              <AccordionGroup title="Company" links={companyLinks} />
            </div>

            {/* Resources */}
            <div>
              <AccordionGroup title="Resources" links={resourceLinks} />
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-semibold text-foreground sm:text-xs sm:font-semibold sm:tracking-wider sm:text-foreground/60 sm:uppercase">Newsletter</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Get the latest AI tools and tutorials delivered to your inbox.
              </p>

              {status === "success" ? (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  <p className="text-sm font-medium text-emerald-700">{message}</p>
                </div>
              ) : (
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="group relative">
                      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 blur-md transition-opacity duration-250 group-focus-within:opacity-20" />
                      <div className="relative flex items-center rounded-xl border border-input bg-white transition-all duration-250 group-focus-within:border-primary/40 group-focus-within:shadow-[0_0_20px_rgba(37,99,235,0.08)]">
                        <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <label htmlFor="newsletter-email" className="sr-only">Email address for newsletter</label>
                        <input
                          id="newsletter-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="h-11 w-full rounded-xl bg-transparent pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none"
                        />
                      </div>
                    </div>
                  <button type="submit" disabled={status === "loading"} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-[0_0_24px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 disabled:opacity-60">
                    {status === "loading" ? "Subscribing..." : "Subscribe"}
                  </button>
                  {status === "error" && <p className="mt-1.5 text-xs text-destructive">{message}</p>}
                </form>
              )}
              <p className="mt-2 text-[10px] text-muted-foreground">No spam. Unsubscribe anytime.</p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 border-t border-border/30 pt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} <span className="text-foreground/60">LinkDit</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link href="/privacy" className="transition-colors duration-200 hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="transition-colors duration-200 hover:text-foreground">Terms</Link>
              <Link href="/contact" className="transition-colors duration-200 hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
