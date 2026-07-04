import { cn } from "@/lib/utils"

export default function StatsCard({
  label,
  value,
  icon,
  className,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-border bg-background p-5 shadow-sm",
        className
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
