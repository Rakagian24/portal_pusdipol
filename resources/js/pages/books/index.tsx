import { Head, router } from '@inertiajs/react';
import { Search, BookOpen, SlidersHorizontal, ChevronDown } from 'lucide-react';
import GuestLayout from '@/layouts/guest-layout';
import PublicSectionHeader from '@/components/public/public-section-header';
import PublicBookCard from '@/components/public/public-book-card';
import PublicPagination from '@/components/public/public-pagination';

interface Book {
    id: number;
    title: string;
    slug: string;
    author: string;
    cover_path: string | null;
    published_year: number | null;
    category?: { name: string };
}

interface Category {
    id: number;
    name: string;
}

interface PaginatedBooks {
    data: Book[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
}

interface Props {
    books: PaginatedBooks;
    categories: Category[];
    filters: { category?: string; search?: string };
}

export default function BooksIndex({ books, categories, filters }: Props) {
    const handleSearch = (search: string) => {
        router.get('/buku', { ...filters, search }, { preserveState: true, replace: true });
    };

    const handleCategory = (category: string) => {
        router.get('/buku', { ...filters, category }, { preserveState: true, replace: true });
    };

    return (
        <GuestLayout>
            <Head title="Katalog Buku — Pusat Studi Kepolisian" />

            {/* Hero */}
            <section className="bg-[#1f5476] py-14">
                <div className="mx-auto max-w-7xl px-6 lg:px-12">
                    <div className="flex items-center gap-2 text-[#ffe100] text-xs font-bold uppercase tracking-widest mb-3">
                        <BookOpen size={14} />
                        Koleksi Publikasi
                    </div>
                    <h1 className="text-4xl font-extrabold text-white">Katalog Buku</h1>
                    <p className="mt-2 text-white/70">
                        Koleksi buku ilmiah dari Pusat Studi Kepolisian Universitas Langlangbuana.
                    </p>

                    {/* Filter bar */}
                    <div className="mt-8 flex flex-wrap gap-3">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                            <input
                                type="text"
                                placeholder="Cari judul buku..."
                                defaultValue={filters?.search ?? ''}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="h-11 w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white placeholder-white/40 backdrop-blur-sm transition focus:border-[#ffe100] focus:outline-none focus:ring-2 focus:ring-[#ffe100]/30"
                            />
                        </div>

                        {/* Category */}
                        <div className="relative">
                            <SlidersHorizontal size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                            <select
                                defaultValue={filters?.category ?? ''}
                                onChange={(e) => handleCategory(e.target.value)}
                                className="h-11 appearance-none rounded-xl border border-white/20 bg-white/10 pl-9 pr-9 text-sm text-white backdrop-blur-sm transition focus:border-[#ffe100] focus:outline-none focus:ring-2 focus:ring-[#ffe100]/30"
                            >
                                <option value="" className="text-gray-800">Semua Kategori</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id} className="text-gray-800">
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="mx-auto max-w-7xl px-6 py-14 lg:px-12">
                <PublicSectionHeader
                    title={
                        books.data.length === 0
                            ? 'Tidak Ada Buku Ditemukan'
                            : `${books.data.length} Buku${books.last_page > 1 ? ` (Hal. ${books.current_page} dari ${books.last_page})` : ''}`
                    }
                    subtitle={
                        filters?.search
                            ? `Hasil pencarian: "${filters.search}"`
                            : undefined
                    }
                />

                {books.data.length === 0 ? (
                    <div className="py-24 text-center text-gray-400">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="font-medium">Tidak ada buku ditemukan.</p>
                        <p className="mt-1 text-sm">Coba ubah kata kunci atau kategori pencarian.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {books.data.map((book) => (
                                <PublicBookCard key={book.id} book={book} />
                            ))}
                        </div>

                        <PublicPagination links={books.links} lastPage={books.last_page} />
                    </>
                )}
            </section>
        </GuestLayout>
    );
}
