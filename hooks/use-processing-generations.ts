"use client";

import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/hooks/use-user";

export type ProcessingGeneration = {
  id: string;
  status: string;
  status_detail: string | null;
  created_at: string;
  prompt: string;
  credits_cost: number;
  resolution: string | null;
  duration_seconds: number | null;
  aspect_ratio: string | null;
  generation_type: string | null;
  provider_job_id: string | null;
  output_video_url: string | null;
  metadata?: Record<string, unknown> | null;
};

export function useProcessingGenerations() {
  const { user } = useUser();
  const [generations, setGenerations] = useState<ProcessingGeneration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGenerations = useCallback(async () => {
    if (!user) {
      setGenerations([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/ai/generate?limit=8", { cache: "no-store" });
      const data = await response.json();
      if (response.ok) {
        setGenerations(data.generations || []);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchGenerations();
    if (!user) return;

    const timer = window.setInterval(() => {
      void fetchGenerations();
    }, 5000);

    return () => window.clearInterval(timer);
  }, [fetchGenerations, user]);

  return {
    generations,
    loading,
    refetch: fetchGenerations,
  };
}
