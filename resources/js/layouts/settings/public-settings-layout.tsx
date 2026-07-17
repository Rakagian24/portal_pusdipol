import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { User, Shield, ChevronRight } from 'lucide-react';
import GuestLayout from '@/layouts/guest-layout';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

const navItems = [
    { title: 'Profil', href: editProfile(), icon: User, desc: 'Nama & email' },
    { title: 'Keamanan', href: editSecurity(), icon: Shield, desc: 'Password & 2FA' },
];

export default function PublicSettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <GuestLayout>
            {/* Page header */}
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 lg:px-12">
                <div className="mx-auto max-w-5xl">
                    <nav className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Link href="/" className="hover:text-[#2596be] transition-colors">Beranda</Link>
                        <ChevronRight size={12} />
                        <span className="font-medium text-gray-800">Pengaturan Akun</span>
                    </nav>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-6 py-10 lg:px-12">
                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold text-[#1f5476]">Pengaturan Akun</h1>
                    <p className="mt-1 text-sm text-gray-500">Kelola profil dan keamanan akun Anda</p>
                    <div className="mt-3 h-0.5 w-10 rounded-full bg-[#2596be]" />
                </div>

                <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                    {/* Sidebar nav */}
                    <aside className="lg:w-52 shrink-0">
                        <nav className="flex flex-row gap-2 lg:flex-col" aria-label="Navigasi Pengaturan">
                            {navItems.map((item) => {
                                const active = isCurrentOrParentUrl(item.href);
                                return (
                                    <Link
                                        key={toUrl(item.href)}
                                        href={item.href}
                                        className={cn(
                                            'group flex flex-1 lg:flex-none items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150',
                                            active
                                                ? 'bg-[#1f5476] text-white shadow-md shadow-[#1f5476]/20'
                                                : 'border border-gray-200 bg-white text-gray-600 hover:border-[#2596be]/40 hover:bg-[#2596be]/5 hover:text-[#2596be]',
                                        )}
                                    >
                                        <div className={cn(
                                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                                            active ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-[#2596be]/10',
                                        )}>
                                            <item.icon size={15} className={active ? 'text-[#ffe100]' : 'text-gray-500 group-hover:text-[#2596be]'} />
                                        </div>
                                        <div className="hidden lg:block">
                                            <div className={active ? 'text-white' : ''}>{item.title}</div>
                                            <div className={cn('text-xs font-normal', active ? 'text-white/60' : 'text-gray-400')}>{item.desc}</div>
                                        </div>
                                        <span className="lg:hidden">{item.title}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
