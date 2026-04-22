"use client";

import { useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AudioLines,
  CheckCircle2,
  Clapperboard,
  Film,
  ImagePlus,
  Mic2,
  MonitorPlay,
  PlayCircle,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type WorkspaceCopy = {
  tabs: string[];
  subtitle: string;
  uploadTitle: string;
  uploadHint: string;
  uploadMeta: string;
  containsRealPeople: string;
  returnLastFrame: string;
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
  previewTitle: string;
  previewSubtitle: string;
  stats: Array<{ label: string; value: string }>;
  quickPresetsTitle: string;
  presets: Array<{ name: string; prompt: string }>;
};

type Props = {
  locale: string;
};

const COPY: Record<string, WorkspaceCopy> = {
  zh: {
    tabs: ["多参考视频生成", "图像转视频", "文本转视频"],
    subtitle:
      "把图片、视频、音频和文本放进同一个创作台，先搭工作流，再接真实生成链路。",
    uploadTitle: "拖入你的多模态素材",
    uploadHint: "最多 9 张图片、3 段视频、3 段音频。当前先做前端工作台与任务流预演。",
    uploadMeta: "PNG / JPG / WEBP / MP4 / MOV / MP3 / WAV",
    containsRealPeople: "包含真人素材",
    returnLastFrame: "返回尾帧",
    promptLabel: "Prompt",
    promptPlaceholder:
      "例如：用 image-01 作为首帧角色参考，沿用 video-02 的镜头运动与节奏，整体是高反差赛博城市夜景，配合低频电子鼓点推进。",
    promptCounter: "5000 字符以内的自然语言控制",
    resolution: "分辨率",
    duration: "时长",
    aspectRatio: "画幅",
    advanced: "高级选项",
    generate: "Generate",
    queueTitle: "渲染队列",
    queueEta: "预计 2 分 40 秒",
    queueHint: "完成接入后，这里会显示异步任务状态、进度与失败重试。",
    previewTitle: "结果预览面板",
    previewSubtitle: "当前展示的是 Seedance 2 首页应有的输出氛围，而不是最终视频结果。",
    stats: [
      { label: "输入模态", value: "图 / 视 / 音 / 文" },
      { label: "镜头控制", value: "自然语言 + 参考素材" },
      { label: "工作流", value: "生成 / 延展 / 编辑" },
    ],
    quickPresetsTitle: "一键代入灵感模板",
    presets: [
      {
        name: "舞蹈动作克隆",
        prompt: "用参考舞蹈视频的动作节奏，保持角色服装一致，生成 9:16 竖版短视频。",
      },
      {
        name: "广告产品镜头",
        prompt: "让产品图在黑色镜面桌面上完成 cinematic reveal，镜头缓慢推进并带有微弱高光扫过。",
      },
      {
        name: "电影预演",
        prompt: "参考第二段视频的推轨和转场节奏，把静帧角色扩展成连续镜头，保持场景连贯。",
      },
    ],
  },
  en: {
    tabs: ["Multi-Reference Video", "Image to Video", "Text to Video"],
    subtitle:
      "Combine images, videos, audio, and text in one cinematic workspace. This phase ships the experience shell first.",
    uploadTitle: "Drop your multi-modal assets",
    uploadHint:
      "Up to 9 images, 3 video clips, and 3 audio files. We are staging the workspace and job flow before wiring the live model.",
    uploadMeta: "PNG / JPG / WEBP / MP4 / MOV / MP3 / WAV",
    containsRealPeople: "Contains real people",
    returnLastFrame: "Return last frame",
    promptLabel: "Prompt",
    promptPlaceholder:
      "Example: Use image-01 as the opening character reference, borrow video-02's camera movement and pacing, set everything in a high-contrast cyber city at night, and sync the action to a low-end electronic beat.",
    promptCounter: "Natural-language control, up to 5000 characters",
    resolution: "Resolution",
    duration: "Duration",
    aspectRatio: "Aspect Ratio",
    advanced: "Advanced",
    generate: "Generate",
    queueTitle: "Render Queue",
    queueEta: "ETA 2m 40s",
    queueHint: "Once the backend lands, this panel will host async job status, progress, and retry controls.",
    previewTitle: "Output Preview",
    previewSubtitle: "This is the intended Seedance 2 mood board for the homepage, not the final generated video yet.",
    stats: [
      { label: "Input Modes", value: "Image / Video / Audio / Text" },
      { label: "Motion Control", value: "Prompt + reference assets" },
      { label: "Workflow", value: "Generate / Extend / Edit" },
    ],
    quickPresetsTitle: "Load inspiration templates",
    presets: [
      {
        name: "Dance Motion Clone",
        prompt: "Transfer the choreography timing from the reference dance clip while keeping the character wardrobe consistent in a 9:16 short.",
      },
      {
        name: "Commercial Product Shot",
        prompt: "Reveal the product on a black reflective table with a slow cinematic push-in and a subtle specular sweep.",
      },
      {
        name: "Previs Storyboard",
        prompt: "Reuse the dolly move and transition rhythm from clip two, then extend the still character frame into a continuous shot.",
      },
    ],
  },
};

const IMAGE_ASSETS = [
  { id: "image-01", icon: ImagePlus, accent: "from-fuchsia-500/25 via-fuchsia-500/10 to-transparent" },
  { id: "image-02", icon: ImagePlus, accent: "from-cyan-400/25 via-cyan-400/10 to-transparent" },
  { id: "image-03", icon: ImagePlus, accent: "from-amber-400/25 via-amber-400/10 to-transparent" },
];

const VIDEO_ASSETS = [
  { id: "video-01", icon: Film },
  { id: "video-02", icon: Clapperboard },
];

const AUDIO_ASSETS = [{ id: "audio-01", icon: Mic2 }];
const RESOLUTIONS = ["480p", "720p", "1080p"];
const DURATIONS = ["5s", "10s", "15s"];
const RATIOS = ["Auto", "16:9", "9:16", "1:1", "4:3", "3:4", "21:9"];

export function MultiModalWorkspace({ locale }: Props) {
  const copy = COPY[locale] ?? COPY.en;
  const [activeTab, setActiveTab] = useState(copy.tabs[0]);
  const [resolution, setResolution] = useState("1080p");
  const [duration, setDuration] = useState("5s");
  const [ratio, setRatio] = useState("16:9");
  const [prompt, setPrompt] = useState(copy.presets[0]?.prompt ?? "");
  const [containsRealPeople, setContainsRealPeople] = useState(true);
  const [returnLastFrame, setReturnLastFrame] = useState(true);
  const promptLength = useMemo(() => prompt.length, [prompt]);

  return (
    <div id="workspace" className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="surface-panel relative overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(6,10,20,0.96),rgba(5,8,18,0.88))] p-5 sm:p-6"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_24%),radial-gradient(circle_at_top_left,rgba(236,72,153,0.16),transparent_28%)]" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {copy.tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                  activeTab === tab
                    ? "border-cyan-300/40 bg-white text-slate-950"
                    : "border-white/10 bg-white/5 text-white/72 hover:border-white/20 hover:bg-white/8"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/72">Seedance Workspace</p>
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{copy.uploadTitle}</h2>
              <p className="max-w-2xl text-sm leading-7 text-white/62">{copy.subtitle}</p>
            </div>
            <div className="rounded-full border border-emerald-300/15 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-200">
              {copy.uploadMeta}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-dashed border-white/16 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-white">{copy.uploadTitle}</div>
                  <div className="text-sm text-white/55">{copy.uploadHint}</div>
                </div>
                <MonitorPlay className="h-5 w-5 text-cyan-200" />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {IMAGE_ASSETS.map((asset) => (
                  <AssetCard key={asset.id} label={asset.id} kind="image" icon={asset.icon} accent={asset.accent} />
                ))}
                {VIDEO_ASSETS.map((asset) => (
                  <AssetCard key={asset.id} label={asset.id} kind="video" icon={asset.icon} />
                ))}
                {AUDIO_ASSETS.map((asset) => (
                  <AssetCard key={asset.id} label={asset.id} kind="audio" icon={asset.icon} />
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <TogglePill active={containsRealPeople} onClick={() => setContainsRealPeople((v) => !v)}>
                  {copy.containsRealPeople}
                </TogglePill>
                <TogglePill active={returnLastFrame} onClick={() => setReturnLastFrame((v) => !v)}>
                  {copy.returnLastFrame}
                </TogglePill>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <Label>{copy.quickPresetsTitle}</Label>
              <div className="mt-3 space-y-3">
                {copy.presets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setPrompt(preset.prompt)}
                    className="w-full rounded-[22px] border border-white/10 bg-black/10 p-4 text-left transition-colors hover:border-cyan-300/25 hover:bg-white/[0.07]"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Sparkles className="h-4 w-4 text-cyan-200" />
                      {preset.name}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/55">{preset.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <Label>{copy.promptLabel}</Label>
              <span className="text-xs uppercase tracking-[0.24em] text-white/42">{promptLength}/5000</span>
            </div>
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value.slice(0, 5000))}
              placeholder={copy.promptPlaceholder}
              className="min-h-[150px] resize-none rounded-[24px] border-white/10 bg-slate-950/60 text-base text-white placeholder:text-white/28 focus-visible:ring-cyan-300/50"
            />
            <div className="mt-3 text-sm text-white/45">{copy.promptCounter}</div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <OptionGroup title={copy.resolution} options={RESOLUTIONS} value={resolution} onChange={setResolution} />
            <OptionGroup title={copy.duration} options={DURATIONS} value={duration} onChange={setDuration} />
            <OptionGroup title={copy.aspectRatio} options={RATIOS} value={ratio} onChange={setRatio} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-white/72 hover:bg-white/10"
            >
              <AudioLines className="h-4 w-4 text-cyan-200" />
              {copy.advanced}
            </button>
            <Button className="rounded-full bg-white px-7 py-6 text-sm font-black uppercase tracking-[0.2em] text-slate-950 hover:bg-cyan-100">
              <WandSparkles className="mr-2 h-4 w-4" />
              {copy.generate}
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
        <div className="surface-panel overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(8,12,22,0.94),rgba(9,13,26,0.82))] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/45">{copy.previewTitle}</p>
              <h3 className="mt-2 text-2xl font-black text-white">{copy.previewSubtitle}</h3>
            </div>
            <PlayCircle className="h-6 w-6 text-cyan-200" />
          </div>

          <div className="mt-5 overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.26),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(244,114,182,0.24),transparent_26%),linear-gradient(160deg,#090f1c_0%,#111c2f_52%,#060811_100%)] p-6">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.26em] text-white/48">
              <span>Preview timeline</span>
              <span>{resolution} · {duration} · {ratio}</span>
            </div>
            <div className="mt-16 max-w-sm space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs text-cyan-100">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Character consistency locked
              </div>
              <div className="text-4xl font-black tracking-tight text-white">
                Multi-modal direction,
                <br />
                cinematic output.
              </div>
              <p className="text-sm leading-7 text-white/62">
                A premium homepage preview block that makes the tool feel alive before the real generation service is connected.
              </p>
            </div>
            <div className="mt-16 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[68%] rounded-full bg-[linear-gradient(90deg,#7dd3fc,#f9a8d4)]" />
              </div>
              <span className="text-sm text-white/52">68%</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {copy.stats.map((stat) => (
              <div key={stat.label} className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-white/42">{stat.label}</div>
                <div className="mt-2 text-base font-semibold text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-panel border-white/10 bg-[linear-gradient(180deg,rgba(9,14,24,0.95),rgba(8,12,21,0.88))] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/45">{copy.queueTitle}</p>
              <h3 className="mt-2 text-xl font-black text-white">{copy.queueEta}</h3>
            </div>
            <div className="rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-200">
              Ready for async jobs
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <QueueItem title="Job created" detail="Assets normalized and staged in storage" progress="done" />
            <QueueItem title="Credit estimation" detail="1080p × 5s = dynamic pricing placeholder" progress="active" />
            <QueueItem title="Model inference" detail="Queued for provider handoff and status polling" progress="idle" />
          </div>
          <p className="mt-4 text-sm leading-7 text-white/50">{copy.queueHint}</p>
        </div>
      </motion.div>
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/54">{children}</div>;
}

function TogglePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all",
        active
          ? "border-cyan-300/30 bg-cyan-300/12 text-cyan-100"
          : "border-white/10 bg-white/5 text-white/65"
      )}
    >
      <span
        className={cn(
          "h-2.5 w-2.5 rounded-full",
          active ? "bg-cyan-200 shadow-[0_0_20px_rgba(125,211,252,0.65)]" : "bg-white/30"
        )}
      />
      {children}
    </button>
  );
}

function AssetCard({
  label,
  kind,
  icon: Icon,
  accent,
}: {
  label: string;
  kind: "image" | "video" | "audio";
  icon: ComponentType<{ className?: string }>;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/70 p-4 text-left transition-transform hover:-translate-y-1",
        accent ? `bg-gradient-to-br ${accent}` : ""
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-[11px] uppercase tracking-[0.24em] text-white/42">{kind}</span>
        </div>
        <div className="mt-10 text-base font-semibold text-white">{label}</div>
      </div>
    </div>
  );
}

function OptionGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
      <Label>{title}</Label>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              value === option
                ? "border-white bg-white text-slate-950"
                : "border-white/10 bg-transparent text-white/65 hover:bg-white/8"
            )}
          >
            {option}
          </button>
        ))}
      </div>
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
    progress === "done"
      ? "bg-emerald-300"
      : progress === "active"
        ? "bg-cyan-300 shadow-[0_0_20px_rgba(125,211,252,0.55)]"
        : "bg-white/20";

  return (
    <div className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
      <span className={cn("mt-1 h-2.5 w-2.5 rounded-full", dotClass)} />
      <div>
        <div className="font-semibold text-white">{title}</div>
        <div className="mt-1 text-sm text-white/55">{detail}</div>
      </div>
    </div>
  );
}
