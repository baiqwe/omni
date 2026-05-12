import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Props = {
  locale: string;
};

function getQuickLinks(locale: string) {
  return [
    {
      href: "#overview",
      label: locale === "zh" ? "什么是 Gemini Omni" : "What is Gemini Omni",
    },
    {
      href: "#capabilities",
      label: locale === "zh" ? "能力预览" : "Capabilities",
    },
    {
      href: "#indexing",
      label: locale === "zh" ? "开放进展" : "Rollout Status",
    },
    {
      href: "#api",
      label: locale === "zh" ? "API 预览" : "API Preview",
    },
    {
      href: "#faq",
      label: locale === "zh" ? "常见问题" : "FAQ",
    },
  ];
}

export async function HomeHeroHeading({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center space-y-5 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/22 px-4 py-2 text-sm text-white/80 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <span className="inline-flex h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.75)]" />
        {locale === "zh" ? "Google Gemini Omni 监测中" : "Tracking Google Gemini Omni"}
      </div>
      <div className="space-y-4">
        <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
          {locale === "zh" ? (
            <>
              <span className="text-white">Gemini Omni</span>
              <span className="block bg-[linear-gradient(90deg,#f8fbff_0%,#93c5fd_38%,#c4b5fd_70%,#f8fbff_100%)] bg-clip-text text-transparent">
                Google 多模态视频入口
              </span>
            </>
          ) : (
            <>
              <span className="text-white">Gemini Omni</span>
              <span className="block bg-[linear-gradient(90deg,#f8fbff_0%,#93c5fd_38%,#c4b5fd_70%,#f8fbff_100%)] bg-clip-text text-transparent">
                Google Multimodal Video Gateway
              </span>
            </>
          )}
        </h1>
        <p className="mx-auto max-w-4xl text-xl leading-9 text-white/82">
          {locale === "zh"
            ? "在这里快速了解 Gemini Omni 的能力方向、使用方式和开放进展，帮助你更早规划视频创作流程。"
            : "Get a clear view of Gemini Omni capabilities, practical workflows, and rollout status so you can prepare your video pipeline early."}
        </p>
        <p className="mx-auto max-w-3xl text-base leading-8 text-white/62">
          {t("subtitle")}
        </p>
      </div>
    </div>
  );
}

export async function HomeHeroSupport({ locale }: Props) {
  const quickLinks = getQuickLinks(locale);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center space-y-7 text-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm text-white/78 transition-colors hover:bg-white/[0.1] hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="mx-auto grid max-w-4xl gap-3 text-left text-sm text-white/68 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/22 px-4 py-3 backdrop-blur-md">
          {locale === "zh"
            ? "这里不是空白倒计时页面，而是持续更新的产品说明与上手入口。"
            : "This is not a blank countdown page. It is a living guide with practical onboarding context."}
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/22 px-4 py-3 backdrop-blur-md">
          {locale === "zh"
            ? "你可以先看核心能力、示例接口和常见问题，快速判断它是否适合你的场景。"
            : "Review core capabilities, API examples, and FAQ to quickly decide whether it fits your workflow."}
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/22 px-4 py-3 backdrop-blur-md">
          {locale === "zh"
            ? "在全面开放前，你也可以先使用我们已上线的工具，立即开始做视频和图像实验。"
            : "Before full access, you can still create right now through our live video and image tools."}
        </div>
      </div>
    </div>
  );
}

export default HomeHeroHeading;
