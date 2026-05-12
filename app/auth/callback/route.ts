import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = /^\/(zh)(\/|$)/.test(url.pathname) ? "zh" : "en";
  return NextResponse.redirect(new URL(`/${locale}/sign-in?message=oauth_callback_moved`, url.origin));
}
