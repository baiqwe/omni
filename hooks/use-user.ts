"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";

export type AppUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

export function useUser() {
  const { data, status } = useSession();

  const user = useMemo<AppUser | null>(() => {
    if (!data?.user?.id) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email ?? null,
      name: data.user.name ?? null,
      image: data.user.image ?? null,
    };
  }, [data?.user]);

  return {
    user,
    loading: status === "loading",
  };
}
