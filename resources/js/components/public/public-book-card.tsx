import { Link } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';

interface Book {
    id: number;
    title: string;
    slug: string;
    author: string;
    cover_path: string | null;
    published_year?: number | null;
    category?: { name: string };
}

interface PublicBookCardProps {
    book: Book;
}

export default function PublicBookCard({ book }: PublicBookCardProps) {
    return (
        <Link href={`/buku/${book.slug}`} className="group block">
            {/* Cover */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-[#2596be]/20">
                {book.cover_path ? (
                    <img
                        src={`/storage/${book.cover_path}`}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#1f5476] to-[#2596be] p-4 text-white">
                        <BookOpen size={36} strokeWidth={1.5} className="opacity-60" />
                        <span className="text-center text-xs font-medium leading-tight opacity-80">
                            {book.title}
                        </span>
                    </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#1f5476]/0 transition-colors duration-300 group-hover:bg-[#1f5476]/10" />
                {/* Category badge */}
                {book.category && (
                    <span className="absolute top-2 left-2 rounded-md bg-[#ffe100] px-2 py-0.5 text-[10px] font-bold text-[#332c2b]">
                        {book.category.name}
                    </span>
                )}
            </div>

            {/* Meta */}
            <div className="mt-3 px-0.5">
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#1f5476] transition-colors group-hover:text-[#2596be]">
                    {book.title}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">{book.author}</p>
                {book.published_year && (
                    <p className="mt-0.5 text-xs text-gray-400">{book.published_year}</p>
                )}
            </div>
        </Link>
    );
}
