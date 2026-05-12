import { getCloudflareEnv } from "@/utils/cloudflare/context";

export function getRateLimitKv() {
  return getCloudflareEnv().RATE_LIMIT_KV;
}
