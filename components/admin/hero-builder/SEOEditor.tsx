import type { SEOConfig } from "./types"
import { SectionCard, Field, Input, Textarea } from "./shared"

export default function SEOEditor({
  value,
  onChange,
}: {
  value: SEOConfig
  onChange: (v: Partial<SEOConfig>) => void
}) {
  return (
    <SectionCard title="9. SEO">
      <Field label="Meta title" htmlFor="seo-title" hint="Appears in search engine results.">
        <Input id="seo-title" value={value.title} onChange={e => onChange({ title: e.target.value })} />
      </Field>
      <Field label="Meta description" htmlFor="seo-desc" hint="Appears below the title in search results.">
        <Textarea id="seo-desc" rows={3} value={value.description} onChange={e => onChange({ description: e.target.value })} />
      </Field>
    </SectionCard>
  )
}
