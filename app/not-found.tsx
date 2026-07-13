import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { Sparkles, Search, Home } from "lucide-react"

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/20 via-white to-white">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-48 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-300/10 via-indigo-200/5 to-transparent blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-xl px-4 py-32 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 mb-8">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-7xl font-bold tracking-tight text-foreground sm:text-8xl">404</h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Page not found
            </p>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/" className="btn-primary text-base px-8 py-3.5 shadow-lg hover:shadow-xl">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
              <Link href="/tools" className="btn-secondary text-base px-8 py-3.5 shadow-sm hover:shadow-md">
                <Sparkles className="h-4 w-4" />
                Browse AI Tools
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
