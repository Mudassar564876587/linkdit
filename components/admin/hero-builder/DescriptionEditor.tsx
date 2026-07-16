import type { DescriptionConfig } from "./types"
import { SectionCard, Field, Input, Textarea, ColorInput } from "./shared"

export default function DescriptionEditor({
  value,
  onChange,
}: {
  value: DescriptionConfig
  onChange: (v: Partial<DescriptionConfig>) => void
}) {
  return (
    <SectionCard title="3. Hero Description">
      <Field label="Text" htmlFor="desc-text">
        <Textarea id="desc-text" rows={3} value={value.text} onChange={e => onChange({ text: e.target.value })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Max width" htmlFor="desc-width">
          <Input id="desc-width" value={value.maxWidth} onChange={e => onChange({ maxWidth: e.target.value })} />
        </Field>
        <Field label="Font size" htmlFor="desc-size">
          <Input id="desc-size" value={value.fontSize} onChange={e => onChange({ fontSize: e.target.value })} />
        </Field>
        <Field label="Line height" htmlFor="desc-leading">
          <Input id="desc-leading" value={value.lineHeight} onChange={e => onChange({ lineHeight: e.target.value })} />
        </Field>
        <Field label="Text color">
          <ColorInput value={value.color} onChange={v => onChange({ color: v })} />
        </Field>
      </div>
    </SectionCard>
  )
}
