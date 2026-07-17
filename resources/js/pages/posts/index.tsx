import { Head, router } from '@inertiajs/react';
import { Search, Newspaper, SlidersHorizontal, ChevronDown } from 'lucide-react';
import GuestLayout from '@/layouts/guest-layout';
import PublicSectionHeader from '@/components/public/public-section-header';
import PublicPostCard from '@/components/public/public-post-card';
import PublicPagination from '@/components/public/public-pagination';

interface Post {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    published_at: string | null;
    content: string;
    category?: { name: string };
}

interface Category {
    id: number;
    name: string;
}

interface PaginatedPosts {
    data: Post[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
}

interface Props {
    posts: PaginatedPosts;
    categories: Category[];
    filters: { category?: string; search?: string };
}

export default function PostsIndex({ posts, categories, filters }: Props) {
    const handleSearch = (search: string) => {
        router.get('/berita', { ...filters, search }, { preserveState: true, replace: true });
    };

    const handleCategory = (category: string) => {
        router.get('/berita', { ...filters, category }, { preserveState: true, replace: true });
    };

    return (
        <GuestLayout>
            <Head title="Berita & Kegiatan — Pusat Studi Kepolisian" />

            {/* Hero */}
            <section className="bg-[#1f5476] py-14">
                <div className="mx-auto max-w-7xl px-6 lg:px-12">
                    <div className="flex items-center gap-2 text-[#ffe100] text-xs font-bold uppercase tracking-widest mb-3">
                        <Newspaper size={14} />
                        Informasi Terkini
                    </div>
                    <h1 className="text-4xl font-extrabold text-white">Berita & Kegiatan</h1>
                    <p className="mt-2 text-white/70">
                        Informasi terbaru seputar kegiatan dan penelitian Pusat Studi Kepolisian Unla.
                    </p>

                    {/* Filters */}
                    <div className="mt-8 flex flex-wrap gap-3">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                            <input
                                type="text"
                                placeholder="Cari berita..."
                                defaultValue={filters?.search ?? ''}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="h-11 w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white placeholder-white/40 backdrop-blur-sm transition focus:border-[#ffe100] focus:outline-none focus:ring-2 focus:ring-[#ffe100]/30"
                            />
                        </div>

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
                        posts.data.length === 0
                            ? 'Tidak Ada Berita Ditemukan'
                            : `${posts.data.length} Berita${posts.last_page > 1 ? ` (Hal. ${posts.current_page} dari ${posts.last_page})` : ''}`
                    }
                    subtitle={filters?.search ? `Hasil pencarian: "${filters.search}"` : undefined}
                />

                {posts.data.length === 0 ? (
                    <div className="py-24 text-center text-gray-400">
                        <Newspaper size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="font-medium">Tidak ada berita ditemukan.</p>
                        <p className="mt-1 text-sm">Coba ubah kata kunci atau kategori pencarian.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {posts.data.map((post) => (
                                <PublicPostCard key={post.id} post={post} />
                            ))}
                        </div>

                        <PublicPagination links={posts.links} lastPage={posts.last_page} />
                    </>
                )}
            </section>
        </GuestLayout>
    );
}
