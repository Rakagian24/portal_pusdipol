import { Head, Link, useForm } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
}

export default function AdminBookCreate({
    categories,
}: {
    categories: Category[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        author: '',
        category_id: '',
        isbn: '',
        description: '',
        published_year: '',
        cover: null as File | null,
        file: null as File | null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/books', { forceFormData: true });
    }

    return (
        <>
            <Head title="Tambah Buku — Admin" />
            <div className="mx-auto max-w-2xl px-4 py-8">
                <Link
                    href="/admin/books"
                    className="mb-6 inline-block text-sm text-blue-600 hover:underline"
                >
                    ← Kembali
                </Link>
                <h1 className="mb-6 text-2xl font-bold">Tambah Buku</h1>

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
                            Penulis *
                        </label>
                        <input
                            value={data.author}
                            onChange={(e) => setData('author', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.author && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.author}
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                ISBN
                            </label>
                            <input
                                value={data.isbn}
                                onChange={(e) =>
                                    setData('isbn', e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Tahun Terbit
                            </label>
                            <input
                                type="number"
                                value={data.published_year}
                                onChange={(e) =>
                                    setData('published_year', e.target.value)
                                }
                                min={1900}
                                max={2100}
                                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Deskripsi
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            rows={5}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Cover (gambar, maks 2MB)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setData('cover', e.target.files?.[0] ?? null)
                            }
                            className="text-sm"
                        />
                        {errors.cover && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.cover}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            File PDF (maks 20MB)
                        </label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) =>
                                setData('file', e.target.files?.[0] ?? null)
                            }
                            className="text-sm"
                        />
                        {errors.file && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.file}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-slate-900 px-6 py-2.5 text-white transition hover:bg-slate-700 disabled:opacity-60"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Buku'}
                        </button>
                        <Link
                            href="/admin/books"
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

AdminBookCreate.layout = {
    breadcrumbs: [
        {
            title: 'Kelola Buku',
            href: '/admin/books',
        },
        {
            title: 'Tambah Buku',
            href: '/admin/books/create',
        },
    ],
};
