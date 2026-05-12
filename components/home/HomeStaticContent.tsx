import { FAQSchema } from "@/components/breadcrumb-schema";

type Props = { locale: string };

export default async function HomeStaticContent({ locale }: Props) {
  const isZh = locale === "zh";

  const keySignals = [
    {
      title: isZh ? "什么是 Gemini Omni？" : "What is Gemini Omni?",
      body: isZh
        ? "Gemini Omni 可以理解为 Google 在多模态方向上的重要产品能力：让文字、图像、音频和视频在同一条创作链路里协同工作。"
        : "Gemini Omni can be understood as a key multimodal direction from Google, where text, images, audio, and video work together in one creation flow.",
    },
    {
      title: isZh ? "你可以期待什么体验" : "What kind of experience to expect",
      body: isZh
        ? "相比单一提示词生成，它更强调参考素材控制、镜头连续性和创作迭代效率。"
        : "Compared with one-shot prompt generation, it is expected to focus more on reference control, shot continuity, and iterative creation speed.",
    },
    {
      title: isZh ? "当前页面能帮你做什么" : "What this page helps you do now",
      body: isZh
        ? "先用一页看清能力边界、开放进展和替代工具，避免盲等或重复试错。"
        : "Understand capability boundaries, rollout progress, and available alternatives in one place so you can avoid blind waiting.",
    },
  ];

  const capabilityForecasts = [
    isZh ? "更高质量的视频细节与画面稳定性（预测）" : "Higher visual fidelity and frame stability (forecast)",
    isZh ? "更长时长下的语义一致性与镜头衔接（预测）" : "Longer semantic consistency and shot continuity (forecast)",
    isZh ? "图像、音频与文本之间更自然的联动生成（预测）" : "More natural cross-modal generation between image, audio, and text (forecast)",
    isZh ? "更适合团队协作的接口与工作流接入方式（预测）" : "API and workflow integration patterns better suited for teams (forecast)",
  ];

  const rolloutSteps = [
    {
      title: isZh ? "第一步：先理解适用场景" : "Step 1: Define your use case",
      body: isZh
        ? "先明确你要做的是广告短片、预演镜头、社媒素材，还是品牌内容。目标越清晰，后续迭代越快。"
        : "Decide whether you are creating ads, previs shots, social clips, or brand content. Clear goals lead to faster iteration.",
    },
    {
      title: isZh ? "第二步：提前整理参考素材" : "Step 2: Prepare your reference assets",
      body: isZh
        ? "建议提前准备关键画面、参考视频和音频片段，等能力开放后可以第一时间进入生产。"
        : "Prepare key frames, reference clips, and audio assets early so you can start production immediately when access expands.",
    },
    {
      title: isZh ? "第三步：关注开放节奏" : "Step 3: Track rollout timing",
      body: isZh
        ? "我们会持续更新 Gemini Omni 相关动态与可用状态，帮助你判断何时从测试切到正式使用。"
        : "We continuously update Gemini Omni status and launch signals so you can decide when to move from exploration to production.",
    },
    {
      title: isZh ? "第四步：先用可用工具验证想法" : "Step 4: Validate ideas with live tools",
      body: isZh
        ? "如果你现在就要出结果，可以先用已上线工具完成实验与提案，再迁移到 Gemini Omni。"
        : "If you need output right now, use live tools for experiments and client drafts, then migrate to Gemini Omni later.",
    },
  ];

  const faqs = [
    {
      question: isZh ? "Gemini Omni 现在可以直接用吗？" : "Can I use Gemini Omni directly right now?",
      answer: isZh
        ? "当前以逐步开放为主，不同能力的可用范围会变化。你可以先参考本页更新，按可用状态安排工作计划。"
        : "Access is rolling out in stages, and availability can change by feature. Use this page for updates and plan your workflow accordingly.",
    },
    {
      question: isZh ? "等待期间我该做哪些准备？" : "What should I prepare while waiting?",
      answer: isZh
        ? "优先整理参考素材与创作脚本，明确输出目标和风格约束。这样开放后可以直接进入高效率迭代。"
        : "Prioritize reference assets, creative scripts, and output constraints. This makes your first production iterations much faster.",
    },
    {
      question: isZh ? "如果我现在就要生成内容怎么办？" : "What if I need generated content now?",
      answer: isZh
        ? "你可以先使用页面中的在线工具进行视频或图像创作，先拿到可执行结果，再衔接后续能力升级。"
        : "You can start with the linked live tools for video or image creation now, then transition as Gemini Omni capabilities expand.",
    },
  ];

  return (
    <>
      <FAQSchema items={faqs} />

      <section id="overview" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="section-kicker">{isZh ? "产品概览" : "Product Overview"}</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {isZh ? "一页看懂 Gemini Omni 的方向与价值" : "Understand Gemini Omni in one page"}
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-8 text-white/66 sm:text-lg">
              {isZh
                ? "这不是只讲概念的落地页，而是面向真实创作流程的用户指南：先帮你判断值不值得用，再帮你准备怎么用。"
                : "This is not just a concept page. It is a user-facing guide for real creative workflows: decide if it fits, then prepare to use it effectively."}
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
            <div className="section-kicker">{isZh ? "能力预览" : "Capability Preview"}</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {isZh ? "你最关心的能力方向" : "Capability directions users care about"}
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
            <div className="section-kicker">{isZh ? "开放进展" : "Rollout Guide"}</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {isZh ? "现在到正式使用前，你可以这样准备" : "How to prepare before full access"}
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {rolloutSteps.map((step) => (
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
            <div className="section-kicker">{isZh ? "接口示例" : "API Example"}</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {isZh ? "接口调用示例（占位）" : "API call example (placeholder)"}
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-8 text-white/66 sm:text-lg">
              {isZh
                ? "下面示例用于帮助你提前理解接入方式。参数和地址以官方发布为准。"
                : "Use this sample to understand the integration shape early. Final endpoint and parameters will follow official releases."}
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
              {isZh ? "常见问题" : "Frequently asked questions"}
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
