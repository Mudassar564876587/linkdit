import type { Metadata } from "next"
import { SITE } from "@/constants/site"

export const defaultMetadata: Metadata = {
  title: {
    default: `${SITE.name} - AI Discovery Platform`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: `${SITE.name} - AI Discovery Platform`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} - AI Discovery Platform`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export function createMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    ...defaultMetadata,
    ...overrides,
    openGraph: {
      ...defaultMetadata.openGraph,
      ...overrides?.openGraph,
    },
    twitter: {
      ...defaultMetadata.twitter,
      ...overrides?.twitter,
    },
  }
}
