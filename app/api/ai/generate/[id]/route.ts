import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createServiceRoleClient } from "@/utils/supabase/service-role";
import { getProjectId } from "@/utils/supabase/project";

export const runtime = "nodejs";

function deriveDisplayStatus(status: string, createdAt: string) {
  if (status !== "pending") {
    return status;
  }

  const ageMs = Date.now() - new Date(createdAt).getTime();
  if (ageMs < 20_000) return "queued";
  if (ageMs < 90_000) return "processing";
  return "awaiting_provider";
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const generationId = params.id;
  const supabase = await createClient();
  const serviceSupabase = createServiceRoleClient();
  const projectId = await getProjectId(serviceSupabase);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: generation, error } = await serviceSupabase
    .from("generations")
    .select(
      "id, status, status_detail, created_at, prompt, credits_cost, resolution, duration_seconds, aspect_ratio, generation_type, provider_job_id, input_images, input_videos, input_audios, output_video_url, image_url, metadata"
    )
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .eq("id", generationId)
    .single();

  if (error || !generation) {
    return NextResponse.json({ error: "Generation not found" }, { status: 404 });
  }

  return NextResponse.json({
    generation: {
      ...generation,
      displayStatus: deriveDisplayStatus(generation.status, generation.created_at),
    },
  });
}
