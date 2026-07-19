import { Link } from '@inertiajs/react';


interface Post {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    published_at: string | null;
    category?: { name: string };
}

interface PublicPostCardProps {
    post: Post;
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function PublicPostCard({ post }: PublicPostCardProps) {
    return (
        <Link
            href={`/berita/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2596be]/30 hover:shadow-lg hover:shadow-[#2596be]/10"
        >
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
                {post.thumbnail ? (
                    <img
                        src={`/storage/${post.thumbnail}`}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                        <div className="text-gray-300 text-xs">No Image</div>
                )}
                {/* Category badge */}
                {post.category && (
                    <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#2596be] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">

                            {post.category.name}
                        </span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-2 flex-1 font-bold leading-snug text-[#1f5476] transition-colors group-hover:text-[#2596be]">
                    {post.title}
                </h3>
                {post.published_at && (
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">

                        <span>{formatDate(post.published_at)}</span>
                    </div>
                )}
            </div>

            {/* Footer accent */}
            <div className="h-0.5 w-0 bg-[#2596be] transition-all duration-300 group-hover:w-full" />
        </Link>
    );
}
