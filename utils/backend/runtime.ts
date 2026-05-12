import { getOptionalCloudflareEnv } from "@/utils/cloudflare/context";

export type DataBackend = "supabase" | "cloudflare";

export function getPreferredDataBackend(): DataBackend {
  const explicit = process.env.DATA_BACKEND?.trim().toLowerCase();
  if (explicit === "cloudflare") return "cloudflare";
  if (explicit === "supabase") return "supabase";

  const env = getOptionalCloudflareEnv();
  if (env?.DB && env?.MEDIA_BUCKET && env?.RATE_LIMIT_KV) {
    return "cloudflare";
  }

  return "supabase";
}

export function isCloudflareDataBackend() {
  return getPreferredDataBackend() === "cloudflare";
}
