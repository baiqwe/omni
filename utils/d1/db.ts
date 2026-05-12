import { getCloudflareEnv } from "@/utils/cloudflare/context";

export function getD1() {
  return getCloudflareEnv().DB;
}

export function isoNow() {
  return new Date().toISOString();
}

export function jsonStringify(value: unknown) {
  return JSON.stringify(value ?? null);
}

export function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
