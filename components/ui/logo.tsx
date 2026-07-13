import Link from "next/link"
import Image from "next/image"

export default function Logo() {
  return (
    <Link href="/" className="shrink-0 block transition-transform hover:scale-105">
      <Image src="/images/logo.png" alt="LinkDit" width={130} height={36} className="h-auto w-auto" priority />
    </Link>
  )
}
