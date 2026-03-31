import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_APP_KEY = "anima";

let cachedProjectIdPromise: Promise<string> | null = null;

export function getAppKey() {
  return process.env.NEXT_PUBLIC_APP_KEY || process.env.APP_KEY || DEFAULT_APP_KEY;
}

export async function getProjectId(supabase: SupabaseClient) {
  if (!cachedProjectIdPromise) {
    cachedProjectIdPromise = (async () => {
      const { data, error } = await supabase
        .from("app_projects")
        .select("id")
        .eq("key", getAppKey())
        .single();

      if (error || !data?.id) {
        throw new Error(
          `Failed to resolve Supabase app project for key "${getAppKey()}": ${error?.message || "missing row"}`
        );
      }

      return data.id;
    })();
  }

  return cachedProjectIdPromise;
}
