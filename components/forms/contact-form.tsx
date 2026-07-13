"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, Loader2, Send } from "lucide-react"

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        setStatus("success")
        setMessage("Thanks for reaching out! We'll get back to you soon.")
        form.reset()
      } else {
        setStatus("error")
        setMessage("Something went wrong. Please try again later.")
      }
    } catch {
      setStatus("error")
      setMessage("Something went wrong. Please try again later.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Name <span className="text-destructive">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Your name"
          className="mt-1 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email <span className="text-destructive">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className="mt-1 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
        />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground">
          Subject <span className="text-destructive">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="mt-1 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
        >
          <option value="">Select a subject</option>
          <option value="general">General Inquiry</option>
          <option value="suggestion">Tool Suggestion</option>
          <option value="bug">Bug Report</option>
          <option value="partnership">Partnership</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground">
          Message <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Your message..."
          className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
        />
      </div>

      {status === "success" && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-700" role="alert">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-medium text-red-700" role="alert">
          <XCircle className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}
