import Link from "next/link"
import Logo from "@/components/ui/logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-7xl items-center px-4 pt-6 sm:px-6 lg:px-8">
        <Logo />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} LinkDit. All rights reserved.{" "}
          <Link
            href="/"
            className="font-medium text-primary hover:underline"
          >
            Home
          </Link>
        </p>
      </footer>
    </div>
  )
}
