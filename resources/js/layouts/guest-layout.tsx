import { Link, usePage, router } from '@inertiajs/react';

import React, { useState, useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PublicLogo from '@/components/public/public-logo';
import { logout } from '@/routes';

const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/jurnal', label: 'Jurnal Ilmiah' },
    { href: '/buku', label: 'Katalog Buku' },
    { href: '/berita', label: 'Berita & Kegiatan' },
    { href: '/tentang-kami', label: 'Tentang Kami' },
];

export default function GuestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { auth } = usePage().props as {
        auth: { user: { name: string } | null };
    };
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => router.flushAll();

    return (
        <div className="flex min-h-screen flex-col bg-[#fefefe] font-sans text-[#332c2b] selection:bg-[#ffe100]/60 selection:text-[#332c2b]">
            {/* ── Top Bar ── */}
            <div className="hidden border-b border-gray-100 bg-[#1f5476] py-1.5 text-xs text-white/80 lg:block">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5">
                            Jl. Karapitan No. 116, Bandung
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span>
                            Universitas Langlangbuana — Pusat Studi Kepolisian
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Navbar ── */}
            <header
                className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
                    scrolled
                        ? 'border-gray-200 bg-[#fefefe]/95 shadow-sm backdrop-blur-md'
                        : 'border-transparent bg-[#fefefe]'
                }`}
            >
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
                    <PublicLogo />

                    {/* Desktop Nav */}
                    <nav
                        className="hidden items-center gap-1 md:flex"
                        aria-label="Navigasi utama"
                    >
                        {navLinks.map(({ href, label }) => (
                            <NavLink key={href} href={href}>
                                {label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Auth */}
                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    id="user-menu-trigger"
                                    className="flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-bold text-[#1f5476] shadow-sm transition-all hover:border-[#2596be] hover:text-[#2596be] focus:outline-none"
                                >
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2596be] text-[10px] font-bold text-white">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden max-w-[100px] truncate sm:inline-block">
                                        {auth.user.name}
                                    </span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56 rounded-xl border-gray-100 p-2 shadow-xl shadow-[#1f5476]/10"
                                >
                                    <DropdownMenuLabel className="px-3 py-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                        Akun Saya
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-gray-100" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-gray-50 focus:text-[#2596be]"
                                        >
                                            <Link
                                                href="/settings/profile"
                                                className="flex w-full items-center"
                                            >
                                                Profil Saya
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-gray-50 focus:text-[#2596be]"
                                        >
                                            <Link
                                                href="/dashboard"
                                                className="flex w-full items-center"
                                            >
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="bg-gray-100" />
                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 focus:bg-red-50 focus:text-red-700"
                                    >
                                        <Link
                                            href={logout()}
                                            as="button"
                                            method="post"
                                            onClick={handleLogout}
                                            className="flex w-full items-center"
                                        >
                                            Keluar
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="hidden text-sm font-semibold text-[#1f5476] transition-colors hover:text-[#2596be] md:inline-flex"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex h-10 items-center justify-center rounded-full bg-[#2596be] px-5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#1f5476] hover:shadow-md"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            id="mobile-menu-toggle"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-[#1f5476] transition hover:border-[#2596be] hover:bg-[#2596be]/5 md:hidden"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? 'Tutup' : 'Menu'}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="border-t border-gray-100 bg-white px-6 pb-4 md:hidden">
                        <nav className="flex flex-col gap-1 pt-3">
                            {navLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#1f5476] transition hover:bg-[#2596be]/10 hover:text-[#2596be]"
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* ── Main Content ── */}
            <main className="w-full flex-1">{children}</main>

            {/* ── Footer ── */}
            <footer className="bg-[#1f5476] text-white/80">
                <div className="mx-auto max-w-7xl px-6 py-14 lg:px-12">
                    <div className="grid gap-10 md:grid-cols-3">
                        {/* Col 1 – Branding */}
                        <div>
                            <PublicLogo variant="dark" />
                            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
                                Portal publikasi ilmiah Pusat Studi Kepolisian
                                Universitas Langlangbuana — menyebarkan
                                pengetahuan riset kepolisian untuk Indonesia.
                            </p>
                        </div>

                        {/* Col 2 – Navigasi */}
                        <div>
                            <h4 className="mb-4 text-xs font-bold tracking-widest text-[#ffe100] uppercase">
                                Navigasi
                            </h4>
                            <ul className="flex flex-col gap-2.5 text-sm">
                                {navLinks.map(({ href, label }) => (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            className="transition-colors hover:text-white"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Col 3 – Kontak */}
                        <div>
                            <h4 className="mb-4 text-xs font-bold tracking-widest text-[#ffe100] uppercase">
                                Kontak
                            </h4>
                            <ul className="flex flex-col gap-3 text-sm">
                                <li className="flex items-start gap-2">
                                    <span>
                                        Jl. Karapitan No. 116, Bandung, Jawa
                                        Barat 40261
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <a
                                        href="mailto:psk@unla.ac.id"
                                        className="transition-colors hover:text-white"
                                    >
                                        psk@unla.ac.id
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span>(022) 4231948</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
                        <span>
                            &copy; {new Date().getFullYear()} Pusat Studi
                            Kepolisian — Universitas Langlangbuana. All rights
                            reserved.
                        </span>
                        <div className="h-1 w-8 rounded-full bg-[#ffe100]" />
                    </div>
                </div>
            </footer>
        </div>
    );
}

function NavLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    const isActive =
        typeof window !== 'undefined' && window.location.pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-150 ${
                isActive
                    ? 'bg-[#2596be]/10 text-[#2596be]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#2596be]'
            }`}
        >
            {children}
        </Link>
    );
}
