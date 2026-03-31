import { createBrowserClient } from "@supabase/ssr";
import { getAppKey } from "./project";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          "x-app-key": getAppKey(),
        },
      },
    }
  );
