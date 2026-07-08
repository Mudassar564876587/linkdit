export const AUTH_ROUTES = {
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
} as const

export const PROTECTED_ROUTES = ["/onboarding", "/dashboard", "/submit-tool", "/linkdit-studio-8k92"] as const

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/auth/callback",
] as const

export const AUTH_REDIRECT = "/"
export const LOGIN_REDIRECT = "/login"
export const ONBOARDING_REDIRECT = "/onboarding"
