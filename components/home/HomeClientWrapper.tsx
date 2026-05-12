'use client';

import { useState, type ReactNode } from 'react';
import HomeInteractive from './HomeInteractive';

interface HomeClientWrapperProps {
    heroHeading: ReactNode;
    heroSupport: ReactNode;
    staticContent: ReactNode;
    locale: string;
}

export default function HomeClientWrapper({ heroHeading, heroSupport, staticContent, locale }: HomeClientWrapperProps) {
    const [showStaticContent, setShowStaticContent] = useState(true);

    return (
        <div className="min-h-screen bg-background">
            <section
                id="top"
                className="relative overflow-hidden border-b border-white/6 pb-14 pt-10 lg:min-h-screen lg:pb-20 lg:pt-20"
            >
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,14,0.64)_0%,rgba(6,9,16,0.78)_36%,rgba(7,9,14,0.94)_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(95,160,255,0.28),transparent_34%),radial-gradient(circle_at_12%_20%,rgba(79,238,226,0.11),transparent_24%),radial-gradient(circle_at_86%_12%,rgba(255,132,214,0.10),transparent_24%)]" />
                    <div className="magic-mesh opacity-70" />
                </div>
                <div className="relative z-10 container px-4 md:px-6">
                    <div className="mx-auto flex max-w-6xl flex-col justify-center space-y-10 lg:min-h-[calc(100vh-11rem)] lg:space-y-14">
                        {heroHeading}
                        <HomeInteractive locale={locale} onShowStaticContent={setShowStaticContent} />
                        {heroSupport}
                    </div>
                </div>
            </section>

            {/* Static Content - only shown when no image is uploaded */}
            {showStaticContent && staticContent}
        </div>
    );
}
