'use client';

import { useState, type ReactNode } from 'react';
import HomeInteractive from './HomeInteractive';
import { useUser } from '@/hooks/use-user';

interface HomeClientWrapperProps {
    heroHeading: ReactNode;
    heroSupport: ReactNode;
    staticContent: ReactNode;
}

export default function HomeClientWrapper({ heroHeading, heroSupport, staticContent }: HomeClientWrapperProps) {
    const [showStaticContent, setShowStaticContent] = useState(true);
    const { user } = useUser();

    return (
        <div className="min-h-screen bg-background">
            <section
                id="anime-uploader"
                className="relative overflow-hidden border-b border-white/6 pb-14 pt-10 lg:min-h-screen lg:pb-20 lg:pt-20"
            >
                <div className="pointer-events-none absolute inset-0">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover opacity-28"
                        poster="/images/gallery/hero-after.jpg"
                    >
                        <source src="/videos/gallery/reference-led.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,15,0.34)_0%,rgba(7,11,19,0.48)_16%,rgba(9,12,19,0.64)_48%,rgba(8,9,14,0.88)_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(126,169,255,0.24),transparent_26%),radial-gradient(circle_at_18%_18%,rgba(73,222,225,0.12),transparent_18%),radial-gradient(circle_at_82%_14%,rgba(148,92,255,0.12),transparent_20%)]" />
                </div>
                <div className="relative z-10 container px-4 md:px-6">
                    <div className="mx-auto flex max-w-6xl flex-col justify-center space-y-10 lg:min-h-[calc(100vh-11rem)] lg:space-y-14">
                        {heroHeading}
                        <HomeInteractive onShowStaticContent={setShowStaticContent} user={user} />
                        {heroSupport}
                    </div>
                </div>
            </section>

            {/* Static Content - only shown when no image is uploaded */}
            {showStaticContent && staticContent}
        </div>
    );
}
