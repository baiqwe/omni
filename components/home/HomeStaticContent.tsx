import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Clapperboard, Layers3, Sparkles } from "lucide-react";
import { InspirationGallery } from "@/components/gallery/InspirationGallery";
import { PricingSection } from "@/components/marketing/pricing-section";

type Props = { locale: string };

export default async function HomeStaticContent({ locale }: Props) {
  const isZh = locale === "zh";
  const t = await getTranslations({ locale, namespace: "home_static" });
  const localePrefix = `/${locale}`;
  const workflowLinks = [
    {
      href: `${localePrefix}/image-to-video`,
      title: isZh ? "Image to Video" : "Image to Video",
      description: isZh
        ? "把单张图片、多张参考图或角色立绘转成镜头更稳定的视频结果。"
        : "Turn stills, multiple references, or character art into more stable motion output.",
    },
    {
      href: `${localePrefix}/reference-video-generator`,
      title: isZh ? "Reference Video Generator" : "Reference Video Generator",
      description: isZh
        ? "用已有视频片段、镜头语言和动作节奏去约束新的 AI 视频生成。"
        : "Use existing clips, shot language, and pacing to constrain new AI video generations.",
    },
    {
      href: `${localePrefix}/dance-motion-transfer`,
      title: isZh ? "Dance Motion Transfer" : "Dance Motion Transfer",
      description: isZh
        ? "让人物、虚拟角色或数字人更准确地继承参考动作。"
        : "Carry choreographed movement into human, avatar, or digital talent workflows.",
    },
    {
      href: `${localePrefix}/storyboard-to-video`,
      title: isZh ? "Storyboard to Video" : "Storyboard to Video",
      description: isZh
        ? "把分镜图、场景草图和镜头说明拼成预演视频。"
        : "Convert storyboard panels, scene boards, and shot notes into previs-ready clips.",
    },
    {
      href: `${localePrefix}/video-extension`,
      title: isZh ? "Video Extension" : "Video Extension",
      description: isZh
        ? "把已有片段继续往下写，重点保持动作连续性和镜头节奏。"
        : "Continue an existing clip while preserving camera movement and temporal continuity.",
    },
    {
      href: `${localePrefix}/product-ad-generator`,
      title: isZh ? "Product Ad Generator" : "Product Ad Generator",
      description: isZh
        ? "适合电商、广告和社媒团队做产品展示、开箱和 campaign testing。"
        : "Useful for commerce, ads, and social teams building product reveals and campaign tests.",
    },
  ];
  const trustLinks = [
    { href: `${localePrefix}/about`, label: isZh ? "关于我们" : "About" },
    { href: `${localePrefix}/privacy`, label: isZh ? "隐私政策" : "Privacy Policy" },
    { href: `${localePrefix}/terms`, label: isZh ? "服务条款" : "Terms of Service" },
    { href: `${localePrefix}/contact`, label: isZh ? "联系我们" : "Contact" },
  ];
  const buyerFaqs = [
    {
      question: isZh ? "Seedance 2 更像什么产品？" : "What kind of product is Seedance 2, really?",
      answer: isZh
        ? "它更像一个多模态 AI 视频工作站，而不是一个只输入一句 prompt 就随机出片的轻工具。你可以把图片、视频、音频和文字一起组织成可复用的生成流程。"
        : "It behaves more like a multi-modal AI video workstation than a lightweight prompt toy. You can combine images, videos, audio, and text into a workflow that can be repeated and refined.",
    },
    {
      question: isZh ? "它适合哪类团队先用起来？" : "Who should adopt it first?",
      answer: isZh
        ? "最适合广告与营销团队、短视频工作室、影视预演团队、品牌内容团队，以及已经有参考素材体系的人。"
        : "It fits ad and marketing teams, short-form studios, previs teams, brand content groups, and anyone who already works from reference material.",
    },
    {
      question: isZh ? "为什么首页要写这么多解释内容？" : "Why does the homepage need so much explanatory content?",
      answer: isZh
        ? "因为用户和 Google 都需要知道这是不是一个可信、可用、适合自己场景的 AI video generator，而不仅是一张酷炫截图。"
        : "Because both users and Google need enough context to understand whether this is a credible AI video generator that fits a real workflow, not just a cool screenshot.",
    },
    {
      question: isZh ? "如果现在先静态访问，不配 GA4 和社媒参数可以吗？" : "Can the site stay mostly static without GA4 or community links for now?",
      answer: isZh
        ? "可以。GA4、LinkedIn、Reddit 和 Search Console 验证码都不是部署阻塞项。只要正式域名、站点 URL、支持邮箱和你实际要用的 Supabase / 支付配置正确，页面就能正常访问。"
        : "Yes. GA4, LinkedIn, Reddit, and Search Console verification are not deployment blockers. The site can render fine as long as the production domain, site URL, support email, and any real Supabase or billing settings you use are configured correctly.",
    },
  ];

  return (
    <>
      <section className="border-t border-white/6 bg-[linear-gradient(180deg,#060918_0%,#0b1026_100%)] py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-transparent bg-[linear-gradient(90deg,#8b5cf6,#2563ff)] bg-clip-text sm:text-5xl">
              {isZh ? "Get Inspired" : "Get Inspired"}
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
              {isZh
                ? "浏览多模态示例视频，看看图像、视频、音频与文本参考如何组合成更可控的成片。"
                : "Explore multi-modal video examples to see how image, video, audio, and text references combine into controllable outputs."}
            </p>
          </div>
        </div>
        <div className="mt-12">
          <InspirationGallery locale={locale} maxItems={6} />
        </div>
      </section>

      <section id="guide" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl space-y-16">
            <div className="mx-auto max-w-4xl text-center">
              <div className="section-kicker">{isZh ? "What Seedance 2 Covers" : "What Seedance 2 Covers"}</div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {isZh ? "不只是一个提示词输入框，而是一套可控的视频生成工作流。" : "Not just a prompt box, but a controllable AI video production workflow."}
              </h2>
              <p className="mt-5 text-base leading-8 text-white/66 sm:text-lg">
                {isZh
                  ? "如果你在搜索 Seedance 2、AI video generator、image to video、text to video 或 video extension，这个首页应该先让你理解：它能处理哪些输入、适合哪些场景、输出如何更可控。"
                  : "If you are searching for Seedance 2, an AI video generator, image to video, text to video, or video extension workflows, this page should make the product scope legible before you ever sign up."}
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <FeatureCard
                icon={<Layers3 className="h-5 w-5 text-[#6ea8ff]" />}
                title={isZh ? "参考素材优先" : "Reference-first inputs"}
                desc={isZh ? "图片、视频、音频各自独立上传和排序，工作台逻辑更接近真实视频生产。" : "Images, videos, and audio upload in distinct lanes so the workflow feels closer to real video production."}
              />
              <FeatureCard
                icon={<Clapperboard className="h-5 w-5 text-[#8b5cf6]" />}
                title={isZh ? "视频预览优先" : "Preview-first interface"}
                desc={isZh ? "右侧直接给出视频预览与说明区域，减少表单感，让结果更突出。" : "The right side is dedicated to preview and guidance so the result stays visually central."}
              />
              <FeatureCard
                icon={<Sparkles className="h-5 w-5 text-[#5eead4]" />}
                title={isZh ? "更像 Seedance 的页面节奏" : "Closer Seedance pacing"}
                desc={isZh ? "顶部标题简洁、工作台集中、下方画廊直给，先把核心体验讲清楚。" : "A simpler hero, concentrated workspace, and direct gallery make the page read more like the Seedance reference."}
              />
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="surface-panel px-6 py-7 md:px-8">
                <div className="section-kicker">{isZh ? "Search Intent" : "Search Intent"}</div>
                <h3 className="mt-4 text-2xl font-semibold text-white">
                  {isZh ? "Seedance 2 的首页需要同时回答品牌词和工具词。" : "The homepage needs to answer both branded and tool-intent searches."}
                </h3>
                <div className="mt-5 space-y-4 text-sm leading-8 text-white/68">
                  <p>
                    {isZh
                      ? "品牌词层面，用户会直接搜索 Seedance 2、Seedance 2 video、Seedance 2 AI。工具词层面，他们会搜索 AI video generator、multi-modal AI video、reference video generator、image to video 和 text to video。"
                      : "At the branded layer, users search Seedance 2, Seedance 2 video, or Seedance 2 AI. At the tool layer, they search AI video generator, multi-modal AI video, reference video generator, image to video, and text to video."}
                  </p>
                  <p>
                    {isZh
                      ? "因此首页不能只展示一个黑色工作台壳子，还需要把能力边界、适用团队、输入类型、输出方式、定价逻辑和隐私说明都讲清楚。"
                      : "That means the homepage cannot stop at a dark workspace shell. It also has to explain capability boundaries, target teams, input types, output controls, pricing logic, and privacy expectations."}
                  </p>
                </div>
              </div>
              <div className="surface-panel px-6 py-7 md:px-8">
                <div className="section-kicker">{isZh ? "Trust Signals" : "Trust Signals"}</div>
                <h3 className="mt-4 text-2xl font-semibold text-white">
                  {isZh ? "Google 更看重“这是谁做的，为什么值得信任”。" : "Google also wants to know who made this and why it deserves trust."}
                </h3>
                <div className="mt-5 space-y-4 text-sm leading-8 text-white/68">
                  <p>
                    {isZh
                      ? "所以我们会把关于我们、服务条款、隐私政策、联系方式、支持邮箱、支付说明和公开视频样例都挂在主导航与页脚里。"
                      : "That is why About, Terms, Privacy, Contact, support email, billing language, and public showcase pages need to be discoverable from the primary site structure."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trustLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="surface-panel px-6 py-7 md:px-8">
                <div className="section-kicker">{isZh ? "Helpful Content" : "Helpful Content"}</div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                  {isZh ? "如果页面想长期拿到流量，必须回答用户真正想知道的问题。" : "If this page wants durable rankings, it has to answer real user questions."}
                </h2>
                <div className="mt-5 space-y-4 text-sm leading-8 text-white/66">
                  <p>
                    {isZh
                      ? "用户不是为了看一句“我们很强”而搜索 Seedance 2。他们想知道这是不是一个可靠的 AI video generator，是否支持 image to video、text to video、reference video generation、video extension，是否适合广告、预演、角色一致性或短视频生产。"
                      : "People do not search Seedance 2 just to read a slogan. They want to know whether this is a reliable AI video generator, whether it supports image to video, text to video, reference video generation, and video extension, and whether it fits ad creative, previs, character consistency, or repeatable content production."}
                  </p>
                  <p>
                    {isZh
                      ? "因此首页需要同时承担三个角色：品牌入口、工作台入口、内容解释页。只有把这三层都做好，搜索和转化才会更稳。"
                      : "That means the homepage has to do three jobs at once: brand entry point, workspace entry point, and explanatory content page. Search visibility and conversion tend to improve only when all three are handled well."}
                  </p>
                </div>
              </div>
              <div className="surface-panel px-6 py-7 md:px-8">
                <div className="section-kicker">{isZh ? "What This Site Is Not" : "What This Site Is Not"}</div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                  {isZh ? "它不应该看起来像一个只有几行 prompt 的薄页面。" : "It should not feel like a thin page wrapped around a prompt box."}
                </h2>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-white/66">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-rose-300/80" />
                    <span>{isZh ? "不是只靠品牌词和一个 H1 撑起来的单页。" : "Not a one-screen site propped up by a brand word and a single H1."}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-rose-300/80" />
                    <span>{isZh ? "不是只堆截图、缺少工作流说明和法律页的“AI 壳站”。" : "Not an AI shell site that only stacks screenshots without workflow explanation or trust pages."}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-rose-300/80" />
                    <span>{isZh ? "不是每个 use case 都长得一模一样、只有关键词不同的程序化落地页集合。" : "Not a cluster of programmatic landing pages that only swap keywords while saying the same thing."}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="max-w-4xl">
                <div className="section-kicker">{isZh ? "Workflow Library" : "Workflow Library"}</div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {isZh ? "围绕 Seedance 2 构建的核心内部链接集群" : "Core internal-link clusters built around Seedance 2 workflows"}
                </h2>
                <p className="mt-4 text-base leading-8 text-white/66 sm:text-lg">
                  {isZh
                    ? "这些页面不应该只是关键词入口，而应该成为具体任务的落地模板：让搜索用户直接找到适合自己的 AI 视频工作流。"
                    : "These pages should not exist as thin keyword bait. They should act as concrete production templates that map search intent to a relevant AI video workflow."}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {workflowLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="surface-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
                  >
                    <div className="text-lg font-semibold text-white">{link.title}</div>
                    <p className="mt-3 text-sm leading-7 text-white/64">{link.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="surface-panel px-6 py-7 md:px-8">
                <div className="section-kicker">{isZh ? "Why Teams Choose It" : "Why Teams Choose It"}</div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                  {isZh ? "真正的差异不在“能不能生成”，而在“能不能控制”。" : "The real distinction is not whether it generates, but whether it can be directed."}
                </h2>
                <div className="mt-5 space-y-4 text-sm leading-8 text-white/66">
                  <p>
                    {isZh
                      ? "很多 AI 视频工具能在演示里给你一段惊艳片段，但真正进入广告、短剧、角色一致性、分镜预演或产品展示流程之后，团队更看重的是参考控制、输入组织方式、镜头可重复性和任务恢复能力。"
                      : "Many AI video tools can produce one impressive demo clip, but once the workflow moves into advertising, short-form production, character consistency, previs, or product content, teams care more about reference control, input structure, repeatability, and recoverable jobs."}
                  </p>
                  <p>
                    {isZh
                      ? "这也是为什么这个站点会把 use cases、FAQ、法务页、支付页、公开视频示例和工作台放在同一个信息结构里。"
                      : "That is why this site keeps use cases, FAQ content, legal pages, pricing, public examples, and the workspace inside one coherent information architecture."}
                  </p>
                </div>
              </div>

              <div className="surface-panel px-6 py-7 md:px-8">
                <div className="section-kicker">{isZh ? "Buyer FAQ" : "Buyer FAQ"}</div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                  {isZh ? "如果你第一次评估这个站点，通常会先问这些问题。" : "If you are evaluating the site for the first time, these are the questions that matter."}
                </h2>
                <div className="mt-5 space-y-4">
                  {buyerFaqs.map((faq) => (
                    <div key={faq.question} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                      <div className="text-sm font-semibold text-white">{faq.question}</div>
                      <p className="mt-2 text-sm leading-7 text-white/64">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PricingSection locale={locale} />

      <section className="border-t border-white/6 py-20">
        <div className="container px-4 md:px-6">
          <div className="surface-panel mx-auto max-w-4xl px-6 py-10 text-center md:px-10">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t("cta_title")}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/64">{t("cta_subtitle")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={`${localePrefix}/sign-up`}
                className="rounded-lg bg-[#2563ff] px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#3b72ff]"
              >
                {t("cta_signup")}
              </Link>
              <Link
                href={`${localePrefix}/pricing`}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
              >
                {t("cta_pricing")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="surface-card p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/62">{desc}</p>
    </div>
  );
}
