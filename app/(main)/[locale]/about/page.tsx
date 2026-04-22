import Link from "next/link";
import { Metadata } from "next";
import { site } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Shield, Zap } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { buildLocaleAlternates } from "@/utils/seo/metadata";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  const isZh = locale === "zh";

  const title = isZh ? `关于我们 | ${site.siteName}` : `About | ${site.siteName}`;
  const description = isZh
    ? "我们在把现有 AI 工具脚手架改造成 Seedance 2 风格的多模态视频生成工作台。"
    : "We are transforming this AI starter into a Seedance-style multi-modal video creation workspace.";

  const ogImage = new URL(site.ogImagePath, site.siteUrl).toString();

  return {
    title,
    description,
    alternates: buildLocaleAlternates(`/${locale}/about`),
    openGraph: {
      title,
      description,
      type: "website",
      url: new URL(`/${locale}/about`, site.siteUrl).toString(),
      siteName: site.siteName,
      images: [{ url: ogImage, width: 512, height: 512, alt: site.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const { locale } = params;
  const isZh = locale === "zh";
  const localePrefix = `/${locale}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 md:px-6 py-4">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href={localePrefix}>
              <ArrowLeft className="h-4 w-4" />
              {isZh ? "返回首页" : "Back to Home"}
            </Link>
          </Button>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-10">
          <Breadcrumbs
            items={[
              { name: isZh ? "首页" : "Home", href: localePrefix },
              { name: isZh ? "关于我们" : "About", href: `${localePrefix}/about` },
            ]}
          />
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {isZh ? `关于 ${site.siteName}` : `About ${site.siteName}`}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isZh
                ? "把图片、视频、音频与文本放进同一个创作工作台，服务更可控的视频生成流程。"
                : "Bring images, videos, audio, and text into one workspace built for more controllable video generation."}
            </p>
            <p className="text-sm text-muted-foreground">
              {isZh
                ? `${site.siteName} 当前聚焦于多模态输入、参考驱动控制、异步任务流和视频生产体验，而不是停留在单一 prompt 工具。`
                : `${site.siteName} now focuses on multi-modal input, reference-driven control, async job orchestration, and a production-ready video workflow rather than a single-prompt toy.`}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {isZh ? "参考优先" : "Reference First"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {isZh ? "让图像、视频、音频和文字共同决定结果，而不是只靠一句 prompt。" : "Let images, video, audio, and text guide the output together instead of relying on one prompt."}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-primary" />
                  {isZh ? "任务流优先" : "Workflow First"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {isZh ? "工作台 → 素材 staging → 额度估算 → 异步生成 → 继续延展。" : "Workspace → staging → credit estimate → async generation → extend and iterate."}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  {isZh ? "透明说明" : "Transparent Policy"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {isZh
                  ? "接入真实生成能力后，素材应先进入受控存储，再转发到选定的视频模型服务。"
                  : "Once live generation is connected, uploads should be staged in controlled storage before provider handoff."}
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              {isZh
                ? `商务、版权或支持问题可联系：${site.supportEmail}`
                : `For support, rights, or business inquiries, contact: ${site.supportEmail}`}
            </p>
            <Button asChild size="lg">
              <Link href={`${localePrefix}`}>{isZh ? "打开工作台" : "Open Workspace"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
