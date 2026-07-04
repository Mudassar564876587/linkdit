"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Send, Save, Loader2 } from "lucide-react"
import { createSubmission, saveDraft } from "@/actions/submissions"
import ImageUpload from "./image-upload"
import RichEditor from "./rich-editor"
import ListManager from "./list-manager"
import FaqManager from "./faq-manager"

type SubmissionFormProps = {
  categories: { id: string; name: string }[]
}

export default function SubmissionForm({ categories }: SubmissionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    if (galleryFiles.length) fd.set("galleryFiles", JSON.stringify(galleryFiles))
    return fd
  }, [toolName, websiteUrl, shortDescription, fullDescription, pricing, categoryId, contactEmail, parseTags, features, pros, cons, faqs, logoFile, coverFile, galleryFiles])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = buildFormData()
    const result = await createSubmission(fd)

    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      router.push("/dashboard/my-submissions")
    }
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
