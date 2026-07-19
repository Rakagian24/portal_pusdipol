import { Head, Link } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import GuestLayout from '@/layouts/guest-layout';

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string | null;
    description: string | null;
    cover_path: string | null;
    file_path: string | null;
    published_year: number | null;
    category?: { name: string };
}

export default function BookShow({ book }: { book: Book }) {
    return (
        <GuestLayout>
            <Head title={`${book.title} — Pusat Studi Kepolisian`} />

            {/* Hero breadcrumb */}
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <nav className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Link href="/" className="hover:text-[#2596be] transition-colors">Beranda</Link>
                        <span className="text-gray-400">/</span>
                        <Link href="/buku" className="hover:text-[#2596be] transition-colors">Katalog Buku</Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-800 font-medium line-clamp-1 max-w-xs">{book.title}</span>
                    </nav>
                </div>
            </div>

            {/* Content */}
            <section className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
                <div className="grid gap-10 md:grid-cols-3 lg:gap-16">

                    {/* ── Cover Column ── */}
                    <div className="md:col-span-1">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl shadow-[#1f5476]/20">
                            {book.cover_path ? (
                                <img
                                    src={`/storage/${book.cover_path}`}
                                    alt={book.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#1f5476] to-[#2596be] text-white">
                                    <BookOpen size={48} strokeWidth={1.5} className="opacity-60" />
                                    <span className="px-4 text-center text-sm font-medium opacity-70 leading-tight">
                                        {book.title}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Download CTA */}
                        {book.file_path && (
                            <a
                                href={`/storage/${book.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 flex items-center justify-center gap-2.5 w-full rounded-xl bg-[#e62129] px-4 py-3.5 font-bold text-white shadow-lg shadow-[#e62129]/30 transition hover:-translate-y-0.5 hover:bg-[#c01820] hover:shadow-xl"
                            >

                                Unduh PDF
                            </a>
                        )}

                        {/* Metadata card */}
                        <div className="mt-5 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Informasi Buku</h3>
                            <dl className="space-y-3 text-sm">
                                <MetaRow label="Penulis" value={book.author} />
                                {book.isbn && <MetaRow label="ISBN" value={book.isbn} />}
                                {book.published_year && (
                                    <MetaRow label="Tahun Terbit" value={String(book.published_year)} />
                                )}
                                {book.category && (
                                    <MetaRow label="Kategori" value={book.category.name} />
                                )}
                            </dl>
                        </div>
                    </div>

                    {/* ── Detail Column ── */}
                    <div className="md:col-span-2">
                        {/* Category badge */}
                        {book.category && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2596be]/10 px-3 py-1 text-xs font-bold text-[#2596be]">

                                {book.category.name}
                            </span>
                        )}

                        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-[#1f5476] md:text-4xl">
                            {book.title}
                        </h1>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">

                                {book.author}
                            </span>
                            {book.published_year && (
                                <span className="flex items-center gap-1.5">

                                    {book.published_year}
                                </span>
                            )}
                        </div>

                        {/* Accent line */}
                        <div className="my-6 h-px bg-gradient-to-r from-[#2596be] via-[#2596be]/30 to-transparent" />

                        {/* Description */}
                        {book.description ? (
                            <div>
                                <h2 className="mb-3 text-lg font-bold text-[#1f5476]">Deskripsi</h2>
                                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                                    {book.description.split('\n').map((para, i) =>
                                        para.trim() ? <p key={i}>{para}</p> : null
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">Deskripsi belum tersedia.</p>
                        )}

                        {/* Back link */}
                        <div className="mt-10">
                            <Link
                                href="/buku"
                                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#2596be] px-5 py-2.5 text-sm font-bold text-[#2596be] transition hover:bg-[#2596be] hover:text-white"
                            >
                                ← Kembali ke Katalog
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}

function MetaRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-2.5">
            <div>
                <dt className="text-xs text-gray-400">{label}</dt>
                <dd className="font-semibold text-[#1f5476]">{value}</dd>
            </div>
        </div>
    );
}
