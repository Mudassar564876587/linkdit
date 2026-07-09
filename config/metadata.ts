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
    images: [{ url: "/images/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} - AI Discovery Platform`,
    description: SITE.description,
    images: ["/images/og-default.png"],
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
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon/favicon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
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
