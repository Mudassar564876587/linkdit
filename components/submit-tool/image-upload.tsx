"use client"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { validateImage, compressImage } from "@/lib/upload"

type ImageUploadProps = {
  label: string
  name: string
  accept?: string
  maxFiles?: number
  onChange: (files: File[]) => void
  existing?: string | string[]
}

export default function ImageUpload({ label, name, accept = "image/*", maxFiles = 1, onChange, existing }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(() => {
    if (existing) return Array.isArray(existing) ? existing : [existing]
    return []
  })
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    const files = Array.from(e.target.files ?? [])

    if (previews.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""}.`)
      return
    }

    for (const file of files) {
      const err = validateImage(file)
      if (err) { setError(err); return }
    }

    const newFiles: File[] = []
    const newPreviews: string[] = []

    for (const file of files) {
      try {
        const compressed = await compressImage(file)
        const newFile = new File([compressed], file.name, { type: file.type })
        newFiles.push(newFile)
        newPreviews.push(URL.createObjectURL(compressed))
      } catch {
        newFiles.push(file)
        newPreviews.push(URL.createObjectURL(file))
      }
    }

    const allFiles = newFiles
    const allPreviews = [...previews, ...newPreviews]
    setPreviews(allPreviews)
    onChange(allFiles)

    if (inputRef.current) inputRef.current.value = ""
  }

  function remove(i: number) {
    const newPreviews = previews.filter((_, idx) => idx !== i)
    setPreviews(newPreviews)
    onChange([])
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <div
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click() }}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-6 transition-colors hover:border-primary hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          previews.length >= maxFiles && "pointer-events-none opacity-50"
        )}
      >
        <Upload className="mb-2 h-6 w-6 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          {previews.length >= maxFiles ? "Limit reached" : `Click to upload ${maxFiles > 1 ? "images" : "an image"}`}
        </p>
        <p className="text-xs text-muted-foreground">JPEG, PNG, WebP up to 5MB</p>
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleSelect}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {previews.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-border">
              <img src={src} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
