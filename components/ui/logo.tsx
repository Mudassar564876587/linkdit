import Link from "next/link"
import Image from "next/image"

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center py-1 transition-all duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
      aria-label="LinkDit - Home"
    >
      <Image
        src="/images/logo.png"
        alt="LinkDit"
        width={130}
        height={36}
        className="h-auto w-auto"
        priority
      />
    </Link>
  )
}
