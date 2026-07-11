import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0 group">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm transition-transform group-hover:scale-105">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Link<span className="text-blue-500">Dit</span>
      </span>
    </Link>
  )
}
