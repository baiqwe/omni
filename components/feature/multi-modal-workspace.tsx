"use client";

import type { ComponentType, ReactNode } from "react";
import { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import type { Accept } from "react-dropzone";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  AudioLines,
  Check,
  CheckCircle2,
  Clapperboard,
  Film,
  ImagePlus,
  Mic2,
  MonitorPlay,
  PlayCircle,
  Sparkles,
  Trash2,
  UploadCloud,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import {
  useMultiModalWorkspace,
  type WorkspaceAsset,
  type WorkspaceAssetKind,
} from "@/hooks/use-multi-modal-workspace";
import type { VideoGenerationMode } from "@/utils/video-generation";

type WorkspaceCopy = {
  tabs: Array<{ label: string; mode: VideoGenerationMode }>;
  subtitle: string;
  uploadTitle: string;
  uploadHint: string;
  uploadMeta: string;
  modelLabel: string;
  modelName: string;
  modelDescription: string;
  modelBadges: string[];
  containsRealPeople: string;
  containsRealPeopleHint: string;
  returnLastFrame: string;
  returnLastFrameHint: string;
  promptLabel: string;
  promptPlaceholder: string;
  promptCounter: string;
  resolution: string;
  duration: string;
  aspectRatio: string;
  advanced: string;
  generate: string;
  queueTitle: string;
  queueEta: string;
  queueHint: string;
  queueBullets: string[];
  previewTitle: string;
  previewSubtitle: string;
  stats: Array<{ label: string; value: string }>;
  quickPresetsTitle: string;
  presets: Array<{ name: string; prompt: string; mode: VideoGenerationMode }>;
  laneTitle: Record<WorkspaceAssetKind, string>;
  laneHint: Record<WorkspaceAssetKind, string>;
  laneAction: Record<WorkspaceAssetKind, string>;
  laneEmptyMeta: Record<WorkspaceAssetKind, string>;
  estimatedCredits: string;
  noAssets: string;
};

type Props = {
  locale: string;
};

const COPY: Record<string, WorkspaceCopy> = {
  zh: {
    tabs: [
      { label: "多参考视频生成", mode: "multi_modal_video" },
      { label: "图像转视频", mode: "image_to_video" },
      { label: "文本转视频", mode: "text_to_video" },
    ],
    subtitle:
      "把图片、视频、音频和文本放进同一个创作台，让输入关系更清楚、输出更可控，也让界面真正服务于镜头结果。",
    uploadTitle: "拖入你的多模态素材",
    uploadHint: "把图像、动作参考和音频线索拆开管理，角色、镜头和节奏就能更清楚地分别控制。",
    uploadMeta: "Images 9 · Videos 3 · Audios 3",
    modelLabel: "AI 模型",
    modelName: "Seedance 2.0 Multi-Reference",
    modelDescription: "优先理解图像、视频、音频与文字之间的关系，适合做角色一致性、动作继承和镜头延展。",
    modelBadges: ["参考优先", "动作理解", "镜头延展"],
    containsRealPeople: "包含真人素材",
    containsRealPeopleHint: "启用后，会优先把人物身份、皮肤细节和镜头安全边界处理得更稳。",
    returnLastFrame: "添加尾帧目标",
    returnLastFrameHint: "给模型一个明确的终点画面，适合做延展、收束动作和更稳定的转场。",
    promptLabel: "Prompt",
    promptPlaceholder:
      "例如：以 image-01 作为首帧角色，沿用 video-02 的推轨与镜头节奏，5 秒内从中景推进到近景，保留冷色夜景霓虹和电子鼓点推进感。",
    promptCounter: "5000 字符以内的自然语言控制",
    resolution: "分辨率",
    duration: "时长",
    aspectRatio: "画幅",
    advanced: "高级选项",
    generate: "生成视频",
    queueTitle: "渲染队列",
    queueEta: "工作台状态已就绪",
    queueHint: "这个区域现在先模拟创作工作流里的素材队列和任务状态，后面接真实后端时会平滑过渡到异步生成与失败恢复。",
    queueBullets: [
      "最多 9 张参考图片，用来锁定角色、场景和关键帧。",
      "最多 3 段参考视频，总时长 15 秒，用来定义动作、运镜和镜头节奏。",
      "最多 3 段参考音频，总时长 15 秒，用来提示节拍、氛围和声音情绪。",
      "至少提供图片或视频其中一种，纯音频不会单独触发生成。",
    ],
    previewTitle: "预览样片",
    previewSubtitle: "让结果成为视觉中心，让界面退后一步。",
    stats: [
      { label: "输入模态", value: "图 / 视 / 音 / 文" },
      { label: "控制维度", value: "参考 + Prompt + 队列" },
      { label: "适配流程", value: "生成 / 延展 / 编辑" },
    ],
    quickPresetsTitle: "一键代入工作流模板",
    presets: [
      {
        name: "舞蹈动作克隆",
        prompt: "用参考舞蹈视频的动作节奏，保持角色服装一致，生成 9:16 竖版短视频。",
        mode: "multi_modal_video",
      },
      {
        name: "广告产品镜头",
        prompt: "让产品图在黑色镜面桌面上完成 cinematic reveal，镜头缓慢推进并带有微弱高光扫过。",
        mode: "multi_modal_video",
      },
      {
        name: "电影预演",
        prompt: "参考第二段视频的推轨和转场节奏，把静帧角色扩展成连续镜头，保持场景连贯。",
        mode: "image_to_video",
      },
    ],
    laneTitle: {
      image: "图像参考",
      video: "视频参考",
      audio: "音频参考",
    },
    laneHint: {
      image: "角色设定、首帧、场景、尾帧",
      video: "动作、运镜、节奏、连续性",
      audio: "节拍、氛围、情绪提示",
    },
    laneAction: {
      image: "上传图片",
      video: "上传视频",
      audio: "上传音频",
    },
    laneEmptyMeta: {
      image: "最多 9 张",
      video: "最多 3 段 / 合计 15 秒",
      audio: "最多 3 段 / 合计 15 秒",
    },
    estimatedCredits: "预计扣费",
    noAssets: "当前还没有素材进入这一队列",
  },
  en: {
    tabs: [
      { label: "Multi-Reference Video", mode: "multi_modal_video" },
      { label: "Image to Video", mode: "image_to_video" },
      { label: "Text to Video", mode: "text_to_video" },
    ],
    subtitle:
      "Bring images, clips, audio, and text into one production-grade surface so identity, motion, and timing can be controlled more intentionally.",
    uploadTitle: "Drop your multi-modal assets",
    uploadHint:
      "Separate stills, motion clips, and audio cues so identity, camera behavior, and timing can be directed more clearly.",
    uploadMeta: "Images 9 · Videos 3 · Audios 3",
    modelLabel: "AI Model",
    modelName: "Seedance 2.0 Multi-Reference",
    modelDescription: "Built to interpret images, clips, audio, and text together, with stronger control over identity, motion transfer, and shot extension.",
    modelBadges: ["Reference-first", "Motion-aware", "Extendable"],
    containsRealPeople: "Contains real people",
    containsRealPeopleHint: "Use this when human identity, skin detail, and safer portrait behavior need extra stability.",
    returnLastFrame: "Add target last frame",
    returnLastFrameHint: "Give the model a visual destination for endings, transitions, and more stable clip extension.",
    promptLabel: "Prompt",
    promptPlaceholder:
      "Example: use image-01 as the opening character frame, borrow the push-in and pacing from video-02, move from medium shot to close-up in 5 seconds, and keep the cold neon night tone with an electronic beat ramp.",
    promptCounter: "Natural-language control, up to 5000 characters",
    resolution: "Resolution",
    duration: "Duration",
    aspectRatio: "Aspect Ratio",
    advanced: "Advanced",
    generate: "Generate",
    queueTitle: "Render Queue",
    queueEta: "Workspace state is live",
    queueHint: "This panel currently mirrors the front-end queue and task state. Once backend orchestration lands, it can transition naturally into async jobs, polling, and recovery.",
    queueBullets: [
      "Up to 9 reference images for identity, scene layout, and keyframe control.",
      "Up to 3 reference videos, 15 seconds total, for motion, camera movement, and pacing.",
      "Up to 3 reference audio clips, 15 seconds total, for beat, atmosphere, and timing cues.",
      "At least one image or video is required. Audio alone is not enough to start a generation.",
    ],
    previewTitle: "Output Preview",
    previewSubtitle: "Let the output become the focus and the interface recede.",
    stats: [
      { label: "Input Modes", value: "Image / Video / Audio / Text" },
      { label: "Control Layers", value: "References + Prompt + Queue" },
      { label: "Workflow", value: "Generate / Extend / Edit" },
    ],
    quickPresetsTitle: "Load workflow presets",
    presets: [
      {
        name: "Dance Motion Clone",
        prompt: "Transfer the choreography timing from the reference dance clip while keeping the character wardrobe consistent in a 9:16 short.",
        mode: "multi_modal_video",
      },
      {
        name: "Commercial Product Shot",
        prompt: "Reveal the product on a black reflective table with a slow cinematic push-in and a subtle specular sweep.",
        mode: "multi_modal_video",
      },
      {
        name: "Previs Storyboard",
        prompt: "Reuse the dolly move and transition rhythm from clip two, then extend the still character frame into a continuous shot.",
        mode: "image_to_video",
      },
    ],
    laneTitle: {
      image: "Image References",
      video: "Video References",
      audio: "Audio References",
    },
    laneHint: {
      image: "identity, opening frame, scene, end frame",
      video: "motion, camera, pacing, continuity",
      audio: "beat, atmosphere, cue timing",
    },
    laneAction: {
      image: "Upload images",
      video: "Upload videos",
      audio: "Upload audio",
    },
    laneEmptyMeta: {
      image: "Up to 9 files",
      video: "Up to 3 clips / 15s total",
      audio: "Up to 3 clips / 15s total",
    },
    estimatedCredits: "Estimated Cost",
    noAssets: "No assets in this queue yet",
  },
};

const RESOLUTIONS = ["480p", "720p", "1080p"] as const;
const DURATIONS = [5, 10, 15] as const;
const RATIOS = ["auto", "16:9", "9:16", "1:1", "4:3", "3:4", "21:9"] as const;

const MODEL_META: Record<string, Record<VideoGenerationMode, { name: string; description: string; badges: string[] }>> = {
  zh: {
    multi_modal_video: {
      name: "Seedance 2.0 Multi-Reference",
      description: "优先理解图像、视频、音频与文字之间的关系，适合做角色一致性、动作继承和镜头延展。",
      badges: ["参考优先", "动作理解", "镜头延展"],
    },
    image_to_video: {
      name: "Seedance 2.0 Image to Video",
      description: "更适合从首帧、产品图和角色设定图出发，把静态画面延展成连续镜头。",
      badges: ["首帧驱动", "角色一致性", "镜头生长"],
    },
    text_to_video: {
      name: "Seedance 2.0 Text to Video",
      description: "适合先用自然语言搭建场景、镜头和节奏，再逐步补足参考素材。",
      badges: ["语义优先", "概念验证", "镜头构思"],
    },
    video_extension: {
      name: "Seedance 2.0 Video Extension",
      description: "适合延展已有镜头，保持动作、光线和空间关系，让镜头自然续上。",
      badges: ["连续性", "接续镜头", "叙事延展"],
    },
  },
  en: {
    multi_modal_video: {
      name: "Seedance 2.0 Multi-Reference",
      description: "Built to interpret images, clips, audio, and text together, with stronger control over identity, motion transfer, and shot extension.",
      badges: ["Reference-first", "Motion-aware", "Extendable"],
    },
    image_to_video: {
      name: "Seedance 2.0 Image to Video",
      description: "Best when a still, a product frame, or a hero character image needs to evolve into a continuous shot.",
      badges: ["Frame-led", "Identity-safe", "Cinematic motion"],
    },
    text_to_video: {
      name: "Seedance 2.0 Text to Video",
      description: "Ideal for semantic direction first, then deeper control through references, pacing, and aspect ratio.",
      badges: ["Prompt-first", "Concept testing", "Shot language"],
    },
    video_extension: {
      name: "Seedance 2.0 Video Extension",
      description: "Extend an existing shot while preserving movement, lighting, and scene continuity.",
      badges: ["Continuity", "Shot extension", "Scene-safe"],
    },
  },
};

const PREVIEW_REELS: Record<VideoGenerationMode, { src: string; label: string; headlineZh: string; headlineEn: string; bodyZh: string; bodyEn: string }> = {
  multi_modal_video: {
    src: "/videos/gallery/reference-led.mp4",
    label: "Reference-led sample",
    headlineZh: "多参考输入，不再只是一次猜测。",
    headlineEn: "Multi-reference input, not a blind guess.",
    bodyZh: "把图片、视频和音频放进同一条指令里，结果会更接近一个有意图的镜头，而不是随机可用的片段。",
    bodyEn: "Bring stills, clips, and audio into one directive so the output feels intentional instead of merely acceptable.",
  },
  image_to_video: {
    src: "/videos/gallery/image-to-video.mp4",
    label: "Image seed sample",
    headlineZh: "从静帧出发，把画面推成镜头。",
    headlineEn: "Start from a still and push it into a shot.",
    bodyZh: "更适合角色起始画面、产品图和概念海报，把视觉种子延展成连续运动。",
    bodyEn: "Ideal for character stills, product imagery, and concept art that need to become continuous motion.",
  },
  text_to_video: {
    src: "/videos/gallery/storyboard-previs.mp4",
    label: "Storyboard sample",
    headlineZh: "先建立语义，再补足镜头语言。",
    headlineEn: "Establish the scene semantically, then build the shot language.",
    bodyZh: "适合先用自然语言快速构思镜头，再用参数与参考素材逐步加深控制。",
    bodyEn: "Useful when the first move is semantic direction, then references and settings refine the result.",
  },
  video_extension: {
    src: "/videos/gallery/video-extension.mp4",
    label: "Extension sample",
    headlineZh: "沿着已有镜头，把叙事继续下去。",
    headlineEn: "Continue the shot without breaking the scene logic.",
    bodyZh: "更适合扩写现有片段、延续角色动作和保留空间关系，让生成结果更像真正的接续镜头。",
    bodyEn: "Ideal for continuing an existing clip while preserving movement, identity, and spatial continuity.",
  },
};

export function MultiModalWorkspace({ locale }: Props) {
  const copy = COPY[locale] ?? COPY.en;
  const modelMeta = MODEL_META[locale] ?? MODEL_META.en;
  const {
    mode,
    prompt,
    resolution,
    durationSeconds,
    aspectRatio,
    containsRealPeople,
    returnLastFrame,
    assets,
    notice,
    estimatedCredits,
    isSubmitting,
    activeGenerationId,
    activeGenerationStatus,
    actions,
  } = useMultiModalWorkspace();
  const { toast } = useToast();
  const { user } = useUser();

  const promptLength = useMemo(() => prompt.length, [prompt]);
  const activePreview = PREVIEW_REELS[mode];
  const activeModel = modelMeta[mode];

  async function handleGenerate() {
    if (!user) {
      toast({
        title: locale === "zh" ? "请先登录" : "Sign in required",
        description:
          locale === "zh"
            ? "登录后才能创建视频任务并记录积分消耗。"
            : "Sign in before creating a generation job and tracking credits.",
      });
      return;
    }

    const result = await actions.submitGeneration();
    if (result.ok) {
      toast({
        title: locale === "zh" ? "任务已进入队列" : "Generation queued",
        description:
          locale === "zh"
            ? "工作台已经创建异步任务，可以继续编辑素材或前往 Dashboard 查看状态。"
            : "The workspace created an async job. You can keep editing or track it in the dashboard.",
      });
      return;
    }

    toast({
      title: locale === "zh" ? "生成未启动" : "Generation not started",
      description:
        result.error === "missing_prompt"
          ? locale === "zh"
            ? "先补充 Prompt 再发起生成。"
            : "Add a prompt before starting generation."
          : result.error === "missing_references"
            ? locale === "zh"
              ? "至少准备一个图像或视频参考。"
              : "Prepare at least one image or video reference."
            : result.error === "uploads_in_progress"
              ? locale === "zh"
                ? "还有素材在上传中，等上传完成后再生成。"
                : "Some assets are still uploading. Wait for them to finish first."
              : locale === "zh"
                ? "创建任务时出错，请稍后再试。"
                : "Something went wrong while creating the generation.",
      variant: "destructive",
    });
  }

  return (
    <div id="workspace" className="mx-auto max-w-6xl rounded-[24px] border border-white/10 bg-[#181a1f]/96 p-4 shadow-[0_28px_70px_-36px_rgba(0,0,0,0.72)] backdrop-blur-xl md:p-5">
      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="rounded-[18px] border border-white/8 bg-[#24252c] p-4"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {copy.tabs.map((tab) => (
              <button
                key={tab.mode}
                type="button"
                onClick={() => actions.setMode(tab.mode)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                  mode === tab.mode
                    ? "border-white/20 bg-white text-black"
                    : "border-white/10 bg-[#2a2b33] text-white/82 hover:border-white/16 hover:bg-white/[0.05]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 rounded-[18px] border border-white/8 bg-[#1c1f26] p-3.5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/38">{copy.modelLabel}</div>
            <div className="rounded-[14px] border border-white/10 bg-[linear-gradient(180deg,#2a2d36_0%,#242730_100%)] p-3.5">
              <div className="flex items-start gap-3">
                <span className="mt-3 h-3 w-3 shrink-0 rounded-full bg-[linear-gradient(135deg,#5ad7ff,#7d57ff)] shadow-[0_0_18px_rgba(93,103,255,0.55)]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-medium text-white">{activeModel.name}</div>
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-200">
                      {locale === "zh" ? "已启用" : "Active"}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Select value={mode} onValueChange={(value) => actions.setMode(value as VideoGenerationMode)}>
                      <SelectTrigger className="h-11 rounded-[12px] border-white/10 bg-[#171920] text-left text-sm text-white focus:ring-[#2563ff]/35 focus:ring-offset-0">
                        <SelectValue placeholder={locale === "zh" ? "选择模型模式" : "Choose a model mode"} />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-[#171920] text-white">
                        {copy.tabs.map((tab) => (
                          <SelectItem
                            key={tab.mode}
                            value={tab.mode}
                            className="rounded-[10px] py-2.5 pl-8 pr-3 text-sm text-white focus:bg-white/[0.08] focus:text-white"
                          >
                            {tab.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-3 text-xs leading-5 text-white/46">{activeModel.description}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeModel.badges.map((badge) => (
                      <span key={badge} className="rounded-full border border-white/8 bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/68">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {notice ? (
            <div className="flex items-center gap-3 rounded-[14px] border border-amber-300/15 bg-amber-300/8 px-4 py-3 text-sm text-amber-100/90">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="flex-1">{notice}</span>
              <button type="button" onClick={actions.clearNotice} className="text-white/50 hover:text-white">
                ×
              </button>
            </div>
          ) : null}

          <div className="rounded-[16px] border border-white/8 bg-[#1d1f26] p-4">
            <div className="text-sm font-medium text-white">{copy.uploadTitle}</div>
            <p className="mt-2 text-sm leading-7 text-white/56">{copy.uploadHint}</p>
          </div>

          <div className="space-y-3">
            <UploadLane
              kind="image"
              title={copy.laneTitle.image}
              hint={copy.laneHint.image}
              actionLabel={copy.laneAction.image}
              limitLabel={copy.laneEmptyMeta.image}
              assets={assets.image}
              onAddFiles={actions.addFiles}
              onMove={actions.moveAsset}
              onRemove={actions.removeAsset}
              emptyLabel={copy.noAssets}
            />
            <UploadLane kind="video" title={copy.laneTitle.video} hint={copy.laneHint.video} actionLabel={copy.laneAction.video} limitLabel={copy.laneEmptyMeta.video} assets={assets.video} onAddFiles={actions.addFiles} onMove={actions.moveAsset} onRemove={actions.removeAsset} emptyLabel={copy.noAssets} />
            <UploadLane kind="audio" title={copy.laneTitle.audio} hint={copy.laneHint.audio} actionLabel={copy.laneAction.audio} limitLabel={copy.laneEmptyMeta.audio} assets={assets.audio} onAddFiles={actions.addFiles} onMove={actions.moveAsset} onRemove={actions.removeAsset} emptyLabel={copy.noAssets} />
          </div>

          <div className="space-y-2.5">
            <TogglePill
              active={containsRealPeople}
              onClick={actions.toggleContainsRealPeople}
              label={copy.containsRealPeople}
              hint={copy.containsRealPeopleHint}
            />
            <TogglePill
              active={returnLastFrame}
              onClick={actions.toggleReturnLastFrame}
              label={copy.returnLastFrame}
              hint={copy.returnLastFrameHint}
            />
          </div>

          <div className="rounded-[16px] border border-white/8 bg-[#1d1f26] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <Label>{copy.promptLabel}</Label>
              <span className="text-[11px] text-white/36">{promptLength}/5000</span>
            </div>
            <Textarea
              value={prompt}
              onChange={(event) => actions.setPrompt(event.target.value)}
              placeholder={copy.promptPlaceholder}
              className="min-h-[110px] resize-none rounded-[12px] border-white/10 bg-[#111318] text-sm leading-7 text-white placeholder:text-white/32 focus-visible:ring-[#2563ff]/40"
            />
            <div className="mt-3 text-xs text-white/42">{copy.promptCounter}</div>
          </div>

          <div className="grid gap-3">
            <OptionGroup
              title={copy.resolution}
              options={RESOLUTIONS}
              value={resolution}
              onChange={(next) => actions.setResolution(next as typeof resolution)}
            />
            <DurationSlider
              title={copy.duration}
              value={durationSeconds}
              onChange={(next) => actions.setDurationSeconds(next as typeof durationSeconds)}
            />
            <OptionGroup
              title={copy.aspectRatio}
              options={RATIOS}
              value={aspectRatio}
              onChange={(next) => actions.setAspectRatio(next as typeof aspectRatio)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-lg border border-white/10 bg-[#1d1f26] px-4 py-2 text-sm text-white/78">
                {copy.estimatedCredits}: <span className="font-semibold text-white">{estimatedCredits} credits</span>
              </div>
              {activeGenerationId ? (
                <div className="rounded-lg border border-[#2563ff]/20 bg-[#2563ff]/10 px-4 py-2 text-sm text-white">
                  {locale === "zh" ? "任务" : "Job"} {activeGenerationStatus ?? "pending"} · {activeGenerationId.slice(0, 8)}
                </div>
              ) : null}
            </div>
            <Button
              onClick={() => void handleGenerate()}
              disabled={isSubmitting}
              className="h-12 w-full rounded-[12px] bg-[linear-gradient(90deg,#8b8b95,#6d28d9)] text-sm font-medium text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <WandSparkles className="mr-2 h-4 w-4" />
              {isSubmitting ? (locale === "zh" ? "提交中" : "Submitting") : copy.generate}
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
        className="space-y-6"
      >
        <div className="rounded-[18px] border border-white/8 bg-[#24252c] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/38">{copy.previewTitle}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{copy.previewSubtitle}</h3>
            </div>
            <PlayCircle className="h-6 w-6 text-white/66" />
          </div>

          <div className="mt-4 rounded-[16px] border border-white/8 bg-[#1d1f26] p-3">
            <div className="flex items-center justify-between px-1 pb-3 pt-1 text-[11px] uppercase tracking-[0.16em] text-white/40">
              <span>{activePreview.label}</span>
              <span>{resolution} · {durationSeconds}s · {aspectRatio}</span>
            </div>
            <div className="overflow-hidden rounded-[14px] border border-white/6 bg-black">
              <video
                key={activePreview.src}
                src={activePreview.src}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                controls
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="space-y-4 p-4 pb-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs text-white/92">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {locale === "zh" ? "样例预览已就位" : "Preview reel loaded"}
              </div>
              <div className="text-2xl font-semibold tracking-tight text-white">
                {locale === "zh" ? activePreview.headlineZh : activePreview.headlineEn}
              </div>
              <p className="text-sm leading-7 text-white/74">
                {locale === "zh" ? activePreview.bodyZh : activePreview.bodyEn}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {copy.stats.map((stat) => (
              <div key={stat.label} className="rounded-[14px] border border-white/8 bg-[#1d1f26] p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/36">{stat.label}</div>
                <div className="mt-2 text-sm font-medium text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[18px] border border-white/8 bg-[#24252c] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-white/38">{locale === "zh" ? "Multi Reference Guide" : "Multi Reference Guide"}</p>
              <h3 className="mt-2 text-base font-semibold text-white">{locale === "zh" ? "上传多个参考素材，分别控制角色、动作和节奏。" : "Use multiple references to separately control identity, motion, and timing."}</h3>
            </div>
            <MonitorPlay className="h-5 w-5 text-white/40" />
          </div>
          <div className="mt-4 rounded-[14px] border border-white/8 bg-[#1d1f26] p-4 text-sm leading-7 text-white/74">
            <p>{copy.queueHint}</p>
            <ul className="mt-3 space-y-2">
              {copy.queueBullets.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 space-y-3">
            <QueueItem title={copy.laneTitle.image} detail={`${assets.image.length} ${locale === "zh" ? "个参考素材在队列中" : "queued references"}`} progress={assets.image.length > 0 ? "done" : "idle"} />
            <QueueItem title={copy.laneTitle.video} detail={`${assets.video.length} ${locale === "zh" ? "个动作片段在队列中" : "queued motion clips"}`} progress={assets.video.length > 0 ? "active" : "idle"} />
            <QueueItem title={copy.laneTitle.audio} detail={`${assets.audio.length} ${locale === "zh" ? "个音频线索在队列中" : "queued audio cues"}`} progress={assets.audio.length > 0 ? "done" : "idle"} />
            {activeGenerationId ? (
              <QueueItem
                title={locale === "zh" ? "异步任务" : "Provider job"}
                detail={
                  locale === "zh"
                    ? `任务 ${activeGenerationId.slice(0, 8)} 当前状态为 ${activeGenerationStatus ?? "pending"}`
                    : `Async job ${activeGenerationId.slice(0, 8)} is ${activeGenerationStatus ?? "pending"}`
                }
                progress="active"
              />
            ) : null}
          </div>
        </div>

        <div className="rounded-[18px] border border-white/8 bg-[#24252c] p-4">
          <Label>{copy.quickPresetsTitle}</Label>
          <div className="mt-4 space-y-3">
            {copy.presets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => actions.loadPreset(preset.prompt, preset.mode)}
                className="w-full rounded-[14px] border border-white/6 bg-[#151518] p-4 text-left transition-colors hover:border-white/14 hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Sparkles className="h-4 w-4 text-white/70" />
                  {preset.name}
                </div>
                <p className="mt-2 text-sm leading-6 text-white/52">{preset.prompt}</p>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
}

function UploadLane({
  kind,
  title,
  hint,
  actionLabel,
  limitLabel,
  assets,
  emptyLabel,
  onAddFiles,
  onMove,
  onRemove,
}: {
  kind: WorkspaceAssetKind;
  title: string;
  hint: string;
  actionLabel: string;
  limitLabel: string;
  assets: WorkspaceAsset[];
  emptyLabel: string;
  onAddFiles: (kind: WorkspaceAssetKind, files: File[]) => void;
  onMove: (kind: WorkspaceAssetKind, id: string, direction: "up" | "down") => void;
  onRemove: (kind: WorkspaceAssetKind, id: string) => void;
}) {
  const accept: Accept =
    kind === "image"
      ? { "image/*": [] }
      : kind === "video"
        ? { "video/*": [] }
        : { "audio/*": [] };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop: (files) => onAddFiles(kind, files),
    multiple: true,
  });

  return (
    <div className="rounded-[16px] border border-white/8 bg-[#1d1f26] p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-white">{title}</div>
          <div className="mt-1 text-xs text-white/44">{hint}</div>
        </div>
        <div className="space-y-1 text-right">
          <div className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-white/42">
            {assets.length}
          </div>
          <div className="text-[11px] text-white/30">{limitLabel}</div>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "mt-3 rounded-[14px] border border-dashed px-4 py-5 text-center transition-colors",
          isDragActive ? "border-[#2563ff]/50 bg-[#2563ff]/8" : "border-white/12 bg-[#121318]"
        )}
        >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-5 w-5 text-[#76a3ff]" />
        <div className="mt-3 text-sm font-medium text-white/86">{actionLabel}</div>
        <div className="mt-1 text-xs text-white/36">{limitLabel}</div>
      </div>

      <div className="mt-4 space-y-3">
        {assets.length === 0 ? <div className="text-sm text-white/38">{emptyLabel}</div> : null}
        {assets.map((asset, index) => (
          <AssetRow
            key={asset.id}
            asset={asset}
            canMoveUp={index > 0}
            canMoveDown={index < assets.length - 1}
            onMove={(direction) => onMove(kind, asset.id, direction)}
            onRemove={() => onRemove(kind, asset.id)}
          />
        ))}
      </div>
    </div>
  );
}

function AssetRow({
  asset,
  canMoveUp,
  canMoveDown,
  onMove,
  onRemove,
}: {
  asset: WorkspaceAsset;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (direction: "up" | "down") => void;
  onRemove: () => void;
}) {
  const icon =
    asset.kind === "image" ? ImagePlus : asset.kind === "video" ? Film : Mic2;

  return (
    <div className="rounded-[12px] border border-white/8 bg-[#15171d] p-3">
      <div className="flex gap-3">
        <AssetThumb asset={asset} icon={icon} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-white">{asset.name}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/36">
            {asset.kind} · {asset.sizeLabel}
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#2563ff,#8b5cf6)] transition-all"
              style={{ width: `${asset.progress}%` }}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-white/44">
          {asset.status === "ready"
            ? "Ready for generation"
            : asset.status === "error"
              ? asset.error || "Upload failed"
              : `${asset.progress}% uploaded`}
        </div>
        <div className="flex items-center gap-1">
          <IconButton disabled={!canMoveUp} onClick={() => onMove("up")}>
            <ArrowUp className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton disabled={!canMoveDown} onClick={() => onMove("down")}>
            <ArrowDown className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton onClick={onRemove}>
            <Trash2 className="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function AssetThumb({
  asset,
  icon: Icon,
}: {
  asset: WorkspaceAsset;
  icon: ComponentType<{ className?: string }>;
}) {
  if (asset.previewUrl && asset.kind === "image") {
    return (
      <img
        src={asset.previewUrl}
        alt={asset.name}
        className="h-14 w-14 rounded-[12px] border border-white/8 object-cover"
      />
    );
  }

  if (asset.previewUrl && asset.kind === "video") {
    return (
      <video
        src={asset.previewUrl}
        muted
        playsInline
        preload="metadata"
        className="h-14 w-14 rounded-[12px] border border-white/8 object-cover"
      />
    );
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-[12px] border border-white/8 bg-white/[0.04] text-white/58">
      <Icon className="h-5 w-5" />
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/46">{children}</div>;
}

function TogglePill({
  active,
  onClick,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  label: ReactNode;
  hint: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-[14px] border px-4 py-3.5 text-sm transition-all",
        active
          ? "border-cyan-300/28 bg-[linear-gradient(180deg,rgba(93,211,255,0.12),rgba(255,255,255,0.04))] text-white"
          : "border-white/10 bg-[#1d1f26] text-white/82 hover:border-white/16"
      )}
    >
      <span className="min-w-0 pr-4 text-left">
        <span className="block text-sm font-medium text-white">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-white/50">{hint}</span>
      </span>
      <span className={cn("flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors", active ? "bg-cyan-300/30" : "bg-white/8")}>
        <span className={cn("flex h-5 w-5 items-center justify-center rounded-full transition-transform", active ? "translate-x-5 bg-white text-slate-950" : "translate-x-0 bg-white/65 text-transparent")}>
          <Check className="h-3 w-3" />
        </span>
      </span>
    </button>
  );
}

function OptionGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="rounded-[16px] border border-white/8 bg-[#1d1f26] p-4">
      <Label>{title}</Label>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              title.toLowerCase().includes("aspect") || title.includes("画幅")
                ? "flex h-14 w-14 flex-col items-center justify-center rounded-xl border text-[11px] transition-colors"
                : "rounded-xl border px-3.5 py-2 text-sm transition-colors",
              value === option
                ? "border-cyan-300/30 bg-white text-slate-950 shadow-[0_6px_20px_-10px_rgba(255,255,255,0.85)]"
                : "border-white/10 bg-[#15171d] text-white/76 hover:border-white/16 hover:bg-white/[0.05]"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function DurationSlider({
  title,
  value,
  onChange,
}: {
  title: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="rounded-[16px] border border-white/8 bg-[#1d1f26] p-4">
      <div className="flex items-center justify-between">
        <Label>{title}</Label>
        <span className="text-sm text-white">{value}s</span>
      </div>
      <input
        type="range"
        min={5}
        max={15}
        step={5}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 h-2 w-full accent-[#5da3ff]"
      />
    </div>
  );
}

function QueueItem({
  title,
  detail,
  progress,
}: {
  title: string;
  detail: string;
  progress: "done" | "active" | "idle";
}) {
  const dotClass =
    progress === "done" ? "bg-emerald-300" : progress === "active" ? "bg-cyan-300" : "bg-white/20";

  return (
    <div className="flex items-start gap-3 rounded-[12px] border border-white/8 bg-[#1d1f26] p-4">
      <span className={cn("mt-1 h-2.5 w-2.5 rounded-full", dotClass)} />
      <div>
        <div className="font-medium text-white">{title}</div>
        <div className="mt-1 text-sm text-white/50">{detail}</div>
      </div>
    </div>
  );
}

function IconButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg border border-white/8 bg-white/[0.03] p-2 text-white/54 transition-colors hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}
