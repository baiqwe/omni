"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { workspaceActions } from "@/hooks/use-multi-modal-workspace";

export function WorkspaceQuerySync() {
  const searchParams = useSearchParams();

  useEffect(() => {
    workspaceActions.hydrateFromQuery({
      mode: searchParams.get("mode") ?? undefined,
      prompt: searchParams.get("prompt") ?? undefined,
      ratio: searchParams.get("ratio") ?? undefined,
      aspectRatio: searchParams.get("aspectRatio") ?? undefined,
      duration: searchParams.get("duration") ?? undefined,
      durationSeconds: searchParams.get("durationSeconds") ?? undefined,
      resolution: searchParams.get("resolution") ?? undefined,
      containsRealPeople: searchParams.get("containsRealPeople") ?? undefined,
      returnLastFrame: searchParams.get("returnLastFrame") ?? undefined,
    });
  }, [searchParams]);

  return null;
}
