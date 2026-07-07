"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Loader2, CheckCircle2, Globe, FileText, Brain, ListChecks, AlertCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { aiAutofill } from "@/actions/submissions/ai-autofill"

export type AiResult = {
  toolName?: string
  shortDescription?: string
  fullDescription?: string
  categoryName?: string
  pricing?: string
  contactEmail?: string
  tags?: string[]
  features?: string[]
  pros?: string[]
  cons?: string[]
  faqs?: { question: string; answer: string }[]
}

type AiAutofillPanelProps = {
  categories: { id: string; name: string }[]
  onFill: (data: AiResult) => void
}

const ANIMATION_STEPS = [
  { key: "fetching", label: "Analyzing Website", icon: Globe },
  { key: "metadata", label: "Extracting Metadata", icon: FileText },
  { key: "description", label: "Generating Description", icon: Brain },
  { key: "features", label: "Generating Features", icon: ListChecks },
  { key: "done", label: "Done", icon: CheckCircle2 },
]

export default function AiAutofillPanel({ categories, onFill }: AiAutofillPanelProps) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(-1)
  const [expanded, setExpanded] = useState(false)

  const animateSteps = useCallback(async () => {
    for (let i = 0; i < ANIMATION_STEPS.length - 1; i++) {
      setCurrentStep(i)
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400))
    }
    setCurrentStep(ANIMATION_STEPS.length - 1)
  }, [])

  async function handleAutofill() {
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    setExpanded(true)
    setCurrentStep(-1)

    animateSteps()

    const result = await aiAutofill(url.trim())

    setLoading(false)

    if (result.error) {
      setError(result.error)
      setCurrentStep(-1)
      return
    }

    setCurrentStep(ANIMATION_STEPS.length - 1)
    onFill(result.data)
  }

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 p-5 sm:p-6 shadow-premium-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Auto Fill</h3>
            <p className="text-xs text-muted-foreground">Instantly populate your submission from a URL</p>
          </div>
        </div>
        <motion.button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-blue-100/50 hover:text-blue-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowRight className={cn("h-4 w-4 transition-transform", expanded && "rotate-90")} />
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 sm:flex-row mb-3">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="h-10 w-full rounded-xl border border-blue-200 bg-white pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <motion.button
                type="button"
                onClick={handleAutofill}
                disabled={loading || !url.trim()}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {loading ? "Analyzing..." : "Auto Fill"}
              </motion.button>
            </div>

            {loading && (
              <div className="space-y-2 mb-3">
                {ANIMATION_STEPS.map((step, i) => {
                  const isActive = currentStep === i
                  const isDone = currentStep > i || (currentStep === ANIMATION_STEPS.length - 1 && i === ANIMATION_STEPS.length - 1)
                  const Icon = step.icon
                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{
                        opacity: isActive || isDone ? 1 : 0.4,
                        x: 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
                        isActive && "bg-blue-100/70 text-blue-700",
                        isDone && "text-emerald-600",
                        !isActive && !isDone && "text-muted-foreground"
                      )}
                    >
                      <div className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-lg transition-all",
                        isDone && "bg-emerald-100",
                        isActive && "bg-blue-200",
                        !isActive && !isDone && "bg-muted"
                      )}>
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Icon className={cn("h-3.5 w-3.5", isActive && "text-blue-600")} />
                        )}
                      </div>
                      <span className={cn("font-medium", isActive && "text-blue-700")}>{step.label}</span>
                      {isActive && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: 16 }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                          className="h-1 rounded-full bg-blue-500"
                        />
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5"
              >
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
