import { Link } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';

interface PublicLogoProps {
    className?: string;
    variant?: 'light' | 'dark';
}

export default function PublicLogo({ className = '', variant = 'light' }: PublicLogoProps) {
    const textColor = variant === 'dark' ? 'text-white' : 'text-[#1f5476]';
    const accentColor = variant === 'dark' ? 'text-[#2596be]' : 'text-[#2596be]';

    return (
        <Link href="/" className={`group flex items-center gap-3 ${className}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2596be] text-[#ffe100] shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#2596be]/30">
                <BookOpen size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
                <span className={`text-[11px] font-semibold uppercase tracking-widest opacity-70 ${textColor}`}>
                    Pusat Studi Kepolisian
                </span>
                <span className={`text-xl font-extrabold tracking-tight ${textColor}`}>
                    Portal <span className={accentColor}>PSK</span>
                </span>
            </div>
        </Link>
    );
}
