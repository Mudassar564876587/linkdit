import type { HeadingConfig } from "./types"
import { SectionCard, Field, Input, ColorInput, Select } from "./shared"

export default function HeadingEditor({
  value,
  onChange,
}: {
  value: HeadingConfig
  onChange: (v: Partial<HeadingConfig>) => void
}) {
  return (
    <SectionCard title="2. Hero Heading">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Line 1" htmlFor="head-line1">
          <Input id="head-line1" value={value.line1} onChange={e => onChange({ line1: e.target.value })} />
        </Field>
        <Field label="Line 2" htmlFor="head-line2">
          <Input id="head-line2" value={value.line2} onChange={e => onChange({ line2: e.target.value })} />
        </Field>
        <Field label="Line 3" htmlFor="head-line3">
          <Input id="head-line3" value={value.line3} onChange={e => onChange({ line3: e.target.value })} />
        </Field>
      </div>
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">Gradient colors</p>
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Stop 1">
            <ColorInput value={value.gradient1} onChange={v => onChange({ gradient1: v })} />
          </Field>
          <Field label="Stop 2">
            <ColorInput value={value.gradient2} onChange={v => onChange({ gradient2: v })} />
          </Field>
          <Field label="Stop 3">
            <ColorInput value={value.gradient3} onChange={v => onChange({ gradient3: v })} />
          </Field>
          <Field label="Stop 4">
            <ColorInput value={value.gradient4} onChange={v => onChange({ gradient4: v })} />
          </Field>
        </div>
        <div className="mt-3 h-8 w-full rounded-lg" style={{ background: `linear-gradient(to right, ${value.gradient1}, ${value.gradient2}, ${value.gradient3}, ${value.gradient4})` }} />
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Font weight" htmlFor="head-weight">
          <Select id="head-weight" value={value.fontWeight} onChange={e => onChange({ fontWeight: e.target.value })}>
            <option value="700">700 (Bold)</option>
            <option value="800">800 (ExtraBold)</option>
            <option value="900">900 (Black)</option>
          </Select>
        </Field>
        <Field label="Font size" htmlFor="head-size">
          <Input id="head-size" value={value.fontSize} onChange={e => onChange({ fontSize: e.target.value })} />
        </Field>
        <Field label="Letter spacing" htmlFor="head-tracking">
          <Input id="head-tracking" value={value.letterSpacing} onChange={e => onChange({ letterSpacing: e.target.value })} />
        </Field>
        <Field label="Line height" htmlFor="head-leading">
          <Input id="head-leading" value={value.lineHeight} onChange={e => onChange({ lineHeight: e.target.value })} />
        </Field>
      </div>
    </SectionCard>
  )
}
