import { Head, router } from '@inertiajs/react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import GuestLayout from '@/layouts/guest-layout';
import PublicSectionHeader from '@/components/public/public-section-header';
import PublicBookCard from '@/components/public/public-book-card';
import PublicPagination from '@/components/public/public-pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
                        <div className="relative w-full sm:w-[220px]">
                            <Select
                                value={filters?.category ?? 'all'}
                                onValueChange={(val) => handleCategory(val === 'all' ? '' : val)}
                            >
                                <SelectTrigger className="h-11 w-full rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20 focus:ring-[#ffe100]/30 focus:border-[#ffe100] backdrop-blur-sm transition">
                                    <div className="flex items-center gap-2">
                                        <SlidersHorizontal size={14} className="text-white/50" />
                                        <SelectValue placeholder="Semua Kategori" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
