"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export type ChecklistItem = {
  key: string
  label: string
  done: boolean
  optional?: boolean
}

type CompletionChecklistProps = {
  items: ChecklistItem[]
}

export default function CompletionChecklist({ items }: CompletionChecklistProps) {
  const completed = items.filter((i) => i.done).length
  const total = items.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-background to-muted/50 p-5 shadow-premium">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Completion Checklist</h3>
        <motion.div
          key={percentage}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className={cn(
            "flex h-7 min-w-[2rem] items-center justify-center rounded-full px-2 text-xs font-bold",
            percentage === 100
              ? "bg-emerald-100 text-emerald-700"
              : percentage >= 50
              ? "bg-blue-100 text-blue-700"
              : "bg-muted text-muted-foreground"
          )}
        >
          {percentage}%
        </motion.div>
      </div>

      {total > 0 && (
        <div className="mb-3 h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              percentage === 100 ? "bg-emerald-500" : "bg-blue-500"
            )}
          />
        </div>
      )}

      <div className="space-y-1.5">
        {items.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors",
              item.done ? "text-emerald-700" : "text-muted-foreground"
            )}
          >
            {item.done ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              </motion.div>
            ) : (
              <Circle className="h-3.5 w-3.5 shrink-0" />
            )}
            <span className="flex-1">{item.label}</span>
            {item.optional && !item.done && (
              <span className="text-[10px] text-muted-foreground">Optional</span>
            )}
          </motion.div>
        ))}
      </div>

      {percentage === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Everything looks great! Ready to submit.
        </motion.div>
      )}
    </div>
  )
}
