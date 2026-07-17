import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PublicPaginationProps {
    links: PaginationLink[];
    lastPage: number;
}

export default function PublicPagination({ links, lastPage }: PublicPaginationProps) {
    if (lastPage <= 1) return null;

    return (
        <div className="flex justify-center gap-1.5 mt-12">
            {links.map((link, i) =>
                link.url ? (
                    <Link
                        key={i}
                        href={link.url}
                        className={`flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-sm font-semibold transition-all duration-150 ${
                            link.active
                                ? 'bg-[#2596be] text-white shadow-md shadow-[#2596be]/30'
                                : 'border border-gray-200 bg-white text-[#1f5476] hover:border-[#2596be] hover:bg-[#2596be]/5 hover:text-[#2596be]'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={i}
                        className="flex h-9 min-w-[36px] items-center justify-center rounded-lg border border-gray-100 bg-gray-50 px-3 text-sm text-gray-400"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            )}
        </div>
    );
}
