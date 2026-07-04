import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="28" height="28" rx="7" fill="#2563EB" />
        <path
          d="M7 7h4v14H7V7zm0 7h10v4H7v-4z"
          fill="white"
          fillOpacity="0.95"
        />
        <path
          d="M17 7h4v14h-4V7zm0 7h10v4H17v-4z"
          fill="white"
          fillOpacity="0.5"
        />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-foreground">
        LinkDit
      </span>
    </Link>
  )
}
