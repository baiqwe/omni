'use client';

import { useEffect } from 'react';
import { ArrowUpRight, CalendarClock, Globe2, Sparkles } from 'lucide-react';

interface HomeInteractiveProps {
  locale: string;
  onShowStaticContent: (show: boolean) => void;
}

export default function HomeInteractive({ locale, onShowStaticContent }: HomeInteractiveProps) {
  const isZh = locale === 'zh';

  useEffect(() => {
    onShowStaticContent(true);
  }, [onShowStaticContent]);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="surface-panel overflow-hidden border-white/12 px-6 py-6 md:px-8 md:py-7">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/72">
              <Sparkles className="h-3.5 w-3.5" />
              {isZh ? '抢先关注' : 'Early Access Watch'}
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white md:text-3xl">
              {isZh ? 'Gemini Omni 功能正在逐步开放' : 'Gemini Omni features are rolling out'}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
              {isZh
                ? '你可以先在这里了解能力边界、使用场景和最新进展，等官方能力全面开放后再无缝切换到正式工作流。'
                : 'Use this page to understand capabilities, practical use cases, and rollout progress, then switch to full workflows as official access expands.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="#indexing"
                className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.06] px-4 py-2 text-sm text-white transition-colors hover:bg-white/[0.12]"
              >
                <CalendarClock className="h-4 w-4" />
                {isZh ? '查看开放进展' : 'View rollout updates'}
              </a>
              <a
                href="#api"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/12 px-4 py-2 text-sm text-cyan-100 transition-colors hover:bg-cyan-400/20"
              >
                <Globe2 className="h-4 w-4" />
                {isZh ? '查看接口示例' : 'See API example'}
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/26 p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-white/45">{isZh ? '现在可体验' : 'Available Now'}</div>
            <div className="mt-2 text-lg font-semibold text-white">{isZh ? '先体验这两个在线工具' : 'Try these live tools first'}</div>
            <p className="mt-2 text-sm leading-7 text-white/65">
              {isZh
                ? '如果你现在就想做视频实验或图片创作，可以先从下面两个产品开始，不用等待。'
                : 'If you want to create right away, start with the two products below while Gemini Omni access expands.'}
            </p>
            <div className="mt-4 space-y-2">
              <OutboundCard
                href="https://seedance2video.cc"
                label="Seedance2Video"
                desc={isZh ? '在线 AI 视频生成体验' : 'Online AI video generation'}
              />
              <OutboundCard
                href="https://gptimage2.online"
                label="GPTImage2"
                desc={isZh ? '在线 AI 图像创作体验' : 'Online AI image creation'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutboundCard({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm transition-colors hover:bg-white/[0.1]"
    >
      <div>
        <div className="font-medium text-white">{label}</div>
        <div className="text-xs text-white/60">{desc}</div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-white/70" />
    </a>
  );
}
