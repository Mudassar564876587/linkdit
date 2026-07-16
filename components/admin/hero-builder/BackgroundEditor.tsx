import type { BackgroundConfig } from "./types"
import { SectionCard, Field, ColorInput, Select, Toggle } from "./shared"

export default function BackgroundEditor({
  value,
  onChange,
}: {
  value: BackgroundConfig
  onChange: (v: Partial<BackgroundConfig>) => void
}) {
  return (
    <SectionCard title="6. Background">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Style" htmlFor="bg-style">
          <Select id="bg-style" value={value.style} onChange={e => onChange({ style: e.target.value })}>
            <option value="gradient">Gradient</option>
            <option value="solid">Solid color</option>
          </Select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Primary color">
          <ColorInput value={value.primaryColor} onChange={v => onChange({ primaryColor: v })} />
        </Field>
        <Field label="Secondary color">
          <ColorInput value={value.secondaryColor} onChange={v => onChange({ secondaryColor: v })} />
        </Field>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Show animated orbs</span>
        <Toggle value={value.showOrbs} onChange={v => onChange({ showOrbs: v })} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Show dot pattern</span>
        <Toggle value={value.showDots} onChange={v => onChange({ showDots: v })} />
      </div>
    </SectionCard>
  )
}
