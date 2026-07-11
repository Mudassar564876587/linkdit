"use client"

import { useState, useEffect } from "react"
import { TELEGRAM_BOT } from "@/constants/site"
import { MessageCircle, X } from "lucide-react"

export default function TelegramBotWidget() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          <div className="relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/60 text-white hover:bg-muted-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-3 w-3" />
            </button>
            <a
              href={`https://t.me/${TELEGRAM_BOT.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-[#0088cc] px-5 py-3 text-sm font-medium text-white shadow-lg hover:bg-[#0077b5] transition-all hover:scale-105"
            >
              <TelegramIcon />
              <span>Chat with AI Assistant</span>
            </a>
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0088cc] text-white shadow-lg hover:bg-[#0077b5] transition-all hover:scale-110 hover:shadow-xl"
          aria-label="Open AI Assistant"
        >
          <TelegramIcon />
        </button>
      )}
    </>
  )
}

function TelegramIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.926 7.233l-1.883 8.873c-.14.632-.517.785-1.047.489l-2.898-2.136-1.4 1.348c-.155.155-.286.286-.586.286l.207-2.957 5.382-4.862c.234-.209-.051-.325-.364-.12l-6.655 4.19-2.868-.896c-.624-.195-.636-.624.13-.924l11.2-4.316c.52-.193.976.128.807.925z"
        fill="currentColor"
      />
    </svg>
  )
}
