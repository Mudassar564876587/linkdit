"use client"

import { useState, type FormEvent } from "react"
import { Mail, CheckCircle2, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { subscribeToNewsletter } from "@/services/newsletter.service"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    const result = await subscribeToNewsletter(email)

    if (result.success) {
      setStatus("success")
      setMessage("Thanks for subscribing!")
      setEmail("")
    } else {
      setStatus("error")
      setMessage(result.error ?? "Something went wrong.")
    }
  }

  return (
    <section className="relative overflow-hidden border-t border-border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background orbs */}
      <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-blue-500/5 blur-[100px]" aria-hidden="true" />
      <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-violet-500/5 blur-[100px]" aria-hidden="true" />
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[120px]" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mx-auto max-w-lg text-center"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm sm:text-sm">
            <Sparkles className="h-3 w-3 text-blue-400" />
            Stay Ahead of the AI Curve
          </div>

          <h2 className="mt-6 text-[1.75rem] font-bold leading-tight tracking-tight text-white sm:text-[2rem] lg:text-[2.25rem]">
            Get AI Insights Weekly
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:mt-4 sm:text-base">
            Join our community and get the latest AI tools, tutorials and insights
            delivered to your inbox every week. No spam, unsubscribe anytime.
          </p>

          {status === "success" ? (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-8 text-center backdrop-blur-sm">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              <p className="text-base font-medium text-emerald-300 sm:text-lg">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="group relative">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 opacity-20 blur transition duration-300 group-focus-within:opacity-40" />
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 h-5 w-5 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-12 pr-4 text-sm text-white shadow-soft-sm backdrop-blur-sm placeholder:text-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary mt-3 w-full justify-center rounded-2xl py-3 text-base"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe to Newsletter"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-center text-sm text-red-400">{message}</p>
          )}

          <p className="mt-4 text-xs text-white/30">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
