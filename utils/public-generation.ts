import { createServiceRoleClient } from "@/utils/supabase/service-role";
import { getProjectId } from "@/utils/supabase/project";
import { toDeliveredVideoUrl } from "@/utils/video-delivery";
import { isCloudflareDataBackend } from "@/utils/backend/runtime";
import { getD1, safeJsonParse } from "@/utils/d1/db";

export type PublicGeneration = {
  id: string;
  prompt: string;
  status: string;
  status_detail: string | null;
  created_at: string;
  credits_cost: number;
  resolution: string | null;
  duration_seconds: number | null;
  aspect_ratio: string | null;
  generation_type: string | null;
  output_video_url: string;
  thumbnail_url: string | null;
  image_url: string | null;
  metadata: Record<string, any> | null;
  input_images: Array<{ id?: string; url?: string }> | null;
  input_videos: Array<{ id?: string; url?: string }> | null;
  input_audios: Array<{ id?: string; url?: string }> | null;
};

function pickThumbnail(generation: {
  metadata?: Record<string, any> | null;
  image_url?: string | null;
  input_images?: Array<{ url?: string }> | null;
}) {
  const metadata = generation.metadata || {};
  const candidates = [
    metadata.thumbnailUrl,
    metadata.thumbnail_url,
    metadata.posterUrl,
    metadata.poster_url,
    generation.image_url,
    generation.input_images?.[0]?.url,
  ];

  return candidates.find((candidate) => typeof candidate === "string" && candidate.trim()) || null;
}

export async function getPublicGenerationById(id: string): Promise<PublicGeneration | null> {
  if (isCloudflareDataBackend()) {
    const data = await getD1()
      .prepare(
        "SELECT id, prompt, status, status_detail, created_at, credits_cost, resolution, duration_seconds, aspect_ratio, generation_type, output_video_url, thumbnail_url, metadata_json FROM generations WHERE id = ? LIMIT 1"
      )
      .bind(id)
      .first<{
        id: string;
        prompt: string;
        status: string;
        status_detail: string | null;
        created_at: string;
        credits_cost: number;
        resolution: string | null;
        duration_seconds: number | null;
        aspect_ratio: string | null;
        generation_type: string | null;
        output_video_url: string | null;
        thumbnail_url: string | null;
        metadata_json: string | null;
      } | null>();

    if (!data?.output_video_url || !["succeeded", "completed"].includes(data.status)) {
      return null;
    }

    const metadata = safeJsonParse<Record<string, any>>(data.metadata_json, {});
    if (metadata.sharePublic === false) {
      return null;
    }

    const assetRows = await getD1()
      .prepare("SELECT asset_kind, public_url FROM generation_assets WHERE generation_id = ? ORDER BY sort_order ASC")
      .bind(id)
      .all<{ asset_kind: "image" | "video" | "audio"; public_url: string | null }>();

    const inputImages = (assetRows.results ?? []).filter((row) => row.asset_kind === "image").map((row) => ({ url: row.public_url || undefined }));
    const inputVideos = (assetRows.results ?? []).filter((row) => row.asset_kind === "video").map((row) => ({ url: row.public_url || undefined }));
    const inputAudios = (assetRows.results ?? []).filter((row) => row.asset_kind === "audio").map((row) => ({ url: row.public_url || undefined }));

    return {
      ...data,
      output_video_url: toDeliveredVideoUrl(data.output_video_url) || data.output_video_url,
      image_url: null,
      thumbnail_url: data.thumbnail_url || pickThumbnail({
        metadata,
        image_url: null,
        input_images: inputImages,
      }),
      metadata,
      input_images: inputImages,
      input_videos: inputVideos,
      input_audios: inputAudios,
    };
  }

  const supabase = createServiceRoleClient();
  const projectId = await getProjectId(supabase);

  const { data, error } = await supabase
    .from("generations")
    .select(
      "id, prompt, status, status_detail, created_at, credits_cost, resolution, duration_seconds, aspect_ratio, generation_type, output_video_url, image_url, metadata, input_images, input_videos, input_audios"
    )
    .eq("project_id", projectId)
    .eq("id", id)
    .single();

  if (error || !data?.output_video_url) {
    return null;
  }

  if (!["succeeded", "completed"].includes(data.status)) {
    return null;
  }

  const metadata = (data.metadata || {}) as Record<string, any>;
  if (metadata.sharePublic === false) {
    return null;
  }

  return {
    ...data,
    output_video_url: toDeliveredVideoUrl(data.output_video_url) || data.output_video_url,
    thumbnail_url: pickThumbnail(data),
  };
}
