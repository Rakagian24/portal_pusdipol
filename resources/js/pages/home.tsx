import { Head, Link } from '@inertiajs/react';

import { useState } from 'react';
import { router } from '@inertiajs/react';
import GuestLayout from '@/layouts/guest-layout';
import PublicSectionHeader from '@/components/public/public-section-header';
import PublicBookCard from '@/components/public/public-book-card';
import PublicPostCard from '@/components/public/public-post-card';
import PublicArticleCard from '@/components/public/public-article-card';

interface Book {
    id: number;
    title: string;
    slug: string;
    author: string;
    cover_path: string | null;
    published_year: number | null;
    category?: { name: string };
}

interface Post {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    published_at: string | null;
    category?: { name: string };
}

interface Article {
    id: number;
    title: string;
    authors: string;
    doi: string | null;
    pdf_url: string | null;
    published_date: string | null;
    ojs_article_id: string;
    journal?: { name: string; ojs_base_url: string };
}

interface Props {
    latestBooks: Book[];
    latestPosts: Post[];
    latestArticles: Article[];
}

export default function Home({
    latestBooks,
    latestPosts,
    latestArticles,
}: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/cari', { q: searchQuery });
        }
    };

    return (
        <GuestLayout>
            <Head title="Beranda — Pusat Studi Kepolisian Unla" />

            {/* ─────────────────────── HERO ─────────────────────── */}
            <section className="relative overflow-hidden bg-[#1f5476]">
                {/* Background pattern */}
                <div className="pointer-events-none absolute inset-0 opacity-5">
                    <svg
                        width="100%"
                        height="100%"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <pattern
                                id="grid"
                                width="40"
                                height="40"
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d="M 40 0 L 0 0 0 40"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Decorative circles */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#2596be]/20" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#ffe100]/10" />

                <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
                    <div className="max-w-3xl">
                        {/* Eyebrow */}
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ffe100]/30 bg-[#ffe100]/10 px-4 py-1.5 text-xs font-bold tracking-widest text-[#ffe100] uppercase">
                            <GraduationCapIcon size={12} />
                            Universitas Langlangbuana
                        </div>

                        <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
                            Portal Publikasi
                            <br />
                            <span className="text-[#2596be]">
                                Pusat Studi
                            </span>{' '}
                            <span className="text-[#ffe100]">Kepolisian</span>
                        </h1>
                        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
                            Akses jurnal ilmiah, katalog buku, dan berita riset
                            kepolisian dari Universitas Langlangbuana secara
                            terbuka.
                        </p>

                        {/* Search */}
                        <form
                            onSubmit={handleSearch}
                            className="mt-8 flex max-w-lg gap-2"
                        >
                            <div className="relative flex-1">
                                <div className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 font-bold text-xs">
                                    CARI
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari buku, jurnal, atau berita..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 pr-4 pl-10 text-sm text-white placeholder-white/50 backdrop-blur-sm transition focus:border-[#ffe100] focus:bg-white/20 focus:ring-2 focus:ring-[#ffe100]/30 focus:outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="h-12 rounded-xl bg-[#ffe100] px-5 text-sm font-bold text-[#1f5476] transition hover:bg-[#ffe100]/90 hover:shadow-lg"
                            >
                                Cari
                            </button>
                        </form>

                        {/* CTA Buttons */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/jurnal"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#2596be] px-6 py-3 text-sm font-bold text-white shadow transition hover:-translate-y-0.5 hover:bg-[#2596be]/90 hover:shadow-lg"
                            >
                                Jelajahi Jurnal
                            </Link>
                            <Link
                                href="/buku"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                            >
                                Katalog Buku
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─────────────────────── STATS BAR ─────────────────────── */}
            <section className="border-b border-[#ffe100]/30 bg-[#ffe100]">
                <div className="mx-auto max-w-7xl px-6 py-5 lg:px-12">
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                        {[
                            {
                                value: latestArticles.length > 0 ? '50+' : '0',
                                label: 'Artikel Jurnal',
                            },
                            {
                                value: `${latestBooks.length}+`,
                                label: 'Koleksi Buku',
                            },
                            {
                                value: `${latestPosts.length}+`,
                                label: 'Berita & Kegiatan',
                            },
                            { value: '2+', label: 'Jurnal Aktif' },
                        ].map(({ value, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3"
                            >
                                <div>
                                    <div className="text-xl leading-none font-extrabold text-[#1f5476]">
                                        {value}
                                    </div>
                                    <div className="mt-0.5 text-xs font-semibold text-[#1f5476]/70">
                                        {label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─────────────────────── LATEST ARTICLES ─────────────────────── */}
            {latestArticles.length > 0 && (
                <section className="bg-[#1f5476] py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-12">
                        <PublicSectionHeader
                            title="Artikel Jurnal Terbaru"
                            subtitle="Publikasi ilmiah terkini dari jurnal PSK"
                            seeAllHref="/jurnal"
                            light
                        />
                        <div className="space-y-3">
                            {latestArticles.slice(0, 4).map((article) => (
                                <PublicArticleCard
                                    key={article.id}
                                    article={article}
                                />
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <Link
                                href="/jurnal"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#2596be] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#2596be]/90 hover:shadow-lg"
                            >
                                Lihat Semua Jurnal &rarr;
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ─────────────────────── LATEST BOOKS ─────────────────────── */}
            {latestBooks.length > 0 && (
                <section className="bg-[#fefefe] py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-12">
                        <PublicSectionHeader
                            title="Buku Terbaru"
                            subtitle="Koleksi buku ilmiah terbaru dari PSK"
                            seeAllHref="/buku"
                        />
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {latestBooks.slice(0, 5).map((book) => (
                                <PublicBookCard key={book.id} book={book} />
                            ))}
                        </div>
                        <div className="mt-10 text-center">
                            <Link
                                href="/buku"
                                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#2596be] px-6 py-3 text-sm font-bold text-[#2596be] transition hover:bg-[#2596be] hover:text-white"
                            >
                                Lihat Semua Buku &rarr;
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ─────────────────────── LATEST NEWS ─────────────────────── */}
            {latestPosts.length > 0 && (
                <section className="bg-gray-50 py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-12">
                        <PublicSectionHeader
                            title="Berita & Kegiatan"
                            subtitle="Informasi terbaru dari Pusat Studi Kepolisian"
                            seeAllHref="/berita"
                        />
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {latestPosts.slice(0, 3).map((post) => (
                                <PublicPostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ─────────────────────── CTA BOTTOM ─────────────────────── */}
            <section className="bg-[#2596be] py-14">
                <div className="mx-auto max-w-7xl px-6 text-center lg:px-12">

                    <h2 className="text-2xl font-extrabold text-white md:text-3xl">
                        Ingin mempublikasikan penelitian Anda?
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-white/80">
                        Daftarkan diri dan submit artikel ke jurnal Pusat Studi
                        Kepolisian Universitas Langlangbuana.
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#ffe100] px-6 py-3 text-sm font-bold text-[#1f5476] transition hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            Daftar Sekarang
                        </Link>
                        <Link
                            href="/jurnal"
                            className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                        >
                            Lihat Jurnal
                        </Link>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}

// Inline icon (avoid separate import for simple usage)
function GraduationCapIcon({ size }: { size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    );
}
