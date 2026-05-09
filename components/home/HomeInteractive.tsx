'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, Paperclip, PlayCircle, Settings2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from '@/i18n/routing';
import {
    KIE_SEEDANCE_SUPPORTED_DURATIONS,
    KIE_SEEDANCE_SUPPORTED_RATIOS,
    type VideoModelId
} from '@/utils/video-generation';

interface HomeInteractiveProps {
    onShowStaticContent: (show: boolean) => void;
    user?: any;
}

const MODE_TABS = {
    zh: [
        { key: 'seedance-2', label: 'Seedance 2' },
        { key: 'image-to-video', label: '图生视频' },
        { key: 'text-to-video', label: '文生视频' },
    ],
    en: [
        { key: 'seedance-2', label: 'Seedance 2' },
        { key: 'image-to-video', label: 'Image to Video' },
        { key: 'text-to-video', label: 'Text to Video' },
    ],
} as const;

const RATIO_OPTIONS = KIE_SEEDANCE_SUPPORTED_RATIOS;
const DURATION_OPTIONS = KIE_SEEDANCE_SUPPORTED_DURATIONS.map((value) => `${value}s`) as readonly string[];
const VIDEO_MODELS: Array<{ value: VideoModelId; labelZh: string; labelEn: string }> = [
    { value: 'bytedance/seedance-2', labelZh: 'Seedance 2', labelEn: 'Seedance 2' },
    { value: 'bytedance/seedance-2-fast', labelZh: 'Seedance 2 Fast', labelEn: 'Seedance 2 Fast' },
];

const MODE_COPY = {
    zh: {
        'seedance-2': {
            eyebrow: 'Seedance 2 工作流',
            placeholder: '写下你的 Seedance 2 视频场景，比如人物、镜头运动、节奏和氛围...',
            helper: '先输入一句核心想法，再按需补充图片、视频或音频参考。',
        },
        'image-to-video': {
            eyebrow: '图生视频',
            placeholder: '描述这张图片如何动起来，包括镜头、动作、光线和节奏...',
            helper: '适合角色一致性、产品展示和把静帧扩展成连续镜头。',
        },
        'text-to-video': {
            eyebrow: '文生视频',
            placeholder: '直接描述一个 Seedance 2 视频场景，包含主体、镜头和氛围...',
            helper: '适合快速验证概念，再继续补参考素材提升可控性。',
        },
    },
    en: {
        'seedance-2': {
            eyebrow: 'Seedance 2 workflow',
            placeholder: 'Describe your Seedance 2 scene, including the subject, camera move, pacing, and atmosphere...',
            helper: 'Start with one strong idea, then add image, video, or audio references only when needed.',
        },
        'image-to-video': {
            eyebrow: 'Image to Video',
            placeholder: 'Describe how this still image should move, including motion, framing, lighting, and timing...',
            helper: 'Great for character consistency, product shots, and extending still frames into cinematic motion.',
        },
        'text-to-video': {
            eyebrow: 'Text to Video',
            placeholder: 'Describe a Seedance 2 video concept with subject, camera movement, mood, and pacing...',
            helper: 'Best for quick concept testing before adding references for tighter control.',
        },
    },
} as const;

export default function HomeInteractive({ onShowStaticContent, user }: HomeInteractiveProps) {
    return (
        <HeroWithUploadSection onShowStaticContent={onShowStaticContent} user={user} />
    );
}

function HeroWithUploadSection({
    onShowStaticContent,
    user
}: {
    onShowStaticContent: (show: boolean) => void;
    user?: any;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const pathParts = pathname?.split('/') || [];
    const locale = (pathParts[1] === 'en' || pathParts[1] === 'zh') ? pathParts[1] : 'en';
    const isZh = locale === 'zh';
    const [ratio, setRatio] = useState<(typeof RATIO_OPTIONS)[number]>('16:9');
    const [duration, setDuration] = useState<(typeof DURATION_OPTIONS)[number]>('15s');
    const [activeTab, setActiveTab] = useState<string>('seedance-2');
    const [videoModel, setVideoModel] = useState<VideoModelId>('bytedance/seedance-2');
    const copy = MODE_COPY[isZh ? 'zh' : 'en'];
    const [prompt, setPrompt] = useState('');

    void user;

    const tabs = useMemo(() => MODE_TABS[isZh ? 'zh' : 'en'], [isZh]);
    const modeCopy = copy[activeTab as keyof typeof copy] ?? copy['seedance-2'];

    useEffect(() => {
        onShowStaticContent(true);
    }, [onShowStaticContent]);

    const openCreationCenter = () => {
        const params = new URLSearchParams();

        if (prompt.trim()) params.set('prompt', prompt.trim());
        params.set('model', videoModel);
        params.set('mode', activeTab);
        params.set('ratio', ratio);
        params.set('duration', duration);

        const query = params.toString();
        router.push(query ? `/creative-center?${query}` : `/creative-center`);
    };

    return (
        <div className="space-y-8">
            <div className="mx-auto w-full max-w-4xl">
                <div className="mx-auto mb-5 flex w-fit flex-wrap items-center justify-center gap-2 rounded-full border border-white/12 bg-black/28 p-1.5 shadow-[0_18px_46px_-28px_rgba(0,0,0,0.82)] backdrop-blur-2xl">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                'rounded-full px-4 py-2 text-sm font-medium transition-all',
                                activeTab === tab.key
                                    ? 'bg-white text-slate-950 shadow-[0_10px_30px_-16px_rgba(255,255,255,0.9)]'
                                    : 'text-white/74 hover:bg-white/[0.08] hover:text-white'
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="overflow-hidden rounded-[34px] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))] shadow-[0_30px_90px_-40px_rgba(0,0,0,0.84)] backdrop-blur-[28px]">
                    <div className="border-b border-white/10 px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/52">
                                    {modeCopy.eyebrow}
                                </div>
                                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1 text-sm font-medium text-white/90">
                                    {VIDEO_MODELS.map((model) => (
                                        <button
                                            key={model.value}
                                            type="button"
                                            onClick={() => setVideoModel(model.value)}
                                            className={cn(
                                                'rounded-full px-3 py-1.5 transition-colors',
                                                videoModel === model.value
                                                    ? 'bg-white text-slate-950'
                                                    : 'text-white/74 hover:bg-white/[0.08] hover:text-white'
                                            )}
                                        >
                                            {isZh ? model.labelZh : model.labelEn}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={openCreationCenter}
                                        className="ml-1 inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-white/52 hover:text-white/80"
                                        aria-label={isZh ? '前往创作中心选择更多模型设置' : 'Open creation center for more model settings'}
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/62 sm:inline-flex">
                                    {isZh ? '多模态 AI 视频生成器' : 'Multi-modal AI video generator'}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {RATIO_OPTIONS.length === 1 ? (
                                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/72">
                                        {RATIO_OPTIONS[0]}
                                    </div>
                                ) : (
                                    RATIO_OPTIONS.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setRatio(option)}
                                            className={cn(
                                                'rounded-full border px-3 py-1 text-xs transition-colors',
                                                ratio === option
                                                    ? 'border-white/18 bg-white text-slate-950'
                                                    : 'border-white/10 bg-white/[0.04] text-white/72 hover:bg-white/[0.09]'
                                            )}
                                        >
                                            {option}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid items-stretch gap-0 lg:grid-cols-[minmax(0,1fr)_auto]">
                        <div className="px-5 py-4">
                            <textarea
                                value={prompt}
                                onChange={(event) => setPrompt(event.target.value)}
                                className="min-h-[92px] w-full resize-none border-0 bg-transparent text-center text-base leading-8 text-white outline-none placeholder:text-white/36 sm:text-lg"
                                placeholder={modeCopy.placeholder}
                            />
                        </div>

                        <div className="flex items-center justify-center gap-2 border-t border-white/10 px-4 py-4 lg:border-l lg:border-t-0">
                            <button
                                type="button"
                                onClick={openCreationCenter}
                                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] text-white/82 transition-colors hover:bg-white/[0.11] hover:text-white"
                                aria-label={isZh ? '上传参考素材' : 'Upload references'}
                            >
                                <Paperclip className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={openCreationCenter}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#2563ff,#6d28d9)] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_-18px_rgba(59,130,246,0.65)] transition-transform hover:scale-[1.01]"
                            >
                                <Sparkles className="h-4 w-4" />
                                {isZh ? '开始生成' : 'Generate'}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 border-t border-white/10 px-4 py-3">
                        <button
                            type="button"
                            onClick={openCreationCenter}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/78 transition-colors hover:bg-white/[0.08] hover:text-white"
                        >
                            <Paperclip className="h-3.5 w-3.5" />
                            {isZh ? '图片 / 视频 / 音频参考' : 'Image / Video / Audio references'}
                        </button>
                        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/62">
                            <span>{isZh ? '时长' : 'Duration'}</span>
                            {DURATION_OPTIONS.length === 1 ? (
                                <span className="rounded-full bg-white px-2 py-0.5 text-slate-950">{DURATION_OPTIONS[0]}</span>
                            ) : (
                                DURATION_OPTIONS.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setDuration(option)}
                                        className={cn(
                                            'rounded-full px-2 py-0.5 transition-colors',
                                            duration === option
                                                ? 'bg-white text-slate-950'
                                                : 'text-white/72 hover:bg-white/[0.08] hover:text-white'
                                        )}
                                    >
                                        {option}
                                    </button>
                                ))
                            )}
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/58">
                            {isZh ? '当前按 Kie 支持集展示 720p / 16:9 / 15s' : 'Showing the current Kie-supported set: 720p / 16:9 / 15s'}
                        </div>
                        <button
                            type="button"
                            onClick={openCreationCenter}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/68 transition-colors hover:bg-white/[0.08] hover:text-white"
                        >
                            <Settings2 className="h-3.5 w-3.5" />
                            {isZh ? '高级设置' : 'Advanced settings'}
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex flex-col items-center gap-3 text-center text-sm text-white/66">
                    <p className="max-w-3xl text-balance leading-7">
                        {modeCopy.helper}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={openCreationCenter}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-white/78 transition-colors hover:bg-white/[0.08] hover:text-white"
                        >
                            <PlayCircle className="h-4 w-4" />
                            {isZh ? '进入创作中心' : 'Open creation center'}
                        </button>
                        <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-white/62">
                            {isZh ? '支持图生视频、文生视频、动作参考和视频延展。' : 'Supports image to video, text to video, reference motion, and video extension.'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function useHomeInteractive() {
    return { showStaticContent: true, setShowStaticContent: () => {} };
}
