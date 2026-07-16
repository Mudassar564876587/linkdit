import type { SearchConfig } from "./types"
import { SectionCard, Field, Input, Toggle } from "./shared"

export default function SearchEditor({
  value,
  onChange,
}: {
  value: SearchConfig
  onChange: (v: Partial<SearchConfig>) => void
}) {
  return (
    <SectionCard title="5. Search Box">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Show search box</span>
        <Toggle value={value.enabled} onChange={v => onChange({ enabled: v })} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Placeholder text" htmlFor="search-placeholder">
          <Input id="search-placeholder" value={value.placeholder} onChange={e => onChange({ placeholder: e.target.value })} />
        </Field>
        <Field label="Button text" htmlFor="search-button">
          <Input id="search-button" value={value.buttonText} onChange={e => onChange({ buttonText: e.target.value })} />
        </Field>
      </div>
    </SectionCard>
  )
}
