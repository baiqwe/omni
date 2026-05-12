import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const duplicateLocaleMatch = request.nextUrl.pathname.match(/^\/(en|zh)(?:\/(en|zh))+?(?=\/|$)/)
  if (duplicateLocaleMatch) {
    const normalizedPathname = request.nextUrl.pathname.replace(/^\/(en|zh)(?:\/(?:en|zh))+/, `/${duplicateLocaleMatch[1]}`)
    const normalizedUrl = request.nextUrl.clone()
    normalizedUrl.pathname = normalizedPathname || `/${duplicateLocaleMatch[1]}`
    return NextResponse.redirect(normalizedUrl, 307)
  }

  return intlMiddleware(request)
}

export const config = {
  // Exclude auth route handlers so next-intl does not prefix them with /en or /zh.
  matcher: ['/((?!api|_next|_vercel|auth/callback|auth/google|.*\\..*).*)', '/(en|zh)/:path*']
}
