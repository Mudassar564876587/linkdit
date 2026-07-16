import type { AnnouncementConfig } from "./types"
import { SectionCard, Field, Input, ColorInput, Toggle } from "./shared"

export default function AnnouncementEditor({
  value,
  onChange,
}: {
  value: AnnouncementConfig
  onChange: (v: Partial<AnnouncementConfig>) => void
}) {
  return (
    <SectionCard title="1. Announcement Bar">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Show announcement bar</span>
        <Toggle value={value.enabled} onChange={v => onChange({ enabled: v })} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Text" htmlFor="ann-text">
          <Input id="ann-text" value={value.text} onChange={e => onChange({ text: e.target.value })} />
        </Field>
        <Field label="Link URL" htmlFor="ann-url">
          <Input id="ann-url" value={value.url} onChange={e => onChange({ url: e.target.value })} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Background color">
          <ColorInput value={value.bgColor} onChange={v => onChange({ bgColor: v })} />
        </Field>
        <Field label="Text color">
          <ColorInput value={value.textColor} onChange={v => onChange({ textColor: v })} />
        </Field>
      </div>
    </SectionCard>
  )
}
