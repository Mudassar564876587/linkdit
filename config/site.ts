import { SITE } from "@/constants/site"

export const siteConfig = {
  name: SITE.name,
  tagline: SITE.tagline,
  description: SITE.description,
  url: SITE.url,
  locale: SITE.locale,

  features: {
    search: true,
    compare: true,
    newsletter: true,
    ratings: true,
  },

  pagination: {
    defaultPageSize: 12,
    toolsPerPage: 24,
    articlesPerPage: 9,
  },

  limits: {
    featuredTools: 6,
    latestArticles: 3,
    popularSearches: 6,
    categoryCards: 6,
  },
} as const
