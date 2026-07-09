"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BackNav() {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Link href="/" className="btn-secondary">
        <ArrowLeft className="h-4 w-4" />
        Home
      </Link>
      <button
        onClick={() => window.history.back()}
        className="btn-secondary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
    </div>
  )
}