import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/utils/supabase/service-role";
import { mapKieStateToGenerationState, parseKieTaskRecord } from "@/utils/kie";
import { isCloudflareDataBackend } from "@/utils/backend/runtime";
import { getD1 } from "@/utils/d1/db";
import { updateGenerationProviderState } from "@/utils/d1/generations";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const callbackSecret = process.env.KIE_CALLBACK_SECRET?.trim();
  const token = new URL(request.url).searchParams.get("token");

  if (callbackSecret && token !== callbackSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { data?: Record<string, unknown> } | null;
  const rawRecord = body?.data;

  if (!rawRecord) {
    return NextResponse.json({ error: "Missing callback data" }, { status: 400 });
  }

  const taskRecord = parseKieTaskRecord(rawRecord);
  if (!taskRecord.taskId) {
    return NextResponse.json({ error: "Missing task id" }, { status: 400 });
  }

  if (isCloudflareDataBackend()) {
    const generation = await getD1()
      .prepare("SELECT id FROM generations WHERE provider_job_id = ? LIMIT 1")
      .bind(taskRecord.taskId)
      .first<{ id: string } | null>();

    if (!generation?.id) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const mappedState = mapKieStateToGenerationState(taskRecord.state);
    await updateGenerationProviderState({
      id: generation.id,
      providerJobId: taskRecord.taskId,
      status: mappedState.status,
      statusDetail: mappedState.statusDetail,
      outputVideoUrl: taskRecord.resultUrls[0] ?? null,
      metadata: {
        provider: "kie",
        providerStatus: taskRecord.state,
        kie: taskRecord.raw,
      },
    });

    return NextResponse.json({ ok: true });
  }

  const serviceSupabase = createServiceRoleClient();
  const { data: generation } = await serviceSupabase
    .from("generations")
    .select("id, project_id, metadata, output_video_url")
    .eq("provider_job_id", taskRecord.taskId)
    .maybeSingle();

  if (!generation) {
    return NextResponse.json({ ok: true, skipped: true });
  }

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
    .eq("project_id", generation.project_id);

  return NextResponse.json({ ok: true });
}
