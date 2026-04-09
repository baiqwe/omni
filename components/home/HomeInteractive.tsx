'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { AnimeImageEditor } from '@/components/feature/anime-image-editor';
import type { AnimeStyleId } from '@/config/landing-pages';
import { HeroStylePreview } from '@/components/gallery/HeroStylePreview';

interface HomeInteractiveProps {
    onShowStaticContent: (show: boolean) => void;
    user?: any;
}

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
    const t = useTranslations('hero');
    const pathname = usePathname();
    const pathParts = pathname?.split('/') || [];
    const locale = (pathParts[1] === 'en' || pathParts[1] === 'zh') ? pathParts[1] : 'en';

    return (
        <section id="anime-uploader" className="relative overflow-hidden py-12 lg:py-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(227,104,74,0.12),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(27,163,147,0.12),transparent_20%)]" />
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-6xl space-y-10">
                    <div className="text-center space-y-5">
                        <div className="section-kicker">
                            {t('badge')}
                        </div>
                        <h1 className="mx-auto max-w-5xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                            {t('title')}{" "}
                            <span className="bg-gradient-to-r from-primary via-[#c66044] to-[#1ba393] bg-clip-text text-transparent">{t('title_highlight')}</span>
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
                            {t('subtitle')}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-sm text-muted-foreground">
                            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-4 py-2 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-[#1c9f6b]"></span>
                                {t('feature_1')}
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-4 py-2 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-[#1ba393]"></span>
                                {t('feature_2')}
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-4 py-2 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-primary"></span>
                                {t('feature_3')}
                            </div>
                        </div>
                    </div>

                    <AnimeImageEditor
                        locale={locale}
                        user={user}
                        title={t('tool_title')}
                        subtitle={t('tool_subtitle')}
                        defaultStyle={"standard" as AnimeStyleId}
                        hideStyleSelector={false}
                        onImageUploaded={(uploaded) => onShowStaticContent(!uploaded)}
                        compact={false}
                        emptyAside={<HeroStylePreview locale={locale} />}
                    />
                </div>
            </div>
        </section>
    );
}

// Export visibility control hook for parent component
export function useHomeInteractive() {
    return { showStaticContent: true, setShowStaticContent: () => {} };
}
