"use client";

import { Loader2, RefreshCw, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProcessingGenerations } from "@/hooks/use-processing-generations";

export function ProcessingGenerationsCard({ locale = "en" }: { locale?: string }) {
  const { generations, loading, refetch } = useProcessingGenerations();
  const isZh = locale === "zh";

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Video className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {isZh ? "进行中的视频任务" : "Active Video Jobs"}
              </p>
              <h3 className="mt-1 text-xl font-bold">{generations.length}</h3>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {isZh
              ? "刷新页面后也会重新拉取处理中任务，不会丢失队列状态。"
              : "Processing jobs are reloaded after refresh so queue state stays visible."}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {isZh ? "刷新" : "Refresh"}
        </Button>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {isZh ? "正在同步任务…" : "Syncing jobs..."}
          </div>
        ) : generations.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            {isZh ? "当前没有处理中任务。" : "No active jobs right now."}
          </div>
        ) : (
          generations.map((generation) => (
            <div key={generation.id} className="rounded-lg border bg-background/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="truncate text-sm font-medium">
                  {generation.prompt || (isZh ? "未命名任务" : "Untitled job")}
                </div>
                <div className="shrink-0 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
                  {generation.status_detail || generation.status}
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {generation.resolution || "1080p"} · {generation.duration_seconds || 5}s · {generation.aspect_ratio || "16:9"} · {generation.credits_cost} credits
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
