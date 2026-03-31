import { headers } from "next/headers";
import { site } from "@/config/site";

function normalizeOrigin(value?: string | null) {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export async function getRequestOrigin() {
  const headerList = await headers();

  const originHeader = normalizeOrigin(headerList.get("origin"));
  if (originHeader) {
    return originHeader;
  }

  const forwardedHost = headerList.get("x-forwarded-host");
  const host = forwardedHost || headerList.get("host");
  if (host) {
    const forwardedProto = headerList.get("x-forwarded-proto");
    const protocol = forwardedProto || (host.includes("localhost") ? "http" : "https");
    return `${protocol}://${host}`;
  }

  return site.siteUrl;
}
