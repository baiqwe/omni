import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AudioLines, Clapperboard, Layers3, Orbit, Radar, Shield, Sparkles, Wand2 } from "lucide-react";
import type { ReactNode } from "react";
import { InspirationGallery } from "@/components/gallery/InspirationGallery";
import { PricingSection } from "@/components/marketing/pricing-section";

type Props = { locale: string };

export default async function HomeStaticContent({ locale }: Props) {
  const isZh = locale === "zh";
  const t = await getTranslations({ locale, namespace: "home_static" });
  const localePrefix = `/${locale}`;

  return (
    <>
      <section className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(6,10,20,0.98),rgba(7,11,20,0.92))] py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Layers3 className="w-6 h-6 text-cyan-200" />}
                title={t("f1_title")}
                desc={t("f1_desc")}
              />
              <FeatureCard
                icon={<Orbit className="w-6 h-6 text-fuchsia-200" />}
                title={t("f2_title")}
                desc={t("f2_desc")}
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6 text-emerald-200" />}
                title={t("f3_title")}
                desc={t("f3_desc")}
              />
            </div>
          </div>
        </div>
      </section>

      <InspirationGallery locale={locale} maxItems={4} />

      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <div className="section-kicker">{isZh ? "核心能力" : "Key Features"}</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("styles_title")}</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t("styles_subtitle")}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Sparkles className="w-6 h-6 text-cyan-200" />}
                title={isZh ? "Reference Anything" : "Reference Anything"}
                desc={isZh ? "参考镜头、角色、场景、音轨与动作轨迹，把抽象意图压缩成明确控制。" : "Reference camera movement, character identity, scene language, and audio intent in one promptable system."}
              />
              <FeatureCard
                icon={<Clapperboard className="w-6 h-6 text-fuchsia-200" />}
                title={isZh ? "Precise Motion Control" : "Precise Motion Control"}
                desc={isZh ? "上传一段动作或运镜视频，就能把复杂编舞和镜头语言迁移到新的主体上。" : "Transfer choreography, motion rhythm, and cinematic camera paths from uploaded clips into new scenes."}
              />
              <FeatureCard
                icon={<AudioLines className="w-6 h-6 text-emerald-200" />}
                title={isZh ? "Built-in Audio Logic" : "Built-in Audio Logic"}
                desc={isZh ? "支持音频输入、节奏对齐与后续的音效生成，使视频不只是动起来，而是完整成片。" : "Support beat-aware timing and audio-guided direction so the output feels like an edited piece, not a mute render."}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <div className="section-kicker">{isZh ? "使用场景" : "Use Cases"}</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("use_title")}</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t("use_subtitle")}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Radar className="w-6 h-6 text-cyan-200" />}
                title={t("u1_title")}
                desc={t("u1_desc")}
              />
              <FeatureCard
                icon={<Clapperboard className="w-6 h-6 text-fuchsia-200" />}
                title={t("u2_title")}
                desc={t("u2_desc")}
              />
              <FeatureCard
                icon={<Wand2 className="w-6 h-6 text-emerald-200" />}
                title={t("u3_title")}
                desc={t("u3_desc")}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(5,8,18,0.98),rgba(7,11,21,0.94))] py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <div className="section-kicker">{isZh ? "三步上手" : "How It Works"}</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("faq_title")}</h2>
              <p className="text-muted-foreground text-lg">{t("faq_subtitle")}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                { q: t("faq1_q"), a: t("faq1_a") },
                { q: t("faq2_q"), a: t("faq2_a") },
                { q: t("faq3_q"), a: t("faq3_a") },
              ].map((item, idx) => (
                <div key={idx} className="surface-card space-y-4 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-sm font-bold text-cyan-100">
                    {idx + 1}
                  </div>
                  <div className="text-lg font-bold">{item.q}</div>
                  <div className="text-muted-foreground leading-relaxed">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PricingSection locale={locale} />

      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-5xl space-y-10">
            <div className="text-center space-y-3">
              <div className="section-kicker">{isZh ? "创作者证言" : "Testimonials"}</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {isZh ? "这类工具真正打动人的，是它能把工作流缩短成一次尝试" : "What lands with creators is not novelty, but the shortened loop from idea to moving image"}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <QuoteCard
                quote={isZh ? "我最需要的是角色一致性和镜头参考，不是再一个只能靠玄学 prompt 的视频工具。" : "What I need is shot reference and character consistency, not another model that behaves like a slot machine."}
                author={isZh ? "广告导演" : "Commercial director"}
              />
              <QuoteCard
                quote={isZh ? "把样片节奏、产品图和一句自然语言说明塞进同一个工作台，这个心智模型很对。" : "Putting sample motion, product stills, and one natural-language brief in the same workspace is exactly the right mental model."}
                author={isZh ? "品牌内容负责人" : "Brand content lead"}
              />
              <QuoteCard
                quote={isZh ? "如果视频延展、局部编辑和音频节奏都在同一条链路里，创作效率会比纯文本视频生成高很多。" : "If extension, partial edits, and audio timing live in the same flow, production speed jumps way beyond plain text-to-video."}
                author={isZh ? "短片制作人" : "Short-form producer"}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(7,11,21,0.98),rgba(5,8,18,0.92))] py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <div className="section-kicker">FAQ</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {isZh ? "上线前用户最关心的问题" : "The questions users will ask before they trust the tool"}
              </h2>
            </div>
            <div className="grid gap-6">
              {[
                { q: t("faq4_q"), a: t("faq4_a") },
                {
                  q: isZh ? "现在可以直接生成真实视频了吗？" : "Can this branch generate real videos already?",
                  a: isZh ? "当前优先完成 Seedance 2 的站点形态、工作台状态与后续任务流准备。真实模型接入会放在下一阶段。" : "This branch prioritizes the Seedance 2 site shell, workspace states, and async job preparation first. Live model inference is the next phase."
                },
                {
                  q: isZh ? "积分怎么计算更合理？" : "How should credits be priced?",
                  a: isZh ? "建议按分辨率、时长和模式动态计费，而不是一刀切固定扣费，这样更接近真实视频生成成本。" : "Credits should be dynamic by resolution, duration, and workflow mode instead of a flat per-generation charge."
                },
              ].map((item, idx) => (
                <div key={idx} className="surface-card space-y-2 p-6">
                  <div className="text-lg font-bold">{item.q}</div>
                  <div className="text-muted-foreground leading-relaxed">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="surface-panel mx-auto max-w-4xl space-y-6 px-6 py-10 text-center md:px-10">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("cta_title")}</h2>
            <p className="text-muted-foreground text-lg">{t("cta_subtitle")}</p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href={`${localePrefix}/sign-up`}
                className="rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground shadow-[0_22px_40px_-24px_hsl(var(--primary))] transition-colors hover:bg-primary/90"
              >
                {t("cta_signup")}
              </Link>
              <Link
                href={`${localePrefix}/pricing`}
                className="rounded-full border border-border bg-background px-8 py-4 font-medium transition-colors hover:bg-muted/30"
              >
                {t("cta_pricing")}
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">{isZh ? "当前分支先交付产品形态与前端工作流，下一步继续接真实任务系统。" : "This branch ships the product shape and frontend workflow first, then continues into the live job system."}</p>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="surface-card border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(34,211,238,0.14),rgba(236,72,153,0.12))]">{icon}</div>
      <div className="text-xl font-bold mb-2">{title}</div>
      <div className="text-muted-foreground">{desc}</div>
    </div>
  );
}

function QuoteCard({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="surface-card border-white/10 bg-white/[0.03] p-6">
      <p className="text-base leading-7 text-foreground/88">“{quote}”</p>
      <div className="mt-5 text-sm uppercase tracking-[0.22em] text-muted-foreground">{author}</div>
    </div>
  );
}
