import { Head, Link } from '@inertiajs/react';

import GuestLayout from '@/layouts/guest-layout';
import PublicSectionHeader from '@/components/public/public-section-header';
import PublicArticleCard from '@/components/public/public-article-card';
import PublicPagination from '@/components/public/public-pagination';

interface Journal {
    id: number;
    name: string;
    description: string | null;
    ojs_base_url: string;
}

interface Article {
    id: number;
    title: string;
    authors: string;
    abstract: string | null;
    issue_volume: string | null;
    doi: string | null;
    pdf_url: string | null;
    published_date: string | null;
    ojs_article_id: string;
}

interface PaginatedArticles {
    data: Article[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
}

interface Props {
    journal: Journal;
    articles: PaginatedArticles;
}

export default function JournalShow({ journal, articles }: Props) {
    return (
        <GuestLayout>
            <Head title={`${journal.name} — Pusat Studi Kepolisian`} />

            {/* Hero */}
            <section className="bg-[#1f5476] py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-12">
                    {/* Breadcrumb */}
                    <nav className="mb-5 flex items-center gap-1.5 text-xs text-white/60">
                        <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                        <span className="text-white/40">/</span>
                        <Link href="/jurnal" className="hover:text-white transition-colors">Jurnal Ilmiah</Link>
                        <span className="text-white/40">/</span>
                        <span className="text-white/90">{journal.name}</span>
                    </nav>

                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#2596be]/20 px-3 py-1 text-xs font-bold text-[#2596be]">

                                Jurnal Ilmiah
                            </div>
                            <h1 className="text-3xl font-extrabold text-white">{journal.name}</h1>
                            {journal.description && (
                                <p className="mt-2 max-w-2xl text-white/70 text-sm leading-relaxed">
                                    {journal.description}
                                </p>
                            )}
                        </div>
                        <a
                            href={journal.ojs_base_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                        >

                            Kunjungi Website Jurnal
                        </a>
                    </div>
                </div>
            </section>

            {/* Articles */}
            <section className="mx-auto max-w-7xl px-6 py-14 lg:px-12">
                <PublicSectionHeader
                    title="Daftar Artikel"
                    subtitle={`${articles.data.length > 0 ? `Menampilkan ${articles.data.length} artikel` : 'Belum ada artikel'} dari jurnal ini`}
                />

                {articles.data.length === 0 ? (
                    <div className="py-24 text-center text-gray-400">

                        <p className="font-medium">Belum ada artikel tersinkronisasi.</p>
                        <p className="mt-1 text-sm">Jalankan sinkronisasi OJS untuk mengisi data artikel.</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {articles.data.map((article) => (
                                <PublicArticleCard
                                    key={article.id}
                                    article={article}
                                    ojsBaseUrl={journal.ojs_base_url}
                                />
                            ))}
                        </div>

                        <PublicPagination links={articles.links} lastPage={articles.last_page} />
                    </>
                )}
            </section>
        </GuestLayout>
    );
}
