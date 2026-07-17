import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import React from 'react';

interface Book {
    id: number;
    title: string;
    author: string;
    published_year: number | null;
    category?: { name: string };
}

interface PaginatedBooks {
    data: Book[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
}

export default function AdminBooksIndex({ books }: { books: PaginatedBooks }) {
    const handleDelete = (id: number, title: string) => {
        if (confirm(`Hapus buku "${title}"?`)) {
            router.delete(`/admin/books/${id}`);
        }
    };

    return (
        <>
            <Head title="Kelola Buku — Admin" />
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Kelola Buku</h1>
                    <Link
                        href="/admin/books/create"
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
                    >
                        + Tambah Buku
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50">
                            <tr>
                                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                    Judul
                                </th>
                                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                    Penulis
                                </th>
                                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                    Kategori
                                </th>
                                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                    Tahun
                                </th>
                                <th className="px-5 py-3 text-right font-semibold text-slate-600">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {books.data.map((book) => (
                                <tr
                                    key={book.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-5 py-3 font-medium text-slate-800">
                                        {book.title}
                                    </td>
                                    <td className="px-5 py-3 text-slate-600">
                                        {book.author}
                                    </td>
                                    <td className="px-5 py-3 text-slate-500">
                                        {book.category?.name ?? '—'}
                                    </td>
                                    <td className="px-5 py-3 text-slate-500">
                                        {book.published_year ?? '—'}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                href={`/admin/books/${book.id}/edit`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        book.id,
                                                        book.title,
                                                    )
                                                }
                                                className="text-red-500 hover:underline"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {books.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-10 text-center text-slate-400"
                                    >
                                        Belum ada buku.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {books.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {books.links.map((link, i) =>
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={`rounded-lg border px-4 py-2 text-sm transition ${link.active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 hover:border-slate-500'}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ) : (
                                <span
                                    key={i}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400"
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ),
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

AdminBooksIndex.layout = {
    breadcrumbs: [
        {
            title: 'Kelola Buku',
            href: '/admin/books',
        },
    ],
};
