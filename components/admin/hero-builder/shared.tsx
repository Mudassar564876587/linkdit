import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        value ? "bg-primary" : "bg-muted"
      )}
    >
      <span className={cn(
        "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
        value && "translate-x-5"
      )} />
    </button>
  )
}

export function SectionCard({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl border border-border bg-background">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl px-6 py-4 text-left transition-colors hover:bg-accent/30"
      >
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && <div className="border-t border-border px-6 py-5 space-y-5">{children}</div>}
    </div>
  )
}

export function Field({ label, htmlFor, hint, children }: { label: string; htmlFor?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
        props.className
      )}
    />
  )
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none",
        props.className
      )}
    />
  )
}

export function ColorInput({ value, onChange, id }: { value: string; onChange: (v: string) => void; id?: string }) {
  return (
    <input id={id} type="color" value={value} onChange={e => onChange(e.target.value)}
      className="h-9 w-full rounded-lg border border-input bg-background px-1 cursor-pointer" />
  )
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
        props.className
      )}
    />
  )
}
