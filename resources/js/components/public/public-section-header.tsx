import { Link } from '@inertiajs/react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    seeAllHref?: string;
    seeAllLabel?: string;
    centered?: boolean;
    light?: boolean;
}

export default function PublicSectionHeader({
    title,
    subtitle,
    seeAllHref,
    seeAllLabel = 'Lihat semua →',
    centered = false,
    light = false,
}: SectionHeaderProps) {
    return (
        <div className={`mb-8 flex items-end justify-between gap-4 ${centered ? 'flex-col items-center text-center' : ''}`}>
            <div>
                <h2 className={`text-2xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-[#1f5476]'}`}>
                    {title}
                </h2>
                {subtitle && (
                    <p className={`mt-1 text-sm ${light ? 'text-white/70' : 'text-gray-500'}`}>
                        {subtitle}
                    </p>
                )}
                <div className={`mt-2 h-0.5 w-12 rounded-full bg-[#2596be] ${centered ? 'mx-auto' : ''}`} />
            </div>
            {seeAllHref && (
                <Link
                    href={seeAllHref}
                    className={`shrink-0 text-sm font-semibold transition-colors ${
                        light
                            ? 'text-[#ffe100] hover:text-white'
                            : 'text-[#2596be] hover:text-[#1f5476]'
                    }`}
                >
                    {seeAllLabel}
                </Link>
            )}
        </div>
    );
}
