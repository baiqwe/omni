import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { getLocalizedGalleryItems } from "@/config/gallery";
import type { AnimeStyleId } from "@/config/landing-pages";

type InspirationGalleryProps = {
  locale: string;
  style?: AnimeStyleId;
  anchorHrefPrefix?: string;
  maxItems?: number;
};

export function InspirationGallery({
  locale,
  style,
  anchorHrefPrefix,
  maxItems = 6,
}: InspirationGalleryProps) {
  const items = getLocalizedGalleryItems(locale, style).slice(0, maxItems);

  return (
    <section id="showcase" className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(6,10,20,0.98),rgba(5,8,18,0.92))] py-20">
      <div className="container px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="max-w-3xl space-y-3">
            <div className="section-kicker">
              {locale === "zh" ? "灵感画廊" : "Inspiration Gallery"}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {locale === "zh" ? "看看多模态输入如何变成可复用的视频模板" : "See how multi-modal inputs become reusable video patterns"}
            </h2>
            <p className="text-lg text-white/64">
              {locale === "zh"
                ? "当前先用静态封面承载未来的视频案例。等真实输出接入后，这里会自然升级成悬停即播的视频瀑布流。"
                : "These cards currently use still covers as placeholders. Once live outputs land, this section can graduate into hover-play video masonry."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const href = anchorHrefPrefix
                ? `${anchorHrefPrefix}#anime-uploader`
                : `/${locale}/${item.slug}#anime-uploader`;

              return (
                <article
                  key={item.id}
                  className="group surface-card overflow-hidden border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-300/25 hover:shadow-[0_28px_70px_-38px_rgba(34,211,238,0.2)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted/20">
                    <Image
                      src={item.afterImage}
                      alt={item.altLabel}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                      <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-xl">
                        {item.categoryLabel}
                      </span>
                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs text-white/86 backdrop-blur-xl">
                        <PlayCircle className="h-3.5 w-3.5" />
                        {locale === "zh" ? "视频样例" : "Video sample"}
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <div className="text-lg font-semibold">{item.titleLabel}</div>
                      <div className="mt-2 text-sm text-zinc-100">{item.descriptionLabel}</div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/80">
                        <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1">1080p</span>
                        <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1">5s</span>
                        <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1">Prompt + refs</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 p-5">
                    <div className="text-sm text-white/58">
                      {locale === "zh" ? "点击直达上传区，直接试这个风格" : "Jump straight to the uploader and try this style"}
                    </div>
                    <Link
                      href={href}
                      aria-label={
                        locale === "zh"
                          ? `试试${item.titleLabel}风格`
                          : `Try the ${item.titleLabel} style`
                      }
                      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 shadow-[0_18px_30px_-18px_rgba(255,255,255,0.4)] transition-colors hover:bg-cyan-100"
                    >
                      {locale === "zh" ? "制作同款" : "Try this style"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
