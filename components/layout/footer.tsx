import Link from "next/link"
import { FolderGit2, Globe, Share2, Mail } from "lucide-react"
import Logo from "@/components/ui/logo"
import { Button } from "@/components/ui/button"

const quickLinks = [
  { href: "/ai-tools", label: "AI Tools" },
  { href: "/articles", label: "Articles" },
  { href: "/categories", label: "Categories" },
  { href: "/compare", label: "Compare" },
  { href: "/about", label: "About" },
]

const resources = [
  { label: "Tutorials" },
  { label: "Guides" },
  { label: "Glossary" },
  { label: "Blog" },
  { label: "FAQ" },
]

const socialLinks = [
  { href: "#", label: "GitHub", icon: FolderGit2 },
  { href: "#", label: "Twitter", icon: Globe },
  { href: "#", label: "LinkedIn", icon: Share2 },
  { href: "#", label: "Email", icon: Mail },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              LinkDit is your premium destination for discovering, comparing and
              mastering the world&apos;s best AI tools. We help creators,
              developers and businesses work smarter.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-all duration-200 hover:text-foreground"
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
                  <span className="text-sm text-muted-foreground/50 cursor-default">
                    {link.label} — Coming soon
                  </span>
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
            <form className="mt-4 flex gap-2" action="#">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-sm shadow-soft-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button size="sm" type="submit" className="rounded-xl px-4">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} LinkDit. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
