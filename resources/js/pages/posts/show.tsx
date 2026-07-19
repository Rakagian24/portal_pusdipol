import { Head, Link } from '@inertiajs/react';
import { ImageOff } from 'lucide-react';
import GuestLayout from '@/layouts/guest-layout';

interface Post {
    id: number;
    title: string;
    content: string;
    thumbnail: string | null;
    published_at: string | null;
    category?: { name: string };
    author?: { name: string };
}

export default function PostShow({ post }: { post: Post }) {
    const formattedDate = post.published_at
        ? new Date(post.published_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : null;

    return (
        <GuestLayout>
            <Head title={`${post.title} — Pusat Studi Kepolisian`} />

            {/* Breadcrumb */}
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 lg:px-12">
                <div className="mx-auto max-w-5xl">
                    <nav className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Link href="/" className="hover:text-[#2596be] transition-colors">Beranda</Link>
                        <span className="text-gray-400">/</span>
                        <Link href="/berita" className="hover:text-[#2596be] transition-colors">Berita & Kegiatan</Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-800 font-medium line-clamp-1 max-w-xs">{post.title}</span>
                    </nav>
                </div>
            </div>

            <article className="mx-auto max-w-5xl px-6 py-12 lg:px-12">

                {/* Hero thumbnail */}
                {post.thumbnail ? (
                    <div className="mb-8 overflow-hidden rounded-2xl shadow-xl shadow-[#1f5476]/10">
                        <img
                            src={`/storage/${post.thumbnail}`}
                            alt={post.title}
                            className="h-[360px] w-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="mb-8 flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f5476]/5 to-[#2596be]/10">
                        <ImageOff size={36} className="text-gray-300" />
                    </div>
                )}

                {/* Meta */}
                <div className="mb-5 flex flex-wrap items-center gap-2.5">
                    {post.category && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2596be] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">

                            {post.category.name}
                        </span>
                    )}
                    {formattedDate && (
                        <span className="flex items-center gap-1.5 text-sm text-gray-500">

                            {formattedDate}
                        </span>
                    )}
                    {post.author && (
                        <span className="flex items-center gap-1.5 text-sm text-gray-500">

                            {post.author.name}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-3xl font-extrabold leading-tight text-[#1f5476] md:text-4xl">
                    {post.title}
                </h1>

                {/* Accent line */}
                <div className="my-7 flex items-center gap-3">
                    <div className="h-1 w-16 rounded-full bg-[#2596be]" />
                    <div className="h-1 w-4 rounded-full bg-[#ffe100]" />
                </div>

                {/* Content */}
                <div
                    className="prose prose-lg max-w-none text-gray-700
                        prose-headings:text-[#1f5476] prose-headings:font-bold
                        prose-a:text-[#2596be] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-[#1f5476]
                        prose-blockquote:border-l-[#2596be] prose-blockquote:bg-[#2596be]/5 prose-blockquote:rounded-r-xl prose-blockquote:py-1
                        prose-img:rounded-xl prose-img:shadow-md"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Back */}
                <div className="mt-12 border-t border-gray-100 pt-8">
                    <Link
                        href="/berita"
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-[#2596be] px-5 py-2.5 text-sm font-bold text-[#2596be] transition hover:bg-[#2596be] hover:text-white"
                    >
                        ← Kembali ke Berita
                    </Link>
                </div>
            </article>
        </GuestLayout>
    );
}
