export type VideoGenerationMode =
  | "multi_modal_video"
  | "image_to_video"
  | "text_to_video"
  | "video_extension";

export type VideoAsset = {
  id: string;
  kind: "image" | "video" | "audio";
  url: string;
};

export type VideoGenerationRequest = {
  mode: VideoGenerationMode;
  prompt: string;
  resolution: "480p" | "720p" | "1080p";
  durationSeconds: 5 | 10 | 15;
  aspectRatio: "16:9" | "9:16" | "1:1" | "4:3" | "3:4" | "21:9" | "auto";
  images: VideoAsset[];
  videos: VideoAsset[];
  audios: VideoAsset[];
  containsRealPeople?: boolean;
  returnLastFrame?: boolean;
  workspacePreset?: string | null;
};

const RESOLUTION_COST_PER_SECOND: Record<VideoGenerationRequest["resolution"], number> = {
  "480p": 4,
  "720p": 8,
  "1080p": 16,
};

const MODE_MULTIPLIER: Record<VideoGenerationMode, number> = {
  multi_modal_video: 1.25,
  image_to_video: 1,
  text_to_video: 0.85,
  video_extension: 1.35,
};

export function estimateGenerationCredits(input: Pick<VideoGenerationRequest, "mode" | "resolution" | "durationSeconds" | "audios">) {
  const base = RESOLUTION_COST_PER_SECOND[input.resolution] * input.durationSeconds;
  const modeAdjusted = Math.ceil(base * MODE_MULTIPLIER[input.mode]);
  const audioSurcharge = input.audios.length > 0 ? 6 : 0;
  return modeAdjusted + audioSurcharge;
}

export function normalizeVideoGenerationRequest(payload: any): VideoGenerationRequest {
  const mode = (payload?.mode || "multi_modal_video") as VideoGenerationMode;
  const resolution = (payload?.resolution || "1080p") as VideoGenerationRequest["resolution"];
  const durationSeconds = Number(payload?.durationSeconds || 5) as VideoGenerationRequest["durationSeconds"];
  const aspectRatio = (payload?.aspectRatio || "16:9") as VideoGenerationRequest["aspectRatio"];
  const prompt = typeof payload?.prompt === "string" ? payload.prompt.trim() : "";

  const normalizeAssets = (assets: any[], kind: VideoAsset["kind"]) =>
    Array.isArray(assets)
      ? assets
          .filter((asset) => asset && typeof asset.url === "string" && asset.url.trim())
          .map((asset, index) => ({
            id: typeof asset.id === "string" && asset.id.trim() ? asset.id : `${kind}-${index + 1}`,
            kind,
            url: asset.url.trim(),
          }))
      : [];

  return {
    mode,
    prompt,
    resolution,
    durationSeconds,
    aspectRatio,
    images: normalizeAssets(payload?.images, "image"),
    videos: normalizeAssets(payload?.videos, "video"),
    audios: normalizeAssets(payload?.audios, "audio"),
    containsRealPeople: payload?.containsRealPeople === true,
    returnLastFrame: payload?.returnLastFrame !== false,
    workspacePreset: typeof payload?.workspacePreset === "string" ? payload.workspacePreset : null,
  };
}
