import { Head, Link, router } from '@inertiajs/react';

interface Post {
    id: number;
    title: string;
    status: string;
    published_at: string | null;
    category?: { name: string };
}

interface PaginatedPosts {
    data: Post[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
}

export default function AdminPostsIndex({ posts }: { posts: PaginatedPosts }) {
    const handleDelete = (id: number, title: string) => {
        if (confirm(`Hapus berita "${title}"?`)) {
            router.delete(`/admin/posts/${id}`);
        }
    };

    return (
        <>
            <Head title="Kelola Berita — Admin" />
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Kelola Berita & Kegiatan
                    </h1>
                    <Link
                        href="/admin/posts/create"
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
                    >
                        + Tambah Berita
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
                                    Kategori
                                </th>
                                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                    Tanggal
                                </th>
                                <th className="px-5 py-3 text-right font-semibold text-slate-600">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {posts.data.map((post) => (
                                <tr
                                    key={post.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-5 py-3 font-medium text-slate-800">
                                        {post.title}
                                    </td>
                                    <td className="px-5 py-3 text-slate-500">
                                        {post.category?.name ?? '—'}
                                    </td>
                                    <td className="px-5 py-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                        >
                                            {post.status === 'published'
                                                ? 'Dipublikasi'
                                                : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-xs text-slate-500">
                                        {post.published_at
                                            ? new Date(
                                                  post.published_at,
                                              ).toLocaleDateString('id-ID')
                                            : '—'}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        post.id,
                                                        post.title,
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
                            {posts.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-10 text-center text-slate-400"
                                    >
                                        Belum ada berita.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {posts.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {posts.links.map((link, i) =>
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

AdminPostsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Kelola Berita',
            href: '/admin/posts',
        },
    ],
};
