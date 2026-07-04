import { updateSession } from "@/lib/supabase/middleware"
import {
  AUTH_ROUTES,
  PROTECTED_ROUTES,
  LOGIN_REDIRECT,
  AUTH_REDIRECT,
} from "@/config/auth"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request)
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthPage = Object.values(AUTH_ROUTES).some((route) =>
    pathname.startsWith(route)
  )

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
