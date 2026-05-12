import { getCloudflareEnv } from "@/utils/cloudflare/context";

export function getMediaBucket() {
  return getCloudflareEnv().MEDIA_BUCKET;
}

export function buildMediaObjectKey(parts: string[]) {
  return parts
    .filter(Boolean)
    .map((part) => part.replace(/^\/+|\/+$/g, ""))
    .join("/");
}
