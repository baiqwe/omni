import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createServiceRoleClient } from "@/utils/supabase/service-role";
import { getProjectId } from "@/utils/supabase/project";
import { consumeRateLimit } from "@/utils/rate-limit";
import { estimateGenerationCredits, normalizeVideoGenerationRequest } from "@/utils/video-generation";

export const runtime = "nodejs";

const ACTIVE_GENERATION_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const serviceSupabase = createServiceRoleClient();

  let generationId: string | null = null;
  let projectId: string | null = null;
  let userId: string | null = null;
  let estimatedCredits = 0;

  try {
    projectId = await getProjectId(serviceSupabase);
    const payload = normalizeVideoGenerationRequest(await request.json());

    if (!payload.prompt) {
      return NextResponse.json({ error: "Prompt is required.", code: "MISSING_PROMPT" }, { status: 400 });
    }

    if (payload.images.length === 0 && payload.videos.length === 0 && payload.mode !== "text_to_video") {
      return NextResponse.json(
        { error: "At least one image or video reference is required.", code: "MISSING_REFERENCES" },
        { status: 400 }
      );
    }

    if (payload.images.length > 9 || payload.videos.length > 3 || payload.audios.length > 3) {
      return NextResponse.json(
        { error: "The request exceeds the allowed asset limits.", code: "ASSET_LIMIT_EXCEEDED" },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Please sign in to generate.", code: "UNAUTHORIZED" }, { status: 401 });
    }

    userId = user.id;

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
    const rateLimit = consumeRateLimit({
      scope: "ai-generate",
      key: `${projectId}:${user.id}:${ip}`,
      limit: 10,
      windowMs: 5 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many generation attempts. Please wait a few minutes and try again.",
          code: "RATE_LIMITED",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.max(Math.ceil((rateLimit.resetAt - Date.now()) / 1000), 1).toString(),
          },
        }
      );
    }

    const { data: existingPendingGeneration, error: existingPendingError } = await serviceSupabase
      .from("generations")
      .select("id, created_at")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingPendingError) {
      return NextResponse.json({ error: "System busy, please try again", code: "SYSTEM_ERROR" }, { status: 500 });
    }

    if (existingPendingGeneration) {
      const pendingAge = Date.now() - new Date(existingPendingGeneration.created_at).getTime();
      if (pendingAge < ACTIVE_GENERATION_WINDOW_MS) {
        return NextResponse.json(
          {
            error: "A generation is already in progress. Please wait for it to finish.",
            code: "GENERATION_IN_PROGRESS",
          },
          { status: 429 }
        );
      }
    }

    estimatedCredits = estimateGenerationCredits(payload);

    const { data: deductSuccess, error: rpcError } = await supabase.rpc("decrease_credits", {
      p_user_id: user.id,
      p_amount: estimatedCredits,
      p_description: `Seedance generation (${payload.mode}, ${payload.resolution}, ${payload.durationSeconds}s)`,
    });

    if (rpcError) {
      return NextResponse.json({ error: "System busy, please try again", code: "SYSTEM_ERROR" }, { status: 500 });
    }

    if (!deductSuccess) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          code: "INSUFFICIENT_CREDITS",
          required: estimatedCredits,
        },
        { status: 402 }
      );
    }

    const { data: generationRow, error: generationInsertError } = await serviceSupabase
      .from("generations")
      .insert({
        project_id: projectId,
        user_id: user.id,
        prompt: payload.prompt,
        model_id: "seedance2-workspace-shell",
        status: "pending",
        credits_cost: estimatedCredits,
        generation_type: payload.mode,
        input_images: payload.images,
        input_videos: payload.videos,
        input_audios: payload.audios,
        resolution: payload.resolution,
        duration_seconds: payload.durationSeconds,
        aspect_ratio: payload.aspectRatio,
        provider_job_id: `stub_${crypto.randomUUID()}`,
        status_detail: "queued_for_provider",
        metadata: {
          containsRealPeople: payload.containsRealPeople,
          returnLastFrame: payload.returnLastFrame,
          workspacePreset: payload.workspacePreset,
          providerStatus: "not_connected_yet",
          orchestration: "seedance_async_shell",
          assetCounts: {
            images: payload.images.length,
            videos: payload.videos.length,
            audios: payload.audios.length,
          },
        },
      })
      .select("id, created_at, provider_job_id")
      .single();

    if (generationInsertError || !generationRow?.id) {
      await supabase.rpc("decrease_credits", {
        p_user_id: user.id,
        p_amount: -estimatedCredits,
        p_description: "Refund: generation bootstrap failed",
      });

      return NextResponse.json({ error: "Could not initialize generation", code: "GENERATION_LOG_FAILED" }, { status: 500 });
    }

    generationId = generationRow.id;

    return NextResponse.json(
      {
        id: generationRow.id,
        status: "pending",
        statusDetail: "queued_for_provider",
        providerJobId: generationRow.provider_job_id,
        estimatedCredits,
        message: "Generation job created. Provider execution will be connected in the next implementation phase.",
      },
      { status: 202 }
    );
  } catch (error: any) {
    if (generationId && projectId) {
      await serviceSupabase
        .from("generations")
        .update({
          status: "failed",
          status_detail: "bootstrap_failed",
          metadata: {
            failureMessage: error?.message || "Unknown error",
            failureCode: error?.code || "UNKNOWN_ERROR",
          },
        })
        .eq("id", generationId)
        .eq("project_id", projectId);
    }

    if (userId && estimatedCredits > 0 && !generationId) {
      await supabase.rpc("decrease_credits", {
        p_user_id: userId,
        p_amount: -estimatedCredits,
        p_description: "Refund: generation setup error",
      });
    }

    return NextResponse.json(
      {
        error: error?.message || "Server error",
        code: error?.code || "UNKNOWN_ERROR",
      },
      { status: 500 }
    );
  }
}
