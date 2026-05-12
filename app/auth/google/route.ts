import { NextResponse } from "next/server";
import { getRequestOrigin } from "@/utils/request";
import { getLocalePath, normalizeLocale } from "@/utils/utils";

export const runtime = "nodejs";

function resolveSafeNextPath(nextPath: string | null, locale: string) {
  if (!nextPath) return getLocalePath("/dashboard", locale);
  if (/^https?:\/\//i.test(nextPath)) return getLocalePath("/dashboard", locale);
  if (!/^\/(en|zh)(\/|$)/.test(nextPath)) return getLocalePath("/dashboard", locale);
  return nextPath;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const locale = normalizeLocale(requestUrl.searchParams.get("locale"));
  const nextPath = resolveSafeNextPath(requestUrl.searchParams.get("next"), locale);
  const origin = await getRequestOrigin();
  const callbackUrl = new URL(nextPath, origin).toString();
  const signInUrl = new URL("/api/auth/signin/google", origin);
  signInUrl.searchParams.set("callbackUrl", callbackUrl);
  return NextResponse.redirect(signInUrl);
}
