import type { LandingPageSlug } from "@/config/landing-pages";

export type GalleryItem = {
  id: string;
  useCase: LandingPageSlug;
  slug: string;
  category: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  alt: string;
  altZh: string;
  afterImage: string;
  beforeThumb: string;
  videoUrl: string;
  durationLabel: string;
  aspectRatioLabel: string;
  promptLabel: string;
};

const SHARED_AFTER = "/images/gallery/hero-after.png";
const SHARED_BEFORE = "/images/gallery/hero-before.png";

export const galleryItems: GalleryItem[] = [
  {
    id: "seedance-hero-4",
    useCase: "image-to-video",
    slug: "image-to-video",
    category: "Performance",
    title: "Balance beam motion study",
    titleZh: "平衡木动作镜头",
    description: "A compact performance clip that works well as a keyframe-to-motion example for Seedance 2 image-to-video workflows.",
    descriptionZh: "一条更适合图生视频场景的动作样片：先锁住角色起始画面，再把运动感逐步推出来。",
    alt: "Seedance 2 video sample showing a gymnast walking across a balance beam.",
    altZh: "用于展示 Seedance 2 图生视频工作流的平衡木动作视频样例。",
    afterImage: "/images/gallery/custom/seedance-hero-4.png",
    beforeThumb: SHARED_BEFORE,
    videoUrl: "/videos/gallery/seedance-hero-4.mp4",
    durationLabel: "05s",
    aspectRatioLabel: "16:9",
    promptLabel: "Image seed",
  },
  {
    id: "seedance-hero-6",
    useCase: "ai-short-drama-maker",
    slug: "ai-short-drama-maker",
    category: "Narrative",
    title: "Street rush sequence",
    titleZh: "街头追逐片段",
    description: "A fast narrative moment that fits short-drama, storyboard, and text-led video ideation with stronger urgency.",
    descriptionZh: "一条更有叙事冲突感的街头奔跑样片，适合短剧、分镜预演和文本驱动的镜头构思。",
    alt: "Seedance 2 narrative video sample showing a man running through a crowded street.",
    altZh: "用于展示 Seedance 2 短剧与叙事镜头生成的街头奔跑视频样例。",
    afterImage: "/images/gallery/custom/seedance-hero-6.png",
    beforeThumb: SHARED_AFTER,
    videoUrl: "/videos/gallery/seedance-hero-6.mp4",
    durationLabel: "05s",
    aspectRatioLabel: "16:9",
    promptLabel: "Narrative clip",
  },
  {
    id: "seedance-space-travel",
    useCase: "reference-video-generator",
    slug: "reference-video-generator",
    category: "Worldbuilding",
    title: "Space travel sequence",
    titleZh: "宇宙穿梭场景片段",
    description: "A full Seedance 2 clip that moves from stylized terrain into large-scale sci-fi worldbuilding.",
    descriptionZh: "一条完整的 Seedance 2 场景视频，从体素地貌一路推进到更宏观的宇宙世界观。",
    alt: "Seedance 2 full video showing sci-fi worldbuilding and space travel.",
    altZh: "用于展示 Seedance 2 宇宙世界构建与穿梭场景的完整视频案例。",
    afterImage: "/images/gallery/custom/seedance-space-travel.png",
    beforeThumb: SHARED_BEFORE,
    videoUrl: "/videos/gallery/seedance-space-travel.mp4",
    durationLabel: "15s",
    aspectRatioLabel: "16:9",
    promptLabel: "Full clip",
  },
  {
    id: "seedance-autumn-duel",
    useCase: "storyboard-to-video",
    slug: "storyboard-to-video",
    category: "Action",
    title: "Autumn duel sequence",
    titleZh: "秋林决斗完整片段",
    description: "A complete cinematic action sample with stronger blocking, camera travel, and character momentum.",
    descriptionZh: "一条完整的动作型样片，镜头调度、走位关系和人物动势都更完整。",
    alt: "Seedance 2 full action video showing a duel in an autumn forest.",
    altZh: "用于展示 Seedance 2 秋林决斗镜头的完整动作视频案例。",
    afterImage: "/images/gallery/custom/seedance-autumn-duel.png",
    beforeThumb: SHARED_BEFORE,
    videoUrl: "/videos/gallery/seedance-autumn-duel.mp4",
    durationLabel: "13s",
    aspectRatioLabel: "16:9",
    promptLabel: "Full clip",
  },
  {
    id: "product-cinematic",
    useCase: "product-ad-generator",
    slug: "product-ad-generator",
    category: "Commercial",
    title: "Product reveal sequence",
    titleZh: "产品广告揭幕镜头",
    description: "Turn still product shots and one motion reference into a polished campaign-ready reveal.",
    descriptionZh: "把静态产品图和一段参考运镜，转成更像广告片开场的揭幕镜头。",
    alt: "AI video showcase card for a product reveal workflow.",
    altZh: "用于展示产品广告生成工作流的 AI 视频案例卡片。",
    afterImage: "/images/gallery/generated/ghibli.jpg",
    beforeThumb: SHARED_BEFORE,
    videoUrl: "/videos/gallery/product-reveal.mp4",
    durationLabel: "05s",
    aspectRatioLabel: "4:5",
    promptLabel: "Prompt + refs",
  },
  {
    id: "dance-transfer",
    useCase: "dance-motion-transfer",
    slug: "dance-motion-transfer",
    category: "Motion",
    title: "Dance motion transfer",
    titleZh: "舞蹈动作迁移",
    description: "Clone choreography timing from reference footage while preserving a fresh character identity.",
    descriptionZh: "沿用参考视频里的舞蹈节奏和动作语言，同时保持新的角色设定。",
    alt: "AI video showcase card for dance motion transfer.",
    altZh: "用于展示舞蹈动作迁移工作流的 AI 视频案例卡片。",
    afterImage: "/images/gallery/generated/webtoon.jpg",
    beforeThumb: SHARED_BEFORE,
    videoUrl: "/videos/gallery/dance-motion.mp4",
    durationLabel: "05s",
    aspectRatioLabel: "9:16",
    promptLabel: "Motion ref",
  },
  {
    id: "storyboard-previs",
    useCase: "storyboard-to-video",
    slug: "storyboard-to-video",
    category: "Previs",
    title: "Storyboard to previs",
    titleZh: "分镜到预演视频",
    description: "Extend still frames into continuous camera moves for previs, blocking, and scene timing tests.",
    descriptionZh: "把静态分镜延展成连续镜头，用于影视预演、走位和节奏验证。",
    alt: "AI video showcase card for storyboard to video previs.",
    altZh: "用于展示分镜到预演视频工作流的 AI 视频案例卡片。",
    afterImage: "/images/gallery/generated/retro_90s.jpg",
    beforeThumb: SHARED_BEFORE,
    videoUrl: "/videos/gallery/storyboard-previs.mp4",
    durationLabel: "05s",
    aspectRatioLabel: "4:5",
    promptLabel: "Storyboard",
  },
  {
    id: "image-video-seed",
    useCase: "image-to-video",
    slug: "image-to-video",
    category: "Conversion",
    title: "Image to video seed shot",
    titleZh: "图像转视频起始镜头",
    description: "Use still imagery as a locked visual seed, then push into motion with camera direction and timing.",
    descriptionZh: "先把静态图片当成锁定起始画面，再用运镜和节奏把它推成视频镜头。",
    alt: "AI video showcase card for image to video generation.",
    altZh: "用于展示图像转视频工作流的 AI 视频案例卡片。",
    afterImage: "/images/gallery/generated/cyberpunk.jpg",
    beforeThumb: SHARED_BEFORE,
    videoUrl: "/videos/gallery/image-to-video.mp4",
    durationLabel: "05s",
    aspectRatioLabel: "16:9",
    promptLabel: "Image seed",
  },
  {
    id: "reference-anything",
    useCase: "reference-video-generator",
    slug: "reference-video-generator",
    category: "Reference",
    title: "Reference-led video generation",
    titleZh: "多参考视频生成",
    description: "Blend images, clips, and audio into a single prompt-driven job instead of relying on text alone.",
    descriptionZh: "把图片、视频和音频一起融入单个任务，而不是只靠一句文字描述。",
    alt: "AI video showcase card for multi-reference video generation.",
    altZh: "用于展示多参考视频生成工作流的 AI 视频案例卡片。",
    afterImage: "/images/gallery/generated/standard.jpg",
    beforeThumb: SHARED_BEFORE,
    videoUrl: "/videos/gallery/reference-led.mp4",
    durationLabel: "05s",
    aspectRatioLabel: "4:5",
    promptLabel: "Audio + refs",
  },
  {
    id: "video-extension",
    useCase: "video-extension",
    slug: "video-extension",
    category: "Extension",
    title: "Scene extension workflow",
    titleZh: "视频平滑扩写",
    description: "Continue an existing clip with the same scene logic, motion direction, and tonal continuity.",
    descriptionZh: "沿着原视频的场景逻辑、动作方向和画面气质，继续把镜头平滑扩写下去。",
    alt: "AI video showcase card for video extension.",
    altZh: "用于展示视频平滑扩写工作流的 AI 视频案例卡片。",
    afterImage: "/images/gallery/generated/cosplay.jpg",
    beforeThumb: SHARED_BEFORE,
    videoUrl: "/videos/gallery/video-extension.mp4",
    durationLabel: "05s",
    aspectRatioLabel: "9:16",
    promptLabel: "Scene extend",
  },
];

export function getLocalizedGalleryItems(locale: string, useCase?: LandingPageSlug) {
  const filtered = useCase ? galleryItems.filter((item) => item.useCase === useCase) : galleryItems;
  const resolved = filtered.length > 0 ? filtered : galleryItems;

  return resolved.map((item) => ({
    ...item,
    categoryLabel: locale === "zh" ? item.titleZh : item.category,
    titleLabel: locale === "zh" ? item.titleZh : item.title,
    descriptionLabel: locale === "zh" ? item.descriptionZh : item.description,
    altLabel: locale === "zh" ? item.altZh : item.alt,
  }));
}
