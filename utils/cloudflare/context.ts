import { getCloudflareContext } from "@opennextjs/cloudflare";

export type CloudflareBindings = CloudflareEnv;

export function getCloudflareEnv(): CloudflareBindings {
  return getCloudflareContext().env as CloudflareBindings;
}

export function getOptionalCloudflareEnv(): CloudflareBindings | null {
  try {
    return getCloudflareEnv();
  } catch {
    return null;
  }
}

export function hasCloudflareBinding(name: keyof CloudflareBindings) {
  const env = getOptionalCloudflareEnv();
  return Boolean(env && env[name]);
}
