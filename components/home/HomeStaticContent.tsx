import { FAQSchema } from "@/components/breadcrumb-schema";

type Props = { locale: string };

export default async function HomeStaticContent({ locale }: Props) {
  const isZh = locale === "zh";

  const keySignals = [
    {
      title: isZh ? "什么是 Gemini Omni？" : "What is Gemini Omni?",
      body: isZh
        ? "Gemini Omni 被普遍视作 Google 下一代多模态 AI 路线的重要节点，目标是打通文本、图像、音频与视频理解和生成。"
        : "Gemini Omni is widely viewed as a key milestone in Google's next-generation multimodal AI roadmap.",
    },
    {
      title: isZh ? "Google Omni Video Model 焦点" : "Google Omni Video Model focus",
      body: isZh
        ? "行业讨论重点集中在视频生成质量、时长一致性、跨模态对齐和实时交互能力，这些都决定了 Omni 模型的实际生产力。"
        : "Discussion centers on video quality, long-range coherence, cross-modal alignment, and real-time interaction.",
    },
    {
      title: isZh ? "为什么先做内容聚合页" : "Why build a content hub first",
      body: isZh
        ? "相比空白的 Coming Soon 页面，持续更新的 Gemini Omni 内容页更容易获得搜索引擎抓取和长尾关键词排名。"
        : "A living Gemini Omni content hub tends to get indexed faster than a blank coming-soon page.",
    },
  ];

  const capabilityForecasts = [
    isZh ? "高保真 4K 级视频生成能力（预测）" : "High-fidelity 4K-class generation (forecast)",
    isZh ? "更长时长的语义一致性与镜头连续性（预测）" : "Longer semantic coherence and shot continuity (forecast)",
    isZh ? "多模态实时理解与对话式视频创作（预测）" : "Real-time multimodal understanding and conversational video creation (forecast)",
    isZh ? "可结合企业工作流的 API 化调用路径（预测）" : "API-ready integration paths for production workflows (forecast)",
  ];

  const indexingSteps = [
    {
      title: "Google Search Console",
      body: isZh
        ? "验证域名后立即提交 sitemap，并对关键 URL 发起手动抓取请求。"
        : "Verify the domain, submit sitemap.xml, and request indexing for core URLs.",
    },
    {
      title: "Structured Data",
      body: isZh
        ? "在页面中标注 SoftwareApplication、FAQPage 和 WebSite 信息，帮助 Google 明确页面语义。"
        : "Mark the page with SoftwareApplication, FAQPage, and WebSite schema blocks.",
    },
    {
      title: "External Signals",
      body: isZh
        ? "通过 X/Twitter、产品矩阵站点和社区帖子增加初始外链与抓取信号。"
        : "Use X/Twitter, your product network, and community posts to seed crawl signals.",
    },
    {
      title: "Fresh Content Cadence",
      body: isZh
        ? "每 48-72 小时更新一次 Gemini Omni 进展摘要，持续触发重新抓取。"
        : "Publish a Gemini Omni update every 48-72 hours to trigger re-crawls.",
    },
  ];

  const faqs = [
    {
      question: isZh ? "Gemini Omni 现在可以直接调用 API 吗？" : "Is Gemini Omni API fully available now?",
      answer: isZh
        ? "当前页面主要用于追踪 Gemini Omni 与 Google Omni Video Model 的进展信号，官方 API 的开放节奏以 Google 公告为准。"
        : "This page tracks Gemini Omni and Google Omni Video Model rollout signals. Official API timing depends on Google announcements.",
    },
    {
      question: isZh ? "为什么页面里反复出现 Gemini Omni 关键词？" : "Why is Gemini Omni repeated frequently on the page?",
      answer: isZh
        ? "这是为了建立清晰的语义相关性，帮助搜索引擎理解页面主题，覆盖 how to access gemini omni 等检索意图。"
        : "It reinforces topical relevance for search engines and captures intent queries such as how to access Gemini Omni.",
    },
    {
      question: isZh ? "等待期间用户会流失吗？" : "Will users churn while waiting for launch?",
      answer: isZh
        ? "页面通过替代工具入口把等待流量导向现有产品，降低流量损耗并提升整体转化率。"
        : "The page routes waiting traffic to live tools, reducing churn and improving conversion efficiency.",
    },
  ];

  return (
    <>
      <FAQSchema items={faqs} />

      <section id="overview" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="section-kicker">{isZh ? "Gemini Omni Intelligence Hub" : "Gemini Omni Intelligence Hub"}</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {isZh ? "为 Gemini Omni 与 Google Omni Video Model 设计的首发承接页" : "A launch-ready page for Gemini Omni and Google Omni Video Model"}
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-8 text-white/66 sm:text-lg">
              {isZh
                ? "这里聚合 Gemini Omni 相关信息、能力预测和 SEO 实操清单，既满足快速收录，也承接“如何使用 Gemini Omni”类检索流量。"
                : "This hub aggregates Gemini Omni updates, capability forecasts, and SEO execution steps to capture launch-intent traffic."}
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {keySignals.map((item) => (
                <article key={item.title} className="surface-card p-6">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/65">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="border-y border-white/6 bg-[linear-gradient(180deg,#0b1022_0%,#0b0f1d_100%)] py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="section-kicker">{isZh ? "Capability Forecast" : "Capability Forecast"}</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {isZh ? "Gemini Omni 多模态能力预测" : "Gemini Omni multimodal capability forecast"}
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {capabilityForecasts.map((item) => (
                <div key={item} className="surface-panel p-6 text-sm leading-7 text-white/72">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="indexing" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="section-kicker">{isZh ? "Rapid Indexing Playbook" : "Rapid Indexing Playbook"}</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {isZh ? "Gemini Omni 站点快速收录执行清单" : "Fast indexing checklist for Gemini Omni pages"}
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {indexingSteps.map((step) => (
                <div key={step.title} className="surface-card p-6">
                  <h3 className="text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/66">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="api" className="border-y border-white/6 bg-[linear-gradient(180deg,#0a1221_0%,#0a0f1b_100%)] py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="section-kicker">{isZh ? "API Preview Block" : "API Preview Block"}</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {isZh ? "Gemini Omni API 调用预览（占位）" : "Gemini Omni API integration preview (placeholder)"}
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-8 text-white/66 sm:text-lg">
              {isZh
                ? "即使在等待正式开放阶段，也建议保留一个干净的 API 代码区块，有助于强化 Google Omni Video Model 与开发者意图关键词。"
                : "Even before official release, keeping a clean API block strengthens developer-intent keyword coverage."}
            </p>
            <pre className="mt-6 overflow-x-auto rounded-3xl border border-white/12 bg-black/30 p-5 text-xs leading-7 text-white/82 sm:text-sm">
{`// Placeholder: Gemini Omni video generation
const response = await fetch("https://api.google.com/gemini-omni/video:generate", {
  method: "POST",
  headers: {
    "Authorization": "Bearer <YOUR_API_KEY>",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gemini-omni-video",
    prompt: "Cinematic drone shot over a neon city at sunrise",
    duration: 8,
    aspectRatio: "16:9"
  })
});

const result = await response.json();
console.log(result);`}
            </pre>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="section-kicker">FAQ</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {isZh ? "Gemini Omni 常见问题" : "Gemini Omni frequently asked questions"}
            </h2>
            <div className="mt-8 grid gap-4">
              {faqs.map((faq) => (
                <article key={faq.question} className="surface-card p-6">
                  <h3 className="text-base font-semibold text-white">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/66">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
