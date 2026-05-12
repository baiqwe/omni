'use client';

import { useEffect } from 'react';
import { ArrowUpRight, CalendarClock, Globe2, Sparkles } from 'lucide-react';

interface HomeInteractiveProps {
  onShowStaticContent: (show: boolean) => void;
}

export default function HomeInteractive({ onShowStaticContent }: HomeInteractiveProps) {
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
              Gemini Omni Early Access Signal
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white md:text-3xl">
              Gemini Omni API integration in progress
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
              We publish fresh context around Google Gemini Omni, multimodal video trends, and rollout signals so
              teams can monitor launch timing and prepare implementation decisions early.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="#indexing"
                className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.06] px-4 py-2 text-sm text-white transition-colors hover:bg-white/[0.12]"
              >
                <CalendarClock className="h-4 w-4" />
                View indexing checklist
              </a>
              <a
                href="#api"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/12 px-4 py-2 text-sm text-cyan-100 transition-colors hover:bg-cyan-400/20"
              >
                <Globe2 className="h-4 w-4" />
                Open API preview block
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/26 p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-white/45">Traffic Bridge</div>
            <div className="mt-2 text-lg font-semibold text-white">Bai&apos;s AI Toolset</div>
            <p className="mt-2 text-sm leading-7 text-white/65">
              While Gemini Omni is rolling out, route intent traffic to live tools and keep acquisition ROI positive.
            </p>
            <div className="mt-4 space-y-2">
              <OutboundCard href="https://animeify.co" label="Animeify.co" desc="AI anime transformation" />
              <OutboundCard href="https://wingdings.co" label="Wingdings" desc="Fast translation assistant" />
              <OutboundCard href="https://randomobject.co" label="Random Generator" desc="Instant idea catalyst" />
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
