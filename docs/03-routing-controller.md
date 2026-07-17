# Phase 3: Routing & Controller — Portal Publikasi Pusat Studi Kepolisian

## Konteks untuk Agent

Fase 1 & 2 sudah membuat migration, model, dan seeder. Fase ini membuat:
- Middleware pembatas akses admin
- Controller untuk sisi **Admin** (CRUD buku, berita) dan sisi **Publik** (katalog buku, listing berita, showcase jurnal, landing page)
- Halaman React (Inertia) untuk masing-masing

Project menggunakan **Laravel 13 + React Starter Kit** (Inertia.js sudah terpasang bawaan starter kit, styling pakai Tailwind CSS yang juga sudah terpasang bawaan starter kit).

---

## Step 1 — Buat middleware pembatas role admin

```bash
php artisan make:middleware EnsureUserIsAdmin
```

Isi `app/Http/Middleware/EnsureUserIsAdmin.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! in_array($request->user()->role, ['admin', 'editor'])) {
            abort(403, 'Akses ditolak.');
        }

        return $next($request);
    }
}
```

Daftarkan alias middleware di `bootstrap/app.php` (Laravel 11+/13 style), di dalam `withMiddleware`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
    ]);
})
```

---

## Step 2 — Buat Controller Admin: `Admin/BookController`

```bash
php artisan make:controller Admin/BookController --resource --model=Book
```

Isi `app/Http/Controllers/Admin/BookController.php`:

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::with('category')->latest()->paginate(10);

        return Inertia::render('admin/books/index', ['books' => $books]);
    }

    public function create()
    {
        return Inertia::render('admin/books/create', [
            'categories' => BookCategory::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category_id' => 'nullable|exists:book_categories,id',
            'isbn' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'published_year' => 'nullable|integer|min:1900|max:2100',
            'cover' => 'nullable|image|max:2048',
            'file' => 'nullable|file|mimes:pdf|max:20480',
        ]);

        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);
        $data['created_by'] = $request->user()->id;

        if ($request->hasFile('cover')) {
            $data['cover_path'] = $request->file('cover')->store('books/covers', 'public');
        }
        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('books/files', 'public');
        }

        Book::create($data);

        return redirect()->route('admin.books.index')->with('success', 'Buku berhasil ditambahkan.');
    }

    public function edit(Book $book)
    {
        return Inertia::render('admin/books/edit', [
            'book' => $book,
            'categories' => BookCategory::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Book $book)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category_id' => 'nullable|exists:book_categories,id',
            'isbn' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'published_year' => 'nullable|integer|min:1900|max:2100',
            'cover' => 'nullable|image|max:2048',
            'file' => 'nullable|file|mimes:pdf|max:20480',
        ]);

        if ($request->hasFile('cover')) {
            $data['cover_path'] = $request->file('cover')->store('books/covers', 'public');
        }
        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('books/files', 'public');
        }

        $book->update($data);

        return redirect()->route('admin.books.index')->with('success', 'Buku berhasil diperbarui.');
    }

    public function destroy(Book $book)
    {
        $book->delete();

        return redirect()->route('admin.books.index')->with('success', 'Buku berhasil dihapus.');
    }
}
```

---

## Step 3 — Buat Controller Admin: `Admin/PostController`

```bash
php artisan make:controller Admin/PostController --resource --model=Post
```

Isi `app/Http/Controllers/Admin/PostController.php`:

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with('category')->latest()->paginate(10);

        return Inertia::render('admin/posts/index', ['posts' => $posts]);
    }

    public function create()
    {
        return Inertia::render('admin/posts/create', [
            'categories' => PostCategory::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'nullable|exists:post_categories,id',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'thumbnail' => 'nullable|image|max:2048',
        ]);

        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);
        $data['author_id'] = $request->user()->id;
        $data['published_at'] = $data['status'] === 'published' ? now() : null;

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('posts/thumbnails', 'public');
        }

        Post::create($data);

        return redirect()->route('admin.posts.index')->with('success', 'Berita berhasil ditambahkan.');
    }

    public function edit(Post $post)
    {
        return Inertia::render('admin/posts/edit', [
            'post' => $post,
            'categories' => PostCategory::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'nullable|exists:post_categories,id',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'thumbnail' => 'nullable|image|max:2048',
        ]);

        if ($data['status'] === 'published' && $post->status !== 'published') {
            $data['published_at'] = now();
        }

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('posts/thumbnails', 'public');
        }

        $post->update($data);

        return redirect()->route('admin.posts.index')->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('admin.posts.index')->with('success', 'Berita berhasil dihapus.');
    }
}
```

---

## Step 4 — Buat Controller Publik

```bash
php artisan make:controller HomeController
php artisan make:controller BookController
php artisan make:controller PostController
php artisan make:controller JournalController
```

Isi `app/Http/Controllers/HomeController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\JournalArticleCache;
use App\Models\Post;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('home', [
            'latestBooks' => Book::latest()->take(4)->get(),
            'latestPosts' => Post::where('status', 'published')->latest('published_at')->take(3)->get(),
            'latestArticles' => JournalArticleCache::with('journal')->latest('published_date')->take(3)->get(),
        ]);
    }
}
```

Isi `app/Http/Controllers/BookController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $books = Book::with('category')
            ->when($request->category, fn ($q, $cat) => $q->where('category_id', $cat))
            ->when($request->search, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('books/index', [
            'books' => $books,
            'categories' => BookCategory::orderBy('name')->get(),
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function show(Book $book)
    {
        return Inertia::render('books/show', ['book' => $book->load('category')]);
    }
}
```

Isi `app/Http/Controllers/PostController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::with('category')
            ->where('status', 'published')
            ->when($request->category, fn ($q, $cat) => $q->where('category_id', $cat))
            ->when($request->search, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->latest('published_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('posts/index', [
            'posts' => $posts,
            'categories' => PostCategory::orderBy('name')->get(),
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function show(Post $post)
    {
        return Inertia::render('posts/show', ['post' => $post->load('category', 'author')]);
    }
}
```

Isi `app/Http/Controllers/JournalController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use App\Models\JournalArticleCache;
use Inertia\Inertia;

class JournalController extends Controller
{
    public function index()
    {
        return Inertia::render('journals/index', [
            'journals' => Journal::withCount('articles')->get(),
        ]);
    }

    public function show(Journal $journal)
    {
        $articles = JournalArticleCache::where('journal_id', $journal->id)
            ->latest('published_date')
            ->paginate(15);

        return Inertia::render('journals/show', [
            'journal' => $journal,
            'articles' => $articles,
        ]);
    }
}
```

---

## Step 5 — Definisikan routes di `routes/web.php`

Ganti/tambahkan isi `routes/web.php` (jaga route bawaan starter kit untuk auth, tambahkan blok berikut):

```php
<?php

use App\Http\Controllers\Admin\BookController as AdminBookController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

// Halaman publik
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::prefix('buku')->name('books.')->group(function () {
    Route::get('/', [BookController::class, 'index'])->name('index');
    Route::get('/{book:slug}', [BookController::class, 'show'])->name('show');
});

Route::prefix('berita')->name('posts.')->group(function () {
    Route::get('/', [PostController::class, 'index'])->name('index');
    Route::get('/{post:slug}', [PostController::class, 'show'])->name('show');
});

Route::prefix('jurnal')->name('journals.')->group(function () {
    Route::get('/', [JournalController::class, 'index'])->name('index');
    Route::get('/{journal}', [JournalController::class, 'show'])->name('show');
});

// Admin panel (butuh login + role admin/editor)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('books', AdminBookController::class);
    Route::resource('posts', AdminPostController::class);
});
```

Catatan: route auth bawaan starter kit (`auth.php` atau sudah include di `web.php`, tergantung struktur starter kit) **jangan dihapus** — cukup tambahkan blok di atas.

---

## Step 6 — Buat halaman React (Inertia) — sisi Publik

Struktur folder: `resources/js/pages/`. Buat file berikut (sesuaikan dengan komponen UI yang sudah ada di starter kit, seperti Button/Card dari shadcn jika starter kit menyediakannya):

**`resources/js/pages/books/index.tsx`**
```tsx
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Book {
  id: number;
  title: string;
  slug: string;
  author: string;
  cover_path: string | null;
  category?: { name: string };
}

export default function BooksIndex({ books, categories, filters }: any) {
  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Katalog Buku</h1>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Cari judul buku..."
            defaultValue={filters?.search ?? ''}
            onChange={(e) => router.get('/buku', { ...filters, search: e.target.value }, { preserveState: true })}
            className="border rounded px-3 py-2 w-full max-w-sm"
          />
          <select
            defaultValue={filters?.category ?? ''}
            onChange={(e) => router.get('/buku', { ...filters, category: e.target.value }, { preserveState: true })}
            className="border rounded px-3 py-2"
          >
            <option value="">Semua kategori</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {books.data.map((book: Book) => (
            <Link key={book.id} href={`/buku/${book.slug}`} className="block group">
              <div className="aspect-[3/4] bg-gray-100 rounded mb-2 overflow-hidden">
                {book.cover_path && (
                  <img src={`/storage/${book.cover_path}`} alt={book.title} className="w-full h-full object-cover" />
                )}
              </div>
              <h3 className="font-medium text-sm group-hover:underline">{book.title}</h3>
              <p className="text-xs text-gray-500">{book.author}</p>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
```

**`resources/js/pages/books/show.tsx`**
```tsx
import AppLayout from '@/layouts/app-layout';

export default function BookShow({ book }: any) {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 grid md:grid-cols-3 gap-8">
        <div className="aspect-[3/4] bg-gray-100 rounded overflow-hidden">
          {book.cover_path && (
            <img src={`/storage/${book.cover_path}`} alt={book.title} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="md:col-span-2">
          <h1 className="text-2xl font-semibold mb-2">{book.title}</h1>
          <p className="text-gray-500 mb-1">Penulis: {book.author}</p>
          {book.category && <p className="text-gray-500 mb-4">Kategori: {book.category.name}</p>}
          <p className="whitespace-pre-line">{book.description}</p>
          {book.file_path && (
            <a href={`/storage/${book.file_path}`} target="_blank" className="inline-block mt-6 bg-black text-white px-4 py-2 rounded">
              Unduh PDF
            </a>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
```

**Buat pola serupa untuk**: `resources/js/pages/posts/index.tsx`, `resources/js/pages/posts/show.tsx`, `resources/js/pages/journals/index.tsx`, `resources/js/pages/journals/show.tsx`, dan `resources/js/pages/home.tsx` — struktur sama (listing card + detail), sesuaikan field (posts pakai `thumbnail` & `content`, journals pakai data dari `journal_articles_cache` dengan tombol yang redirect ke `article.pdf_url` atau `journal.ojs_base_url`, bukan halaman internal).

Untuk `resources/js/pages/journals/show.tsx`, pastikan link "Baca selengkapnya" pada tiap artikel mengarah ke URL OJS asli (bukan route internal), contoh:
```tsx
<a href={`${journal.ojs_base_url}/article/view/${article.ojs_article_id}`} target="_blank">
  Baca di OJS
</a>
```

---

## Step 7 — Buat halaman React — sisi Admin (CRUD)

Buat pola CRUD standar di `resources/js/pages/admin/books/` dan `resources/js/pages/admin/posts/`: masing-masing `index.tsx` (tabel + tombol tambah/edit/hapus), `create.tsx` dan `edit.tsx` (form pakai `useForm` dari `@inertiajs/react`).

Contoh form dasar `resources/js/pages/admin/books/create.tsx`:
```tsx
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function BookCreate({ categories }: any) {
  const { data, setData, post, processing, errors } = useForm({
    title: '', author: '', category_id: '', isbn: '', description: '', published_year: '',
    cover: null as File | null, file: null as File | null,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post('/admin/books', { forceFormData: true });
  }

  return (
    <AppLayout>
      <form onSubmit={submit} className="max-w-xl mx-auto p-6 space-y-4">
        <h1 className="text-xl font-semibold">Tambah Buku</h1>
        <input placeholder="Judul" value={data.title} onChange={e => setData('title', e.target.value)} className="border w-full p-2 rounded" />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        <input placeholder="Penulis" value={data.author} onChange={e => setData('author', e.target.value)} className="border w-full p-2 rounded" />
        <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="border w-full p-2 rounded">
          <option value="">Pilih kategori</option>
          {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <textarea placeholder="Deskripsi" value={data.description} onChange={e => setData('description', e.target.value)} className="border w-full p-2 rounded" rows={4} />
        <input type="file" accept="image/*" onChange={e => setData('cover', e.target.files?.[0] ?? null)} />
        <input type="file" accept="application/pdf" onChange={e => setData('file', e.target.files?.[0] ?? null)} />
        <button disabled={processing} className="bg-black text-white px-4 py-2 rounded">Simpan</button>
      </form>
    </AppLayout>
  );
}
```

Buat `index.tsx` dan `edit.tsx` mengikuti pola yang sama (tabel untuk index, form pre-filled untuk edit menggunakan `useForm` dengan `put()`). Ulangi pola serupa untuk modul `posts`.

---

## Step 8 — Link storage untuk file upload

Jalankan (sekali saja, kalau belum pernah):

```bash
php artisan storage:link
```

Ini supaya file di `storage/app/public` bisa diakses publik lewat `/storage/...`.

---

## Step 9 — Verifikasi

1. Jalankan `php artisan serve` dan `npm run dev` (dua terminal terpisah)
2. Akses `http://localhost:8000/` → landing page tampil
3. Akses `http://localhost:8000/buku` → katalog buku dari seeder tampil
4. Login sebagai `admin@pskunla.test` / `password`, akses `http://localhost:8000/admin/books` → CRUD berjalan
5. Coba tambah buku baru lewat form admin, cek muncul di katalog publik

## Selesai

Setelah semua route dan halaman berjalan tanpa error, laporkan hasil testing sebelum lanjut ke fase berikutnya (integrasi OJS — service fetch artikel via REST API/OAI-PMH + scheduled job sync ke `journal_articles_cache`).
