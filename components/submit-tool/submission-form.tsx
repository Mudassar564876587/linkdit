"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Send, Save, Loader2, Sparkles,
  Info, ImageIcon, ListChecks, ThumbsUp, ThumbsDown,
  HelpCircle, Search, Eye, CheckCircle2, Check,
  Globe, DollarSign, Tag, Mail, ChevronLeft, ChevronRight,
  AlertCircle, X, GripVertical, Plus
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { createSubmission, saveDraft } from "@/actions/submissions"
import AiAutofillPanel from "./ai-autofill-panel"
import type { AiResult } from "./ai-autofill-panel"
import ImageUpload from "./image-upload"

type SubmissionFormProps = {
  categories: { id: string; name: string }[]
}

const CATEGORY_SYNONYMS: Record<string, string[]> = {
  Coding: ["coding", "ai coding", "code assistant", "programming", "development", "software", "developer tools", "ide", "code generation"],
  "AI Writing": ["writing", "ai writing", "content", "copywriting", "text generation", "content creation", "blog", "article", "essay"],
  "Image Generation": ["image generation", "image ai", "ai art", "image generator", "art", "visual", "graphics", "dalle", "midjourney", "stable diffusion"],
  Marketing: ["marketing", "seo", "social media", "advertising", "campaign", "email marketing", "analytics marketing"],
  Video: ["video", "video generation", "video editing", "animation", "video creation"],
  Audio: ["audio", "speech", "voice", "music", "sound", "text to speech", "tts"],
  Analytics: ["analytics", "data analysis", "data", "business intelligence", "insights", "reporting"],
  Design: ["design", "ui", "ux", "ui/ux", "graphic design", "wireframe", "prototype", "figma"],
  Education: ["education", "learning", "tutoring", "course", "training", "elearning", "study"],
  Productivity: ["productivity", "task", "project management", "workflow", "automation", "todo", "calendar"],
}

const STEPS = [
  { id: 1, label: "Basic Info", icon: Info },
  { id: 2, label: "Images", icon: ImageIcon },
  { id: 3, label: "Features", icon: ListChecks },
  { id: 4, label: "Pros & Cons", icon: ThumbsUp },
  { id: 5, label: "FAQ", icon: HelpCircle },
  { id: 6, label: "SEO Preview", icon: Search },
  { id: 7, label: "Review & Submit", icon: Eye },
]

function matchCategory(
  input: string,
  categories: { id: string; name: string }[]
): { id: string; name: string } | null {
  const normalized = input.toLowerCase().trim()
  for (const cat of categories) {
    if (cat.name.toLowerCase() === normalized) return cat
  }
  for (const cat of categories) {
    const synonyms = CATEGORY_SYNONYMS[cat.name]
    if (synonyms?.some((s) => s === normalized || normalized.includes(s) || s.includes(normalized))) {
      return cat
    }
  }
  let bestMatch: { id: string; name: string } | null = null
  let bestScore = 0
  const inputWords = new Set(normalized.split(/\s+/))
  for (const cat of categories) {
    const synonyms = [cat.name.toLowerCase(), ...(CATEGORY_SYNONYMS[cat.name] || []).map((s) => s.toLowerCase())]
    for (const syn of synonyms) {
      const synWords = new Set(syn.split(/\s+/))
      let score = 0
      for (const w of inputWords) {
        if (synWords.has(w)) score++
      }
      if (score > bestScore) {
        bestScore = score
        bestMatch = cat
      }
    }
  }
  return bestMatch
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
}

export default function SubmissionForm({ categories }: SubmissionFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [toolName, setToolName] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [fullDescription, setFullDescription] = useState("")
  const [pricing, setPricing] = useState("Free")
  const [categoryId, setCategoryId] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [tags, setTags] = useState("")

  const [features, setFeatures] = useState<string[]>([])
  const [pros, setPros] = useState<string[]>([])
  const [cons, setCons] = useState<string[]>([])
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([])

  const [logoUrl, setLogoUrl] = useState("")
  const [coverUrl, setCoverUrl] = useState("")
  const [galleryUrls, setGalleryUrls] = useState<string[]>([])

  

  const parseTags = useCallback(() => {
    return tags.split(",").map((t) => t.trim()).filter(Boolean)
  }, [tags])

  const buildFormData = useCallback(() => {
    const fd = new FormData()
    fd.set("toolName", toolName)
    fd.set("websiteUrl", websiteUrl)
    fd.set("shortDescription", shortDescription)
    fd.set("fullDescription", fullDescription)
    fd.set("pricing", pricing)
    fd.set("categoryId", categoryId)
    fd.set("contactEmail", contactEmail || "")
    fd.set("tags", JSON.stringify(parseTags()))
    fd.set("features", JSON.stringify(features))
    fd.set("pros", JSON.stringify(pros))
    fd.set("cons", JSON.stringify(cons))
    fd.set("faqs", JSON.stringify(faqs))
    if (logoUrl) fd.set("logoUrl", logoUrl)
    if (coverUrl) fd.set("coverUrl", coverUrl)
    if (galleryUrls.length) fd.set("galleryUrls", JSON.stringify(galleryUrls))
    return fd
  }, [toolName, websiteUrl, shortDescription, fullDescription, pricing, categoryId, contactEmail, parseTags, features, pros, cons, faqs, logoUrl, coverUrl, galleryUrls])

  function handleAiFill(data: AiResult) {
    if (data.toolName) setToolName(data.toolName)
    setWebsiteUrl(data.toolName ? websiteUrl || "" : websiteUrl)
    if (data.shortDescription) setShortDescription(data.shortDescription)
    if (data.fullDescription) setFullDescription(data.fullDescription)
    if (data.categoryName && categories.length > 0) {
      const match = matchCategory(data.categoryName, categories)
      if (match) setCategoryId(match.id)
    }
    if (data.contactEmail) setContactEmail(data.contactEmail)
    if (data.pricing && ["Free", "Freemium", "Paid"].includes(data.pricing)) setPricing(data.pricing)
    if (data.tags && Array.isArray(data.tags)) setTags(data.tags.join(", "))
    if (data.features && Array.isArray(data.features)) setFeatures(data.features.slice(0, 10))
    if (data.pros && Array.isArray(data.pros)) setPros(data.pros.slice(0, 5))
    if (data.cons && Array.isArray(data.cons)) setCons(data.cons.slice(0, 5))
    if (data.faqs && Array.isArray(data.faqs)) {
      setFaqs(data.faqs.slice(0, 5).map((f) => ({
        question: f.question || "",
        answer: f.answer || "",
      })))
    }
  }

  const goToStep = useCallback((s: number) => {
    setDirection(s > step ? 1 : -1)
    setStep(s)
  }, [step])

  const nextStep = useCallback(() => {
    if (step < STEPS.length) {
      setDirection(1)
      setStep((s) => s + 1)
    }
  }, [step])

  const prevStep = useCallback(() => {
    if (step > 1) {
      setDirection(-1)
      setStep((s) => s - 1)
    }
  }, [step])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const fd = buildFormData()
      const result = await createSubmission(fd)

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard/my-submissions")
      }, 2000)
    } catch (err) {
      console.error("handleSubmit: server action threw exception", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
      setLoading(false)
    }
  }

  async function handleSaveDraft() {
    setError(null)
    const fd = buildFormData()
    try {
      const result = await saveDraft(fd)
      if (result.error) setError(result.error)
    } catch (err) {
      console.error("handleSaveDraft: server action threw exception", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6"
        >
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Submission Sent!</h2>
        <p className="text-sm text-muted-foreground mb-4">Your tool has been submitted for review. Redirecting...</p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ duration: 2 }}
          className="h-1.5 rounded-full bg-emerald-500"
        />
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-auto">
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}

      {/* Step indicator */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center gap-0 min-w-max">
          {STEPS.map((s, i) => {
            const isActive = step === s.id
            const isDone = step > s.id
            const Icon = s.icon
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goToStep(s.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg",
                  isActive ? "text-primary" : isDone ? "text-emerald-600" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all",
                  isActive && "bg-primary text-primary-foreground shadow-sm",
                  isDone && "bg-emerald-100 text-emerald-700",
                  !isActive && !isDone && "bg-muted text-muted-foreground"
                )}>
                  {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    "ml-2 h-px w-6",
                    isDone ? "bg-emerald-300" : "bg-border"
                  )} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={false}
          animate={{ width: `${(step / STEPS.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
        />
      </div>

      <div>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Tell us about your AI tool</p>
                  </div>

                  <AiAutofillPanel categories={categories} onFill={handleAiFill} />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="toolName" className="text-sm font-medium text-foreground">
                        Tool Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="toolName"
                        value={toolName}
                        onChange={(e) => setToolName(e.target.value)}
                        required
                        className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="e.g. Super AI Writer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="websiteUrl" className="text-sm font-medium text-foreground">
                        Website URL <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          id="websiteUrl"
                          type="url"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          required
                          className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="shortDescription" className="text-sm font-medium text-foreground">
                      Short Description <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="shortDescription"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      required
                      rows={3}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      placeholder="Brief description of the tool (10–1000 characters)"
                    />
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Required</span>
                      <span className={cn("text-xs", shortDescription.length > 1000 ? "text-destructive" : "text-muted-foreground")}>{shortDescription.length}/1000</span>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="categoryId" className="text-sm font-medium text-foreground">
                        Category <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="categoryId"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      >
                        <option value="">Select a category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="pricing" className="text-sm font-medium text-foreground">Pricing</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <select
                          id="pricing"
                          value={pricing}
                          onChange={(e) => setPricing(e.target.value)}
                          className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                          <option value="Free">Free</option>
                          <option value="Freemium">Freemium</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="tags" className="text-sm font-medium text-foreground">Tags</label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          id="tags"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="AI, writing, content"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contactEmail" className="text-sm font-medium text-foreground">Contact Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          id="contactEmail"
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Images */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Images</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Add visuals to make your listing stand out</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <ImageUpload label="Logo" name="logoUrl" bucket="tool-logos" onChange={(u) => setLogoUrl(u[0] || "")} />
                    <ImageUpload label="Cover Image" name="coverUrl" bucket="tool-covers" onChange={(u) => setCoverUrl(u[0] || "")} />
                  </div>
                  <ImageUpload label="Gallery Images" name="galleryUrls" bucket="tool-galleries" maxFiles={10} onChange={setGalleryUrls} />
                </div>
              )}

              {/* Step 3: Features */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Features</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">List the key features of your tool</p>
                  </div>

                  <FeatureManager items={features} onChange={setFeatures} />
                </div>
              )}

              {/* Step 4: Pros & Cons */}
              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Pros & Cons</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Help users understand the strengths and weaknesses</p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                          <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">Pros</h3>
                      </div>
                      <ListManager items={pros} onChange={setPros} placeholder="Add a pro..." accent="emerald" />
                    </div>
                    <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50/50 to-white p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100">
                          <ThumbsDown className="h-3.5 w-3.5 text-red-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">Cons</h3>
                      </div>
                      <ListManager items={cons} onChange={setCons} placeholder="Add a con..." accent="red" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: FAQ */}
              {step === 5 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">FAQ</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Answer common questions about your tool</p>
                  </div>

                  <FaqManager items={faqs} onChange={setFaqs} />
                </div>
              )}

              {/* Step 6: SEO Preview */}
              {step === 6 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">SEO Preview</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">See how your tool will appear in search results</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-white p-5 shadow-premium">
                    <div className="flex items-center gap-2 mb-4">
                      <Search className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-medium text-muted-foreground">Google Search Preview</span>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs text-green-700 truncate">{websiteUrl || "your-tool-slug"}</p>
                      <p className="text-lg text-blue-700 font-medium leading-tight cursor-pointer hover:underline">
                        {toolName || "Your Tool Name"} – AI Tool Review &amp; Alternatives
                      </p>
                      <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
                        {shortDescription || "A brief description of what your AI tool does and who it's for."}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-white p-5 shadow-premium">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                        <span className="text-xs font-bold text-blue-700">AI</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">AI Readiness Score</p>
                        <p className="text-xs text-muted-foreground">Based on your content completeness</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { label: "Quality", score: Math.min(95, 30 + (faqs.length * 5) + (features.length * 3) + (pros.length * 3)), color: "blue" },
                        { label: "SEO", score: Math.min(100, 20 + (shortDescription.length > 50 ? 20 : 0) + (tags ? 15 : 0) + (fullDescription ? 15 : 0) + (features.length * 5)), color: "indigo" },
                        { label: "Content", score: Math.min(100, 20 + (fullDescription ? 25 : 0) + (faqs.length * 8) + (features.length * 3)), color: "violet" },
                        { label: "Readability", score: Math.min(95, 50 + (shortDescription.length > 30 ? 20 : 0) + (faqs.length * 5)), color: "emerald" },
                        { label: "Originality", score: Math.min(100, 40 + (pros.length * 6) + (cons.length * 6) + (faqs.length * 4)), color: "orange" },
                      ].map((s) => (
                        <motion.div
                          key={s.label}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl border border-border bg-muted/30 p-3 text-center"
                        >
                          <div className={cn(
                            "text-lg font-bold",
                            s.color === "blue" && "text-blue-600",
                            s.color === "indigo" && "text-indigo-600",
                            s.color === "violet" && "text-violet-600",
                            s.color === "emerald" && "text-emerald-600",
                            s.color === "orange" && "text-orange-600",
                          )}>
                            {s.score}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Review & Submit */}
              {step === 7 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-foreground">
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Review &amp; Submit
                      </span>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Here&apos;s how your tool will appear on LinkDit. Make sure everything looks perfect.
                    </p>
                  </div>

                  {/* Tool Preview Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="rounded-2xl border border-border bg-white shadow-premium-lg overflow-hidden"
                  >
                    {/* Preview pill */}
                    <div className="flex items-center gap-2 px-6 pt-5 pb-0">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1">
                        <Eye className="h-3 w-3 text-blue-600" />
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">Preview</span>
                      </div>
                    </div>

                    {/* ─── Hero Section ─── */}
                    <div className="px-6 pt-5 pb-6">
                      <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="flex items-start gap-4">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.25 }}
                            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-2xl font-bold text-primary border border-blue-100"
                          >
                            {logoUrl ? (
                              <img src={logoUrl} alt="" className="h-full w-full rounded-2xl object-cover" />
                            ) : (
                              toolName.charAt(0).toUpperCase() || <Sparkles className="h-6 w-6 text-blue-400" />
                            )}
                          </motion.div>
                          <div className="space-y-2">
                            <motion.h3
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.3 }}
                              className="text-xl sm:text-2xl font-bold text-foreground"
                            >
                              {toolName || <span className="italic text-muted-foreground/50">Tool Name</span>}
                            </motion.h3>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.35 }}
                              className="flex flex-wrap items-center gap-2"
                            >
                              {categoryId && (
                                <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                  {categories.find((c) => c.id === categoryId)?.name}
                                </span>
                              )}
                              {pricing && (
                                <span className={cn(
                                  "rounded-md px-2.5 py-1 text-xs font-medium",
                                  pricing === "Free" && "bg-emerald-50 text-emerald-700",
                                  pricing === "Freemium" && "bg-amber-50 text-amber-700",
                                  pricing === "Paid" && "bg-violet-50 text-violet-700"
                                )}>
                                  {pricing}
                                </span>
                              )}
                            </motion.div>
                            {parseTags().length > 0 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                                className="flex flex-wrap gap-1.5 pt-1"
                              >
                                {parseTags().map((tag, i) => (
                                  <span key={i} className="rounded-lg bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                    {tag}
                                  </span>
                                ))}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* ─── Cover Image ─── */}
                    {coverUrl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.25 }}
                        className="px-6 pb-6"
                      >
                        <div className="overflow-hidden rounded-xl border border-border">
                          <img
                            src={coverUrl}
                            alt="Cover preview"
                            className="w-full object-cover"
                            style={{ maxHeight: 320 }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* ─── Gallery Images ─── */}
                    {galleryUrls.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="px-6 pb-6"
                      >
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                          Gallery ({galleryUrls.length})
                        </h4>
                        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                          {galleryUrls.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`Gallery ${i + 1}`}
                              className="h-32 w-auto rounded-xl border border-border object-cover snap-start shrink-0"
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* ─── About / Description ─── */}
                    {shortDescription && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.35 }}
                        className="px-6 pb-6"
                      >
                        <h4 className="text-sm font-semibold text-foreground mb-2">About</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">{shortDescription}</p>
                        {fullDescription && (
                          <details className="group mt-2">
                            <summary className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700 list-none">
                              <span className="group-open:hidden">Read full description</span>
                              <span className="hidden group-open:inline">Show less</span>
                            </summary>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                              {fullDescription}
                            </p>
                          </details>
                        )}
                      </motion.div>
                    )}

                    {/* ─── Features ─── */}
                    {features.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.4 }}
                        className="px-6 pb-6"
                      >
                        <h4 className="text-sm font-semibold text-foreground mb-3">Features</h4>
                        <ul className="space-y-2.5">
                          {features.map((f, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.45 + i * 0.05 }}
                              className="flex items-start gap-3"
                            >
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                <Check className="h-3 w-3" />
                              </span>
                              <span className="text-sm text-muted-foreground">{f}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {/* ─── Pros & Cons ─── */}
                    {(pros.length > 0 || cons.length > 0) && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.5 }}
                        className="grid gap-6 sm:grid-cols-2 px-6 pb-6"
                      >
                        {pros.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-3">Pros</h4>
                            <ul className="space-y-2.5">
                              {pros.map((p, i) => (
                                <li key={i} className="flex items-start gap-3">
                                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                    <Check className="h-3 w-3" />
                                  </span>
                                  <span className="text-sm text-muted-foreground">{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {cons.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-3">Cons</h4>
                            <ul className="space-y-2.5">
                              {cons.map((c, i) => (
                                <li key={i} className="flex items-start gap-3">
                                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
                                    <X className="h-3 w-3" />
                                  </span>
                                  <span className="text-sm text-muted-foreground">{c}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ─── FAQ ─── */}
                    {faqs.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.55 }}
                        className="px-6 pb-6"
                      >
                        <h4 className="text-sm font-semibold text-foreground mb-3">FAQ</h4>
                        <div className="space-y-3">
                          {faqs.map((faq, i) => (
                            <details
                              key={i}
                              className="group rounded-xl border border-border overflow-hidden"
                            >
                              <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors list-none">
                                <span className="flex-1">{faq.question}</span>
                                <motion.span
                                  animate={{ rotate: 0 }}
                                  className="text-muted-foreground shrink-0 transition-transform group-open:rotate-180"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </motion.span>
                              </summary>
                              <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
                                {faq.answer}
                              </div>
                            </details>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* ─── Contact Email ─── */}
                    {contactEmail && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                        className="border-t border-border px-6 py-4"
                      >
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          <span>Contact: <span className="font-medium text-foreground">{contactEmail}</span></span>
                          <span className="ml-auto text-[11px] text-muted-foreground/60">This will be shown on your tool page.</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Validation Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.5 }}
                    className="rounded-xl border border-blue-100 bg-blue-50/50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-blue-900">Almost there!</p>
                        <p className="text-blue-700">
                          Required fields: {!toolName && <span className="font-semibold text-red-600">Tool Name missing, </span>}
                          {!websiteUrl && <span className="font-semibold text-red-600">Website URL missing, </span>}
                          {shortDescription.length < 10 && <span className="font-semibold text-red-600">Description too short, </span>}
                          {!categoryId && <span className="font-semibold text-red-600">Category not selected, </span>}
                          {toolName && websiteUrl && shortDescription.length >= 10 && categoryId && (
                            <span className="text-emerald-700 font-medium">All required fields are complete!</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border pt-5">
        <div className="flex items-center gap-2">
          {step > 1 && (
            <motion.button
              type="button"
              onClick={prevStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </motion.button>
          )}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={loading}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50 transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {step > 1 && (
            <span className="text-xs text-muted-foreground mr-1">Step {step} of {STEPS.length}</span>
          )}
          {step < STEPS.length ? (
            <motion.button
              type="button"
              onClick={nextStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Submit for Review
            </motion.button>
          )}
        </div>
      </div>
    </form>
  )
}

/* ─── Inline List Manager for Pros & Cons ─── */

function ListManager({ items, onChange, placeholder, accent }: {
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  accent?: "emerald" | "red"
}) {
  const [input, setInput] = useState("")

  function add() {
    const val = input.trim()
    if (!val) return
    onChange([...items, val])
    setInput("")
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i))
  }

  const accentBorder = accent === "emerald" ? "focus:border-emerald-500 focus:ring-emerald-500/20" : accent === "red" ? "focus:border-red-500 focus:ring-red-500/20" : "focus:border-primary focus:ring-primary/20"
  const accentBtn = accent === "emerald" ? "bg-emerald-500 hover:bg-emerald-600" : accent === "red" ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add() } }}
          placeholder={placeholder}
          className={cn("h-9 flex-1 rounded-xl border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all disabled:opacity-50", accentBorder)}
        />
        <motion.button
          type="button"
          onClick={add}
          disabled={!input.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn("flex h-9 w-9 items-center justify-center rounded-xl text-white disabled:opacity-50 transition-colors", accentBtn)}
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {items.map((item, i) => (
          <motion.div
            key={`${item}-${i}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="flex-1">{item}</span>
            <motion.button
              type="button"
              onClick={() => remove(i)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      {items.length === 0 && (
        <p className="text-xs text-muted-foreground px-1">No items added yet.</p>
      )}
    </div>
  )
}

/* ─── Feature Manager (like ListManager but full-width) ─── */

function FeatureManager({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  const [input, setInput] = useState("")

  function add() {
    const val = input.trim()
    if (!val || items.length >= 30) return
    onChange([...items, val])
    setInput("")
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add() } }}
          placeholder="Add a feature..."
          disabled={items.length >= 30}
          className="h-9 flex-1 rounded-xl border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
        />
        <motion.button
          type="button"
          onClick={add}
          disabled={!input.trim() || items.length >= 30}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {items.map((item, i) => (
          <motion.div
            key={`${item}-${i}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="flex-1">{item}</span>
            <motion.button
              type="button"
              onClick={() => remove(i)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      {items.length === 0 && (
        <p className="text-xs text-muted-foreground px-1">No features added yet. Add up to 30 features.</p>
      )}
      {items.length > 0 && (
        <p className="text-xs text-muted-foreground">{items.length}/30 features</p>
      )}
    </div>
  )
}

/* ─── FAQ Manager ─── */

function FaqManager({ items, onChange }: { items: { question: string; answer: string }[]; onChange: (items: { question: string; answer: string }[]) => void }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  function add() {
    onChange([...items, { question: "", answer: "" }])
    setExpandedIndex(items.length)
  }

  function update(i: number, field: "question" | "answer", value: string) {
    const next = [...items]
    next[i] = { ...next[i], [field]: value }
    onChange(next)
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i))
    if (expandedIndex === i) setExpandedIndex(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} FAQ{items.length !== 1 ? "s" : ""}</p>
        <motion.button
          type="button"
          onClick={add}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add FAQ
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {items.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm"
          >
            <button
              type="button"
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              <span className="truncate">{faq.question || `FAQ #${i + 1}`}</span>
              <motion.div
                animate={{ rotate: expandedIndex === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {expandedIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => update(i, "question", e.target.value)}
                      placeholder="Question"
                      className="h-9 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => update(i, "answer", e.target.value)}
                      placeholder="Answer"
                      rows={3}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                    <div className="flex justify-end">
                      <motion.button
                        type="button"
                        onClick={() => remove(i)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <X className="h-3 w-3" />
                        Remove
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center">
          <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No FAQs added yet.</p>
          <motion.button
            type="button"
            onClick={add}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-2 inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Your First FAQ
          </motion.button>
        </div>
      )}
    </div>
  )
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
