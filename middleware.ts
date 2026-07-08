import { updateSession } from "@/lib/supabase/middleware"
import {
  PROTECTED_ROUTES,
  LOGIN_REDIRECT,
  AUTH_REDIRECT,
} from "@/config/auth"
import { NextResponse, type NextRequest } from "next/server"

const AUTH_PAGE_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"]
const ADMIN_BASE = "/linkdit-studio-8k92"

function serve404() {
  const body = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>404 Not Found</title><meta name="robots" content="noindex"><style>body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#fff;color:#333}h1{font-size:6rem;font-weight:700;margin:0;padding:0;color:#e5e7eb}p{color:#6b7280;font-size:1.25rem;margin:0.5rem 0 0}</style></head><body><div style="text-align:center"><h1>404</h1><p>Page not found</p></div></body></html>`
  return new NextResponse(body, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}

export async function middleware(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Admin routes: 404 for all non-admin users, never redirect
  if (pathname.startsWith(ADMIN_BASE)) {
    if (!user) return serve404()
    return supabaseResponse
  }

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthPage = AUTH_PAGE_PATHS.some((path) => pathname.startsWith(path))

  if (isProtected && !user) {
    const url = new URL(LOGIN_REDIRECT, request.url)
    url.searchParams.set("redirectTo", pathname)
    return Response.redirect(url)
  }

  if (isAuthPage && user) {
    return Response.redirect(new URL(AUTH_REDIRECT, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
