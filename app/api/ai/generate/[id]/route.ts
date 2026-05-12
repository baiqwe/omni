import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createServiceRoleClient } from "@/utils/supabase/service-role";
import { getProjectId } from "@/utils/supabase/project";
import { fetchKieTaskRecord, mapKieStateToGenerationState } from "@/utils/kie";
import { isCloudflareDataBackend } from "@/utils/backend/runtime";
import { requireSessionUser } from "@/utils/backend/auth";
import { getGenerationViewByIdForUser, updateGenerationProviderState } from "@/utils/d1/generations";

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

  if (isCloudflareDataBackend()) {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let generation = await getGenerationViewByIdForUser(generationId, user.id);
    if (!generation) {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 });
    }

    const provider = (generation.metadata as Record<string, unknown> | null)?.provider;
    if (
      provider === "kie" &&
      generation.provider_job_id &&
      (generation.status === "pending" || generation.status === "processing")
    ) {
      try {
        const taskRecord = await fetchKieTaskRecord(generation.provider_job_id);
        const mappedState = mapKieStateToGenerationState(taskRecord.state);
        const updated = await updateGenerationProviderState({
          id: generation.id,
          providerJobId: generation.provider_job_id,
          status: mappedState.status,
          statusDetail: mappedState.statusDetail,
          outputVideoUrl: taskRecord.resultUrls[0] ?? generation.output_video_url,
          metadata: {
            provider: "kie",
            providerStatus: taskRecord.state,
            kie: taskRecord.raw,
          },
        });

        if (updated) {
          generation = {
            ...generation,
            ...updated,
            metadata: {
              ...((generation.metadata as Record<string, unknown> | null) ?? {}),
              provider: "kie",
              providerStatus: taskRecord.state,
              kie: taskRecord.raw,
            },
            output_video_url: taskRecord.resultUrls[0] ?? generation.output_video_url,
          };
        }
      } catch {
        // Keep existing state when provider polling fails temporarily.
      }
    }

    return NextResponse.json({
      generation: {
        ...generation,
        displayStatus: deriveDisplayStatus(generation.status, generation.created_at),
      },
    });
  }

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

  let { data: generation, error } = await serviceSupabase
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

  const provider = (generation.metadata as Record<string, unknown> | null)?.provider;
  if (
    provider === "kie" &&
    generation.provider_job_id &&
    (generation.status === "pending" || generation.status === "processing")
  ) {
    try {
      const taskRecord = await fetchKieTaskRecord(generation.provider_job_id);
      const mappedState = mapKieStateToGenerationState(taskRecord.state);
      const mergedMetadata = {
        ...((generation.metadata as Record<string, unknown> | null) ?? {}),
        provider: "kie",
        providerStatus: taskRecord.state,
        kie: taskRecord.raw,
      };

      const updatePayload: Record<string, unknown> = {
        status: mappedState.status,
        status_detail: mappedState.statusDetail,
        metadata: mergedMetadata,
      };

      if (taskRecord.resultUrls[0]) {
        updatePayload.output_video_url = taskRecord.resultUrls[0];
      }

      await serviceSupabase
        .from("generations")
        .update(updatePayload)
        .eq("id", generation.id)
        .eq("project_id", projectId);

      generation = {
        ...generation,
        ...updatePayload,
        output_video_url: (updatePayload.output_video_url as string | undefined) ?? generation.output_video_url,
      };
    } catch {
      // Keep the last known database state if provider polling fails temporarily.
    }
  }

  return NextResponse.json({
    generation: {
      ...generation,
      displayStatus: deriveDisplayStatus(generation.status, generation.created_at),
    },
  });
}
