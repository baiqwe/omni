"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, PlayCircle, VolumeX } from "lucide-react";

type GalleryVideoCardProps = {
  locale: string;
  href: string;
  item: {
    id: string;
    categoryLabel: string;
    titleLabel: string;
    descriptionLabel: string;
    altLabel: string;
    afterImage: string;
    videoUrl: string;
    durationLabel: string;
    aspectRatioLabel: string;
    promptLabel: string;
  };
};

export function GalleryVideoCard({ locale, href, item }: GalleryVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  function startPreview() {
    setIsPreviewing(true);
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => {
      setIsPreviewing(false);
    });
  }

  function stopPreview() {
    setIsPreviewing(false);
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }

  return (
    <article
      className="group overflow-hidden rounded-[16px] border border-white/6 bg-[#121214] transition-all duration-300 hover:-translate-y-1 hover:border-white/12"
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted/20">
        <Image
          src={item.afterImage}
          alt={item.altLabel}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className={`object-cover transition-all duration-500 ease-out ${isPreviewing ? "scale-[1.035] opacity-0" : "scale-100 opacity-100 group-hover:scale-[1.045]"}`}
        />
        <video
          ref={videoRef}
          src={item.videoUrl}
          poster={item.afterImage}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${isPreviewing ? "opacity-100" : "opacity-0"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/28 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="rounded-full border border-white/10 bg-black/55 px-3 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-xl">
            {item.categoryLabel}
          </span>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-xs text-white/86 backdrop-blur-xl">
            {isPreviewing ? <VolumeX className="h-3.5 w-3.5" /> : <PlayCircle className="h-3.5 w-3.5" />}
            {isPreviewing ? (locale === "zh" ? "静音预览中" : "Muted preview") : (locale === "zh" ? "悬停播放" : "Hover to play")}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="text-lg font-semibold">{item.titleLabel}</div>
          <div className="mt-2 text-sm text-zinc-100">{item.descriptionLabel}</div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/80">
            <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1">1080p</span>
            <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1">{item.durationLabel}</span>
            <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1">{item.aspectRatioLabel}</span>
            <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1">{item.promptLabel}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 p-4">
        <div className="text-sm text-white/58">
          {locale === "zh" ? "点击直达上传区，直接试这个风格" : "Jump straight to the uploader and try this style"}
        </div>
        <Link
          href={href}
          aria-label={locale === "zh" ? `试试${item.titleLabel}风格` : `Try the ${item.titleLabel} style`}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-white/90"
        >
          {locale === "zh" ? "制作同款" : "Try this style"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
