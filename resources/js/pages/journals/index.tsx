import { Head, Link } from '@inertiajs/react';
import { ExternalLink, BookOpen, FileText } from 'lucide-react';
import GuestLayout from '@/layouts/guest-layout';
import PublicSectionHeader from '@/components/public/public-section-header';

interface Journal {
    id: number;
    name: string;
    description: string | null;
    logo: string | null;
    ojs_base_url: string;
    articles_count: number;
}

export default function JournalsIndex({ journals }: { journals: Journal[] }) {
    return (
        <GuestLayout>
            <Head title="Jurnal Ilmiah — Pusat Studi Kepolisian" />

            {/* Hero */}
            <section className="bg-[#1f5476] py-14">
                <div className="mx-auto max-w-7xl px-6 lg:px-12">
                    <div className="flex items-center gap-3 text-[#ffe100] text-xs font-bold uppercase tracking-widest mb-3">
                        <FileText size={14} />
                        Publikasi Ilmiah
                    </div>
                    <h1 className="text-4xl font-extrabold text-white">Jurnal Ilmiah</h1>
                    <p className="mt-2 max-w-2xl text-white/70">
                        Temukan jurnal-jurnal ilmiah yang diterbitkan oleh Pusat Studi Kepolisian Universitas Langlangbuana.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="mx-auto max-w-7xl px-6 py-14 lg:px-12">
                <PublicSectionHeader
                    title={`${journals.length} Jurnal Tersedia`}
                    subtitle="Klik jurnal untuk melihat daftar artikel lengkap"
                />

                {journals.length === 0 ? (
                    <div className="py-24 text-center text-gray-400">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="font-medium">Belum ada jurnal tersedia.</p>
                    </div>
                ) : (
                    <div className="grid gap-5">
                        {journals.map((journal) => (
                            <div
                                key={journal.id}
                                className="group flex items-start gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-[#2596be]/30 hover:shadow-lg"
                            >
                                {/* Logo */}
                                <div className="shrink-0">
                                    {journal.logo ? (
                                        <img
                                            src={`/storage/${journal.logo}`}
                                            alt={journal.name}
                                            className="h-20 w-20 rounded-xl border border-gray-100 object-contain p-1"
                                        />
                                    ) : (
                                        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-[#1f5476] to-[#2596be] text-white">
                                            <BookOpen size={28} strokeWidth={1.5} />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    {/* Left accent bar on hover */}
                                    <div className="flex items-start gap-4">
                                        <div className="hidden w-1 self-stretch rounded-full bg-[#2596be] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block" />
                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-xl font-bold text-[#1f5476] transition-colors group-hover:text-[#2596be]">
                                                {journal.name}
                                            </h2>
                                            {journal.description && (
                                                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-500">
                                                    {journal.description}
                                                </p>
                                            )}

                                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                                {/* Article count badge */}
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2596be]/10 px-3 py-1 text-xs font-bold text-[#2596be]">
                                                    <FileText size={11} />
                                                    {journal.articles_count} Artikel
                                                </span>

                                                <Link
                                                    href={`/jurnal/${journal.id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f5476] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2596be]"
                                                >
                                                    Lihat Artikel →
                                                </Link>

                                                <a
                                                    href={journal.ojs_base_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:border-[#2596be] hover:text-[#2596be]"
                                                >
                                                    <ExternalLink size={11} />
                                                    Buka di OJS
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </GuestLayout>
    );
}
