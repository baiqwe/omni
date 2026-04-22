import rawLandingPages from "./landing-pages.json";
import type { VideoGenerationMode } from "@/utils/video-generation";

// Legacy compatibility for still-present image editor components that are no longer mounted.
export type AnimeStyleId = "standard" | "ghibli" | "cyberpunk" | "retro_90s" | "webtoon" | "cosplay";

export type LandingPageFaq = { question: string; answer: string };

export type LandingPageConfig = {
  slug: string;
  targetKeyword: string;
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  mode: VideoGenerationMode;
  faqs: LandingPageFaq[];
};

type LandingPageLocalizedCopy = {
  titleZh: string;
  descriptionZh: string;
  h1Zh: string;
  subtitleZh: string;
  faqsZh: LandingPageFaq[];
};

export const landingPages = rawLandingPages as Record<string, LandingPageConfig>;
export type LandingPageSlug = keyof typeof landingPages;

const landingPagesZh: Record<LandingPageSlug, LandingPageLocalizedCopy> = {
  "image-to-video": {
    titleZh: "图像转视频 AI 工作台 - 把静帧推进成镜头",
    descriptionZh: "从一张静态图片出发，加入运镜、节奏和画面意图，把它变成更可控的 AI 视频工作流。",
    h1Zh: "图像转视频 AI 工作台",
    subtitleZh: "把静帧推进成有节奏的镜头，而不是随机动起来的短片段。",
    faqsZh: [
      { question: "什么样的图像适合作为起始帧？", answer: "主体清晰、构图明确、空间关系稳定的画面最适合做起始帧。" },
      { question: "为什么要加运镜描述？", answer: "因为真正决定镜头质感的不只是会不会动，而是怎么动、动到哪里、节奏怎么推进。" }
    ]
  },
  "reference-video-generator": {
    titleZh: "多参考视频生成器 - 用真实素材而不是玄学 Prompt",
    descriptionZh: "把图片、视频和音频参考放在一起，让结果跟随真实创作意图，而不是依赖模糊的文字描述。",
    h1Zh: "多参考视频生成器",
    subtitleZh: "把参考图、参考视频和音频节奏一起交给系统，生成更可控的视频结果。",
    faqsZh: [
      { question: "为什么多参考比纯文本更重要？", answer: "因为参考素材能直接压缩镜头语言、画面质感和动作方向，比单句文字更可靠。" },
      { question: "可以混合多种输入吗？", answer: "可以。图片负责身份与场景，视频负责动作和镜头，音频负责节奏提示。" }
    ]
  },
  "dance-motion-transfer": {
    titleZh: "AI 舞蹈动作迁移 - 复制节奏，替换主体",
    descriptionZh: "把参考舞蹈视频里的动作节奏和能量迁移到新的角色或新的视频设定上。",
    h1Zh: "AI 舞蹈动作迁移",
    subtitleZh: "让动作参考带走节奏和编舞，同时把主体替换成新的角色或造型。",
    faqsZh: [
      { question: "什么样的参考舞蹈视频最好？", answer: "全身清晰、动作连续、镜头不要切太碎的视频最适合做动作迁移。" },
      { question: "怎么保证角色一致性？", answer: "同时上传角色参考图，并明确哪些服装、脸部和比例必须被锁定。" }
    ]
  },
  "product-ad-generator": {
    titleZh: "AI 产品广告生成器 - 把产品图变成广告镜头",
    descriptionZh: "用产品静帧、运镜参考和商业化 Prompt，生成更像 campaign shot 的产品视频片段。",
    h1Zh: "AI 产品广告生成器",
    subtitleZh: "从产品静图出发，快速生成揭幕镜头、发售预告和视觉提案片段。",
    faqsZh: [
      { question: "产品广告 Prompt 最关键的是什么？", answer: "材质反应、光线变化、镜头路径和品牌气质，这些都要写清楚。" },
      { question: "一定要加参考视频吗？", answer: "强烈建议加。哪怕只是一段短参考，也能显著提高镜头语言的一致性。" }
    ]
  },
  "storyboard-to-video": {
    titleZh: "分镜转视频 AI - 把静态分镜扩成预演镜头",
    descriptionZh: "把分镜稿或关键帧扩成可移动的预演视频，用来测试运镜、节奏和场景连续性。",
    h1Zh: "分镜转视频 AI",
    subtitleZh: "让静态分镜不再只是平面图，而是可以用于预演和走位验证的动态镜头。",
    faqsZh: [
      { question: "这更适合成片还是预演？", answer: "更适合预演、提案和拍摄前验证，而不是直接替代最终成片。" },
      { question: "只给一张图够吗？", answer: "可以，但如果有多张关键帧，系统会更容易理解连续性和镜头目标。" }
    ]
  },
  "video-extension": {
    titleZh: "AI 视频扩写 - 把已有镜头平滑延长",
    descriptionZh: "沿着原始视频的运动方向、场景逻辑和情绪基调，把镜头继续自然延长。",
    h1Zh: "AI 视频扩写",
    subtitleZh: "不是重新生成一个新镜头，而是沿着原镜头的逻辑继续往前走。",
    faqsZh: [
      { question: "什么决定扩写是否自然？", answer: "运动方向、空间关系、光线延续和主体状态是否前后一致。" },
      { question: "可以加尾帧吗？", answer: "可以。尾帧能给系统一个明确目标，通常会比纯粹续写更稳定。" }
    ]
  }
};

export function getLandingPage(slug: string): LandingPageConfig | null {
  return landingPages[slug] || null;
}

export function getLocalizedLandingPage(slug: string, locale: string): LandingPageConfig | null {
  const page = getLandingPage(slug);
  if (!page) return null;
  if (locale !== "zh") return page;
  const zhCopy = landingPagesZh[slug as LandingPageSlug];
  if (!zhCopy) return page;

  return {
    ...page,
    title: zhCopy.titleZh,
    description: zhCopy.descriptionZh,
    h1: zhCopy.h1Zh,
    subtitle: zhCopy.subtitleZh,
    faqs: zhCopy.faqsZh,
  };
}

export const landingPageSlugs = Object.keys(landingPages);
export const indexableLandingPageSlugs = landingPageSlugs;
