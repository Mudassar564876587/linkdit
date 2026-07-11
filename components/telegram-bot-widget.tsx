"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MessageCircle, X, Send, Loader2, ExternalLink } from "lucide-react"

type ButtonRow = {
  text: string
  value: string
  url?: string
}

type Message = {
  role: "user" | "bot"
  text: string
  buttons?: ButtonRow[][]
}

type ChatResponse = {
  text: string
  buttons?: ButtonRow[][]
}

export default function TelegramBotWidget() {
  const [open, setOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "👋 Welcome to LinkDit AI Assistant! How can I help you today?\n\nTry typing a tool name or use the buttons below.",
      buttons: [
        [{ text: "🔍 Browse Tools", value: "cmd:tools" }, { text: "📂 Categories", value: "cmd:categories" }],
        [{ text: "🆕 Latest", value: "cmd:latest" }, { text: "🆓 Free Tools", value: "cmd:free" }],
      ],
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const appendMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg])
  }, [])

  const sendMessage = useCallback(async (text: string, callbackData?: string) => {
    if (loading) return
    setLoading(true)

    if (text && !callbackData) {
      appendMessage({ role: "user", text })
    }

    setInput("")

    try {
      const res = await fetch("/api/telegram/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text || undefined, callbackData: callbackData || undefined }),
      })

      if (!res.ok) throw new Error("Failed")

      const data: ChatResponse = await res.json()
      appendMessage({
        role: "bot",
        text: data.text,
        buttons: data.buttons,
      })
    } catch {
      appendMessage({
        role: "bot",
        text: "Sorry, something went wrong. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }, [loading, appendMessage])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    sendMessage(input.trim())
  }, [input, loading, sendMessage])

  const handleButtonClick = useCallback((value: string, url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
      return
    }
    sendMessage("", value)
  }, [sendMessage])

  return (
    <>
      {showPopup && !open && (
        <div className="fixed bottom-24 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="relative rounded-2xl bg-card border border-border p-4 shadow-xl max-w-64">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/60 text-white hover:bg-muted-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-3 w-3" />
            </button>
            <p className="text-sm text-foreground font-medium">
              🤖 Need help finding the right AI tool?
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ask our AI Assistant!
            </p>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex w-96 max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-[#0088cc] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">LinkDit AI</p>
                <p className="text-[11px] text-white/70">AI Tools Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96 min-h-80">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.role === "user"
                      ? "bg-[#0088cc] text-white rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>

                  {msg.buttons && msg.buttons.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {msg.buttons.map((row, ri) =>
                        row.map((btn, bi) => (
                          <button
                            key={`${ri}-${bi}`}
                            onClick={() => handleButtonClick(btn.value, btn.url)}
                            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                              btn.url
                                ? "bg-primary/10 text-primary hover:bg-primary/20"
                                : msg.role === "user"
                                ? "bg-white/20 text-white hover:bg-white/30"
                                : "bg-primary/10 text-primary hover:bg-primary/20"
                            }`}
                          >
                            {btn.text}
                            {btn.url && <ExternalLink className="h-3 w-3" />}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about AI tools..."
                disabled={loading}
                className="flex-1 rounded-xl border border-input bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0088cc] text-white hover:bg-[#0077b5] transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => {
            setOpen(true)
            setShowPopup(false)
          }}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0088cc] text-white shadow-lg hover:bg-[#0077b5] transition-all hover:scale-110 hover:shadow-xl"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </>
  )
}
