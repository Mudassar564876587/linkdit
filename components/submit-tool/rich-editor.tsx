"use client"

import { useRef, useCallback } from "react"
import { Bold, Italic, List, Heading } from "lucide-react"

type RichEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export default function RichEditor({ value, onChange, placeholder = "Write something...", minHeight = "200px" }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  return (
    <div className="rounded-xl border border-input overflow-hidden">
      <div className="flex items-center gap-1 border-b border-border bg-muted/50 px-3 py-2" role="toolbar" aria-label="Text formatting">
        <button
          type="button"
          onClick={() => exec("bold")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <span className="h-5 w-px bg-border" aria-hidden="true" />
        <button
          type="button"
          onClick={() => exec("formatBlock", "h3")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Heading"
        >
          <Heading className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Bullet list"
        >
          <List className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="min-h-[200px] w-full bg-background px-4 py-3 text-sm text-foreground outline-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
        style={{ minHeight }}
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  )
}
