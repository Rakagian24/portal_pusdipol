import { Link, usePage } from '@inertiajs/react';
import { Shield, BookOpen, FlaskConical, Newspaper, ArrowLeft } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({ children, title, description }: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid min-h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">

            {/* ── Left Side — Branding ── */}
            <div className="relative hidden h-full flex-col overflow-hidden bg-[#1f5476] p-12 text-white lg:flex">

                {/* Background grid pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
                        backgroundSize: '36px 36px',
                    }}
                />
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#2596be]/30" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#ffe100]/10" />

                {/* Logo */}
                <div className="relative z-20 flex items-center gap-3">
                    <Link href={home()} className="group flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2596be] text-[#ffe100] shadow-lg transition group-hover:scale-105">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                                Universitas Langlangbuana
                            </span>
                            <span className="text-lg font-extrabold tracking-tight text-white">
                                Portal <span className="text-[#2596be]">PSK</span>
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Headline */}
                <div className="relative z-20 mt-auto mb-auto">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#ffe100]/30 bg-[#ffe100]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#ffe100]">
                        Portal Akademik
                    </div>
                    <h2 className="mb-5 text-4xl font-extrabold leading-tight lg:text-5xl">
                        Publikasi Ilmiah<br />
                        <span className="text-[#ffe100]">Terpadu</span>
                    </h2>
                    <p className="mb-10 max-w-md text-base leading-relaxed text-white/70">
                        Akses jurnal terpadu, katalog buku, serta berita dan kegiatan terbaru dari Pusat Studi Kepolisian.
                    </p>

                    {/* Feature grid */}
                    <div className="grid max-w-sm grid-cols-1 gap-3">
                        {[
                            { icon: FlaskConical, label: 'Jurnal Ilmiah', desc: 'Terintegrasi OJS' },
                            { icon: BookOpen, label: 'Katalog Buku', desc: 'Publikasi PSK' },
                            { icon: Newspaper, label: 'Berita & Kegiatan', desc: 'Informasi Terkini' },
                        ].map(({ icon: Icon, label, desc }) => (
                            <div key={label} className="flex items-center gap-3 rounded-xl bg-white/5 p-3 backdrop-blur-sm">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                                    <Icon className="h-5 w-5 text-[#ffe100]" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">{label}</div>
                                    <div className="text-xs text-white/50">{desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer text */}
                <div className="relative z-20 mt-auto text-xs text-white/40">
                    © {new Date().getFullYear()} Universitas Langlangbuana. Hak Cipta Dilindungi.
                </div>
            </div>

            {/* ── Right Side — Form ── */}
            <div className="flex min-h-dvh w-full flex-col justify-center bg-[#fefefe] px-6 py-12 lg:px-12">
                <div className="mx-auto flex w-full max-w-[400px] flex-col space-y-8">

                    {/* Mobile logo */}
                    <Link href={home()} className="group mx-auto flex items-center gap-3 lg:hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f5476] text-[#ffe100] shadow">
                            <Shield className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-extrabold text-[#1f5476]">
                            Portal <span className="text-[#2596be]">PSK</span>
                        </span>
                    </Link>

                    {/* Heading */}
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#1f5476]">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-2 text-sm text-gray-500">{description}</p>
                        )}
                    </div>

                    {/* Form Card */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/60">
                        {children}
                    </div>

                    {/* Back to portal */}
                    <Link
                        href={home()}
                        className="flex items-center justify-center gap-1.5 text-xs text-gray-400 transition hover:text-[#2596be]"
                    >
                        <ArrowLeft size={12} />
                        Kembali ke Portal
                    </Link>
                </div>
            </div>
        </div>
    );
}
