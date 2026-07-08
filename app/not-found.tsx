import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Page not found.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="btn-primary"
          >
            Go home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
