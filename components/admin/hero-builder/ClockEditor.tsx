import type { ClockConfig } from "./types"
import { SectionCard, Toggle } from "./shared"

export default function ClockEditor({
  value,
  onChange,
}: {
  value: ClockConfig
  onChange: (v: Partial<ClockConfig>) => void
}) {
  return (
    <SectionCard title="7. Clock">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Show AI clock</span>
        <Toggle value={value.enabled} onChange={v => onChange({ enabled: v })} />
      </div>
    </SectionCard>
  )
}
