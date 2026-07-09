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
  verification: {
    google: "Fi8XZhJhn7ladGLqrmJ6-0jioFvJySHrAsS-PE2G_ZM",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon/favicon.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/favicon/favicon.png", sizes: "180x180", type: "image/png" },
    ],
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
