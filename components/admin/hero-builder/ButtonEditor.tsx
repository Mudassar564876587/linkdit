import type { ButtonsConfig } from "./types"
import { SectionCard, Field, Input, Toggle } from "./shared"

export default function ButtonEditor({
  value,
  onChange,
}: {
  value: ButtonsConfig
  onChange: (v: Partial<ButtonsConfig>) => void
}) {
  return (
    <SectionCard title="4. Buttons">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Show buttons</span>
        <Toggle value={value.enabled} onChange={v => onChange({ enabled: v })} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Primary button text" htmlFor="btn-primary-text">
          <Input id="btn-primary-text" value={value.primaryText} onChange={e => onChange({ primaryText: e.target.value })} />
        </Field>
        <Field label="Primary button URL" htmlFor="btn-primary-url">
          <Input id="btn-primary-url" value={value.primaryUrl} onChange={e => onChange({ primaryUrl: e.target.value })} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Secondary button text" htmlFor="btn-secondary-text">
          <Input id="btn-secondary-text" value={value.secondaryText} onChange={e => onChange({ secondaryText: e.target.value })} />
        </Field>
        <Field label="Secondary button URL" htmlFor="btn-secondary-url">
          <Input id="btn-secondary-url" value={value.secondaryUrl} onChange={e => onChange({ secondaryUrl: e.target.value })} />
        </Field>
      </div>
    </SectionCard>
  )
}
