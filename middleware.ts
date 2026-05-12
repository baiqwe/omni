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

  // Single-page mode: keep only /{locale} and a small set of trust/legal pages.
  const allowedLocalizedPaths = /^\/(en|zh)\/(about|contact|privacy|terms)\/?$/
  if (allowedLocalizedPaths.test(request.nextUrl.pathname)) {
    return intlMiddleware(request)
  }

  const singlePageMatch = request.nextUrl.pathname.match(/^\/(en|zh)\/.+/)
  if (singlePageMatch) {
    const localeRootUrl = request.nextUrl.clone()
    localeRootUrl.pathname = `/${singlePageMatch[1]}`
    localeRootUrl.search = ""
    return NextResponse.redirect(localeRootUrl, 307)
  }

  return intlMiddleware(request)
}

export const config = {
  // Exclude auth route handlers so next-intl does not prefix them with /en or /zh.
  matcher: ['/((?!api|_next|_vercel|auth/callback|auth/google|.*\\..*).*)', '/(en|zh)/:path*']
}
