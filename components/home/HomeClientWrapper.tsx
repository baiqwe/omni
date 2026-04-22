'use client';

import { useState, type ReactNode } from 'react';
import HomeInteractive from './HomeInteractive';
import { useUser } from '@/hooks/use-user';

interface HomeClientWrapperProps {
    heroContent: ReactNode;
    staticContent: ReactNode;
}

export default function HomeClientWrapper({ heroContent, staticContent }: HomeClientWrapperProps) {
    const [showStaticContent, setShowStaticContent] = useState(true);
    const { user } = useUser();

    return (
        <div className="min-h-screen bg-background">
            <section id="anime-uploader" className="relative overflow-hidden border-b border-white/10 py-12 lg:py-20">
                <div className="magic-mesh" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_30%),linear-gradient(180deg,rgba(4,7,16,0.94),rgba(6,9,18,0.98))]" />
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-6xl space-y-10">
                        {heroContent}
                        <HomeInteractive onShowStaticContent={setShowStaticContent} user={user} />
                    </div>
                </div>
            </section>

            {/* Static Content - only shown when no image is uploaded */}
            {showStaticContent && staticContent}
        </div>
    );
}
