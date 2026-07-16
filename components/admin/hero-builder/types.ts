export interface AnnouncementConfig {
  enabled: boolean
  text: string
  url: string
  bgColor: string
  textColor: string
}

export interface HeadingConfig {
  line1: string
  line2: string
  line3: string
  gradient1: string
  gradient2: string
  gradient3: string
  gradient4: string
  fontWeight: string
  fontSize: string
  letterSpacing: string
  lineHeight: string
}

export interface DescriptionConfig {
  text: string
  maxWidth: string
  fontSize: string
  lineHeight: string
  color: string
}

export interface ButtonsConfig {
  enabled: boolean
  primaryText: string
  primaryUrl: string
  primaryIcon: string
  secondaryText: string
  secondaryUrl: string
  secondaryIcon: string
}

export interface SearchConfig {
  enabled: boolean
  placeholder: string
  buttonText: string
}

export interface BackgroundConfig {
  style: string
  primaryColor: string
  secondaryColor: string
  showOrbs: boolean
  showDots: boolean
}

export interface ClockConfig {
  enabled: boolean
}

export interface MediaConfig {
  bannerType: "none" | "image" | "video" | "youtube" | "vimeo" | "lottie"

  desktopImageUrl: string
  desktopImageFileName: string
  desktopImageFileSize: number

  mobileImageUrl: string
  mobileImageFileName: string
  mobileImageFileSize: number

  videoUrl: string
  videoFileName: string
  videoFileSize: number
  videoPosterUrl: string

  youtubeUrl: string
  youtubeVideoId: string

  vimeoUrl: string
  vimeoVideoId: string

  lottieUrl: string

  desktopUrl: string
  tabletUrl: string
  mobileUrl: string

  autoplay: boolean
  loop: boolean
  muted: boolean
  controls: boolean
  playOnHover: boolean
  lazyLoad: boolean

  overlayEnabled: boolean
  overlayOpacity: number
  overlayColor: string
  overlayGradient: string

  desktopHeight: string
  laptopHeight: string
  tabletHeight: string
  mobileHeight: string

  bannerPosition: "center" | "top" | "bottom" | "left" | "right"

  objectFit: "cover" | "contain" | "fill"

  borderRadius: number

  shadowEnabled: boolean
  shadowBlur: number
  shadowSpread: number
  shadowOpacity: number

  glowEnabled: boolean
  glowColor: string
  glowIntensity: number

  animation: "none" | "fade" | "zoom" | "parallax" | "floating" | "scale" | "kenBurns"
}

export interface SEOConfig {
  title: string
  description: string
}

export interface HeroConfig {
  announcement: AnnouncementConfig
  heading: HeadingConfig
  description: DescriptionConfig
  buttons: ButtonsConfig
  search: SearchConfig
  background: BackgroundConfig
  clock: ClockConfig
  media: MediaConfig
  seo: SEOConfig
}

export const defaultConfig: HeroConfig = {
  announcement: { enabled: false, text: "New AI tools added weekly!", url: "/tools", bgColor: "#2563EB", textColor: "#ffffff" },
  heading: { line1: "Find the Best", line2: "AI Tools", line3: "for Every Task", gradient1: "#2563EB", gradient2: "#4F46E5", gradient3: "#7C3AED", gradient4: "#A855F7", fontWeight: "900", fontSize: "76px", letterSpacing: "-0.05em", lineHeight: "0.9" },
  description: { text: "Explore curated AI tools, in-depth comparisons, and expert tutorials designed to help creators, developers, and businesses work smarter.", maxWidth: "560px", fontSize: "18px", lineHeight: "1.75", color: "#64748b" },
  buttons: { enabled: true, primaryText: "Explore AI Tools", primaryUrl: "/tools", primaryIcon: "Sparkles", secondaryText: "Read Articles", secondaryUrl: "/articles", secondaryIcon: "ArrowUpRight" },
  search: { enabled: true, placeholder: "Search any AI tool...", buttonText: "Search" },
  background: { style: "gradient", primaryColor: "#2563EB", secondaryColor: "#7C3AED", showOrbs: true, showDots: true },
  clock: { enabled: true },
  media: {
    bannerType: "none",
    desktopImageUrl: "", desktopImageFileName: "", desktopImageFileSize: 0,
    mobileImageUrl: "", mobileImageFileName: "", mobileImageFileSize: 0,
    videoUrl: "", videoFileName: "", videoFileSize: 0, videoPosterUrl: "",
    youtubeUrl: "", youtubeVideoId: "",
    vimeoUrl: "", vimeoVideoId: "",
    lottieUrl: "",
    desktopUrl: "", tabletUrl: "", mobileUrl: "",
    autoplay: true, loop: false, muted: false, controls: true, playOnHover: false, lazyLoad: true,
    overlayEnabled: false, overlayOpacity: 50, overlayColor: "#000000", overlayGradient: "",
    desktopHeight: "600px", laptopHeight: "500px", tabletHeight: "400px", mobileHeight: "300px",
    bannerPosition: "center",
    objectFit: "cover",
    borderRadius: 0,
    shadowEnabled: false, shadowBlur: 20, shadowSpread: 0, shadowOpacity: 20,
    glowEnabled: false, glowColor: "#2563EB", glowIntensity: 30,
    animation: "none",
  },
  seo: { title: "Find the Best AI Tools | LinkDit", description: "Discover and compare the best AI tools for every task. Curated reviews, expert insights, and real user feedback." },
}
