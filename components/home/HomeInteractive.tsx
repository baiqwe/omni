'use client';

import { usePathname } from 'next/navigation';
import { MultiModalWorkspace } from '@/components/feature/multi-modal-workspace';

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
    const pathname = usePathname();
    const pathParts = pathname?.split('/') || [];
    const locale = (pathParts[1] === 'en' || pathParts[1] === 'zh') ? pathParts[1] : 'en';

    void onShowStaticContent;
    void user;

    return (
        <MultiModalWorkspace locale={locale} />
    );
}

// Export visibility control hook for parent component
export function useHomeInteractive() {
    return { showStaticContent: true, setShowStaticContent: () => {} };
}
