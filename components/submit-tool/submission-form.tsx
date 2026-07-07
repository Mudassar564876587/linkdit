"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Send, Save, Loader2, Sparkles } from "lucide-react"
import { createSubmission, saveDraft } from "@/actions/submissions"
import { aiAutofill } from "@/actions/submissions/ai-autofill"
import ImageUpload from "./image-upload"
import RichEditor from "./rich-editor"
import ListManager from "./list-manager"
import FaqManager from "./faq-manager"

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

export default function SubmissionForm({ categories }: SubmissionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [aiUrl, setAiUrl] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

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

  const [logoFile, setLogoFile] = useState<File[]>([])
  const [coverFile, setCoverFile] = useState<File[]>([])
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])

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
    fd.set("contactEmail", contactEmail)
    fd.set("tags", JSON.stringify(parseTags()))
    fd.set("features", JSON.stringify(features))
    fd.set("pros", JSON.stringify(pros))
    fd.set("cons", JSON.stringify(cons))
    fd.set("faqs", JSON.stringify(faqs))
    if (logoFile[0]) fd.set("logoFile", logoFile[0])
    if (coverFile[0]) fd.set("coverFile", coverFile[0])
    for (const f of galleryFiles) fd.append("galleryFiles", f)
    return fd
  }, [toolName, websiteUrl, shortDescription, fullDescription, pricing, categoryId, contactEmail, parseTags, features, pros, cons, faqs, logoFile, coverFile, galleryFiles])

  async function handleAutoFill() {
    if (!aiUrl.trim()) return
    setAiLoading(true)
    setAiError(null)

    const result = await aiAutofill(aiUrl.trim())

    setAiLoading(false)

    if (result.error) {
      setAiError(result.error)
      return
    }

    const d = result.data

    if (d.toolName) setToolName(d.toolName)

    setWebsiteUrl(aiUrl.trim())

    if (d.shortDescription) setShortDescription(d.shortDescription)
    if (d.fullDescription) setFullDescription(d.fullDescription)

    if (d.categoryName && categories.length > 0) {
      const match = matchCategory(d.categoryName, categories)
      if (match) {
        setCategoryId(match.id)
      }
    }

    if (d.contactEmail) {
      setContactEmail(d.contactEmail)
    }

    if (d.pricing && ["Free", "Freemium", "Paid"].includes(d.pricing)) {
      setPricing(d.pricing)
    }

    if (d.tags && Array.isArray(d.tags)) {
      setTags(d.tags.join(", "))
    }
    if (d.features && Array.isArray(d.features)) {
      setFeatures(d.features.slice(0, 10))
    }
    if (d.pros && Array.isArray(d.pros)) {
      setPros(d.pros.slice(0, 5))
    }
    if (d.cons && Array.isArray(d.cons)) {
      setCons(d.cons.slice(0, 5))
    }
    if (d.faqs && Array.isArray(d.faqs)) {
      setFaqs(d.faqs.slice(0, 5).map((f: { question: string; answer: string }) => ({
        question: f.question || "",
        answer: f.answer || "",
      })))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const fd = buildFormData()
      const result = await createSubmission(fd)

      if (result.error) {
        setError(result.error)
      } else {
        router.push("/dashboard/my-submissions")
        return
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
    }

    setLoading(false)
  }

  async function handleSaveDraft() {
    setError(null)
    const fd = buildFormData()
    const result = await saveDraft(fd)
    if (result.error) setError(result.error)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      {/* AI Auto Fill */}
      <section className="rounded-xl border border-blue-200 bg-blue-50 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h2 className="text-sm font-semibold text-blue-900">Auto Fill with AI</h2>
        </div>
        <p className="mb-3 text-xs text-blue-700">
          Enter the tool&apos;s website URL and AI will automatically fill the form below.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="url"
            value={aiUrl}
            onChange={(e) => setAiUrl(e.target.value)}
            placeholder="https://example.com"
            className="h-10 flex-1 rounded-lg border border-blue-300 bg-white px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAutoFill}
            disabled={aiLoading || !aiUrl.trim()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0"
          >
            {aiLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Auto Fill with AI
          </button>
        </div>
        {aiLoading && (
          <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            Fetching website and analyzing with AI...
          </div>
        )}
        {aiError && (
          <p className="mt-2 text-xs text-red-600">{aiError}</p>
        )}
      </section>

      {/* Basic Info */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="toolName" className="text-sm font-medium text-foreground">Tool Name *</label>
            <input
              id="toolName"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              required
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Super AI Writer"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="websiteUrl" className="text-sm font-medium text-foreground">Website URL *</label>
            <input
              id="websiteUrl"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              required
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="shortDescription" className="text-sm font-medium text-foreground">Short Description *</label>
          <textarea
            id="shortDescription"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            placeholder="Brief description of the tool (10–1000 characters)"
          />
          <p className="text-xs text-muted-foreground">{shortDescription.length}/1000</p>
        </div>
      </section>

      {/* Full Description */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Full Description</h2>
        <RichEditor value={fullDescription} onChange={setFullDescription} placeholder="Describe your tool in detail..." />
      </section>

      {/* Category & Pricing */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="categoryId" className="text-sm font-medium text-foreground">Category *</label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="pricing" className="text-sm font-medium text-foreground">Pricing *</label>
          <select
            id="pricing"
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="Free">Free</option>
            <option value="Freemium">Freemium</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <label htmlFor="tags" className="text-sm font-medium text-foreground">Tags (comma separated)</label>
        <input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="AI, writing, content"
        />
      </div>

      {/* Contact */}
      <div className="space-y-1.5">
        <label htmlFor="contactEmail" className="text-sm font-medium text-foreground">Contact Email *</label>
        <input
          id="contactEmail"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="you@example.com"
        />
      </div>

      {/* Images */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Images</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUpload label="Logo" name="logoFile" onChange={(f) => setLogoFile(f)} />
          <ImageUpload label="Cover Image" name="coverFile" onChange={(f) => setCoverFile(f)} />
        </div>
        <ImageUpload label="Gallery Images" name="galleryFiles" maxFiles={10} onChange={(f) => setGalleryFiles(f)} />
      </section>

      {/* Features, Pros, Cons */}
      <section className="grid gap-6 sm:grid-cols-2">
        <ListManager label="Features" items={features} onChange={setFeatures} placeholder="Add a feature..." />
        <ListManager label="Pros" items={pros} onChange={setPros} placeholder="Add a pro..." />
        <ListManager label="Cons" items={cons} onChange={setCons} placeholder="Add a con..." />
      </section>

      {/* FAQ */}
      <section>
        <FaqManager items={faqs} onChange={setFaqs} />
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Submit for Review
        </button>
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={loading}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-6 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50 transition-colors"
        >
          <Save className="h-4 w-4" />
          Save as Draft
        </button>
      </div>
    </form>
  )
}
