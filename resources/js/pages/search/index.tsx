import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState, FormEvent } from 'react';
import GuestLayout from '@/layouts/guest-layout';
import PublicBookCard from '@/components/public/public-book-card';
import PublicPostCard from '@/components/public/public-post-card';
import PublicArticleCard from '@/components/public/public-article-card';

// Interfaces based on backend return
interface Category {
    name: string;
}

interface Book {
    id: number;
    title: string;
    slug: string;
    author: string;
    cover_path: string | null;
    published_year: number | null;
    category?: Category;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    published_at: string | null;
    content: string;
    category?: Category;
}

interface Article {
    id: number;
    title: string;
    authors: string;
    abstract?: string | null;
    issue_volume?: string | null;
    doi?: string | null;
    pdf_url?: string | null;
    published_date?: string | null;
    ojs_article_id: string;
    journal?: { name: string; ojs_base_url: string };
}

interface Props {
    query: string;
    results: {
        books: Book[];
        posts: Post[];
        articles: Article[];
    };
    totalResults: number;
}

export default function SearchIndex({ query: initialQuery, results, totalResults }: Props) {
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/cari', { q: searchQuery }, { preserveState: true, replace: true });
        }
    };

    const hasResults = totalResults > 0;
    const hasSearch = initialQuery.trim().length > 0;

    return (
        <GuestLayout>
            <Head title={`Pencarian: ${initialQuery || 'Pusat Studi Kepolisian'}`} />

            {/* ── Search Hero ── */}
            <section className="bg-[#1f5476] py-14">
                <div className="mx-auto max-w-4xl px-6 text-center lg:px-12">
                    <h1 className="text-3xl font-extrabold text-white md:text-4xl">
                        Pencarian Global
                    </h1>
                    <p className="mt-3 text-white/70">
                        Cari buku, artikel jurnal, dan berita sekaligus.
                    </p>

                    <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-2xl gap-2">
                        <div className="relative flex-1">
                            <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                            <input
                                type="text"
                                placeholder="Ketik kata kunci pencarian..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-14 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-base text-white placeholder-white/50 backdrop-blur-sm transition focus:border-[#ffe100] focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#ffe100]/30"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            className="h-14 rounded-xl bg-[#ffe100] px-6 text-sm font-bold text-[#1f5476] transition hover:bg-[#ffe100]/90 hover:shadow-lg"
                        >
                            Cari
                        </button>
                    </form>
                </div>
            </section>

            {/* ── Search Results ── */}
            <section className="mx-auto max-w-7xl px-6 py-14 lg:px-12">
                {!hasSearch ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">

                        <p className="text-lg font-medium text-gray-500">Silakan masukkan kata kunci pencarian</p>
                    </div>
                ) : !hasResults ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">

                        <p className="text-lg font-medium text-gray-800">Tidak ada hasil ditemukan</p>
                        <p className="mt-1 text-sm text-gray-500">Kami tidak dapat menemukan data untuk kata kunci "{initialQuery}". Coba kata kunci yang lain.</p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        <div className="mb-4 text-sm font-semibold text-gray-500">
                            Menemukan <span className="text-[#1f5476]">{totalResults}</span> hasil untuk "{initialQuery}"
                        </div>

                        {/* Articles Section */}
                        {results.articles.length > 0 && (
                            <div>
                                <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">

                                    <h2 className="text-2xl font-bold text-[#1f5476]">Artikel Jurnal ({results.articles.length})</h2>
                                </div>
                                <div className="space-y-3">
                                    {results.articles.map((article) => (
                                        <PublicArticleCard key={article.id} article={article} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Books Section */}
                        {results.books.length > 0 && (
                            <div>
                                <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">

                                    <h2 className="text-2xl font-bold text-[#1f5476]">Buku Publikasi ({results.books.length})</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                    {results.books.map((book) => (
                                        <PublicBookCard key={book.id} book={book} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Posts Section */}
                        {results.posts.length > 0 && (
                            <div>
                                <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">

                                    <h2 className="text-2xl font-bold text-[#1f5476]">Berita & Kegiatan ({results.posts.length})</h2>
                                </div>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {results.posts.map((post) => (
                                        <PublicPostCard key={post.id} post={post} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </GuestLayout>
    );
}
