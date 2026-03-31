import { createClient } from "@supabase/supabase-js";
import { getAppKey } from "./project";

export const createServiceRoleClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          "x-app-key": getAppKey(),
        },
      },
    }
  );
};
