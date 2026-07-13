import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
}

export function SectionHeader({ title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <h2 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[2.25rem] lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg lg:leading-relaxed max-w-lg mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}
