import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <img
        src="/images/logo.png"
        alt="LinkDit"
        className="h-8 w-auto sm:h-9 md:h-10 lg:h-11"
        width={160}
        height={44}
      />
    </Link>
  )
}