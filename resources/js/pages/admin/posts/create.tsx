import { Head, Link, useForm } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
}

export default function AdminPostCreate({
    categories,
}: {
    categories: Category[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category_id: '',
        content: '',
        status: 'draft' as 'draft' | 'published',
        thumbnail: null as File | null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/posts', { forceFormData: true });
    }

    return (
        <>
            <Head title="Tambah Berita — Admin" />
            <div className="mx-auto max-w-2xl px-4 py-8">
                <Link
                    href="/admin/posts"
                    className="mb-6 inline-block text-sm text-blue-600 hover:underline"
                >
                    ← Kembali
                </Link>
                <h1 className="mb-6 text-2xl font-bold">
                    Tambah Berita / Kegiatan
                </h1>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Judul *
                        </label>
                        <input
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Kategori
                        </label>
                        <select
                            value={data.category_id}
                            onChange={(e) =>
                                setData('category_id', e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">Pilih kategori</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Konten *
                        </label>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            rows={10}
                            placeholder="Tulis konten berita di sini..."
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.content && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.content}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Status *
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) =>
                                setData(
                                    'status',
                                    e.target.value as 'draft' | 'published',
                                )
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Publikasikan</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Thumbnail (gambar, maks 2MB)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setData(
                                    'thumbnail',
                                    e.target.files?.[0] ?? null,
                                )
                            }
                            className="text-sm"
                        />
                        {errors.thumbnail && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.thumbnail}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-slate-900 px-6 py-2.5 text-white transition hover:bg-slate-700 disabled:opacity-60"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Berita'}
                        </button>
                        <Link
                            href="/admin/posts"
                            className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm text-slate-600 transition hover:border-slate-500"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

AdminPostCreate.layout = {
    breadcrumbs: [
        {
            title: 'Kelola Berita',
            href: '/admin/posts',
        },
        {
            title: 'Tambah Berita',
            href: '/admin/posts/create',
        },
    ],
};
