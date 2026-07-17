# Phase 2: Seeder Data Dummy — Portal Publikasi Pusat Studi Kepolisian

## Konteks untuk Agent

Fase sebelumnya (`01-database-schema.md`) sudah membuat migration dan model untuk: `book_categories`, `books`, `post_categories`, `posts`, `journals`, `journal_articles_cache`, `pages`, serta kolom `role` di `users`.

Prasyarat: pastikan `php artisan migrate` sudah berhasil dijalankan sebelum memulai fase ini.

Tugas fase ini: buat seeder untuk mengisi data dummy/contoh di setiap tabel, supaya tampilan Portal tidak kosong saat development dan bisa langsung dites secara visual.

Gunakan Faker (sudah bawaan Laravel) untuk data acak, tapi tetap masukkan beberapa data yang masuk akal secara konteks (tema kepolisian/hukum/kriminologi).

---

## Step 1 — Buat seeder `AdminUserSeeder`

```bash
php artisan make:seeder AdminUserSeeder
```

Isi `database/seeders/AdminUserSeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@pskunla.test'],
            [
                'name' => 'Admin Pusat Studi Kepolisian',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'editor@pskunla.test'],
            [
                'name' => 'Editor Konten',
                'password' => Hash::make('password'),
                'role' => 'editor',
                'email_verified_at' => now(),
            ]
        );
    }
}
```

---

## Step 2 — Buat seeder `BookCategorySeeder`

```bash
php artisan make:seeder BookCategorySeeder
```

Isi `database/seeders/BookCategorySeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\BookCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BookCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Kriminologi',
            'Hukum Kepolisian',
            'Kebijakan Publik & Keamanan',
            'Sosiologi Hukum',
            'Hak Asasi Manusia',
        ];

        foreach ($categories as $name) {
            BookCategory::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            );
        }
    }
}
```

---

## Step 3 — Buat seeder `BookSeeder`

```bash
php artisan make:seeder BookSeeder
```

Isi `database/seeders/BookSeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\BookCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $categoryIds = BookCategory::pluck('id');

        $books = [
            'Reformasi Kepolisian di Era Digital',
            'Kriminologi Kontemporer: Teori dan Praktik',
            'Penegakan Hukum dan Hak Asasi Manusia',
            'Kebijakan Keamanan Publik di Indonesia',
            'Sosiologi Kejahatan Perkotaan',
            'Etika Profesi Kepolisian',
        ];

        foreach ($books as $title) {
            Book::firstOrCreate(
                ['slug' => Str::slug($title)],
                [
                    'category_id' => $categoryIds->random(),
                    'created_by' => $admin?->id,
                    'title' => $title,
                    'author' => fake()->name(),
                    'isbn' => fake()->optional()->isbn13(),
                    'description' => fake()->paragraphs(3, true),
                    'cover_path' => null,
                    'file_path' => null,
                    'published_year' => fake()->numberBetween(2018, 2026),
                ]
            );
        }
    }
}
```

Catatan: `cover_path` dan `file_path` sengaja dibiarkan `null` di seeder karena butuh file fisik. Isi manual belakangan lewat admin panel, atau tambahkan file dummy di `storage/app/public` jika ingin testing upload/tampilan gambar.

---

## Step 4 — Buat seeder `PostCategorySeeder`

```bash
php artisan make:seeder PostCategorySeeder
```

Isi `database/seeders/PostCategorySeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\PostCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Berita', 'Kegiatan Riset', 'Pengumuman', 'Call for Papers'];

        foreach ($categories as $name) {
            PostCategory::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            );
        }
    }
}
```

---

## Step 5 — Buat seeder `PostSeeder`

```bash
php artisan make:seeder PostSeeder
```

Isi `database/seeders/PostSeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $author = User::where('role', 'editor')->first();
        $categoryIds = PostCategory::pluck('id');

        $titles = [
            'Seminar Nasional Kepolisian dan Masyarakat 2026',
            'Pusat Studi Kepolisian Luncurkan Jurnal Perdana',
            'Call for Papers: Edisi Khusus Reformasi Kepolisian',
            'Kunjungan Studi Banding ke Lembaga Riset Kepolisian',
            'Workshop Metodologi Penelitian Kriminologi',
        ];

        foreach ($titles as $title) {
            Post::firstOrCreate(
                ['slug' => Str::slug($title)],
                [
                    'category_id' => $categoryIds->random(),
                    'author_id' => $author?->id,
                    'title' => $title,
                    'content' => fake()->paragraphs(5, true),
                    'thumbnail' => null,
                    'status' => 'published',
                    'published_at' => fake()->dateTimeBetween('-6 months', 'now'),
                ]
            );
        }
    }
}
```

---

## Step 6 — Buat seeder `JournalSeeder`

```bash
php artisan make:seeder JournalSeeder
```

Isi `database/seeders/JournalSeeder.php` — sesuaikan `ojs_base_url` dengan URL OJS lokal kamu:

```php
<?php

namespace Database\Seeders;

use App\Models\Journal;
use Illuminate\Database\Seeder;

class JournalSeeder extends Seeder
{
    public function run(): void
    {
        Journal::firstOrCreate(
            ['name' => 'Jurnal Studi Kepolisian'],
            [
                'ojs_base_url' => 'http://localhost/ojs/index.php/jsk', // ganti dengan path jurnal OJS asli
                'logo' => null,
                'description' => 'Jurnal ilmiah Pusat Studi Kepolisian Universitas Langlangbuana, membahas isu kepolisian, hukum, dan kriminologi.',
            ]
        );
    }
}
```

Catatan penting: nilai `ojs_base_url` di sini **harus disesuaikan** dengan path jurnal asli yang sudah dibuat di instalasi OJS (path yang diisi saat "Create Journal" di OJS, contoh Fase 1 sebelumnya).

---

## Step 7 — Buat seeder `PageSeeder`

```bash
php artisan make:seeder PageSeeder
```

Isi `database/seeders/PageSeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\User;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        $pages = [
            [
                'slug' => 'tentang-kami',
                'title' => 'Tentang Pusat Studi Kepolisian',
                'content' => '<p>Pusat Studi Kepolisian Universitas Langlangbuana adalah unit riset yang fokus pada isu kepolisian, hukum, dan kriminologi.</p>',
            ],
            [
                'slug' => 'visi-misi',
                'title' => 'Visi & Misi',
                'content' => '<p>Visi: Menjadi pusat rujukan kajian kepolisian terkemuka di Indonesia.</p><p>Misi: Menghasilkan riset dan publikasi berkualitas di bidang kepolisian.</p>',
            ],
            [
                'slug' => 'kontak',
                'title' => 'Kontak',
                'content' => '<p>Email: pusatstudikepolisian@unla.ac.id</p>',
            ],
        ];

        foreach ($pages as $page) {
            Page::firstOrCreate(
                ['slug' => $page['slug']],
                [
                    'managed_by' => $admin?->id,
                    'title' => $page['title'],
                    'content' => $page['content'],
                ]
            );
        }
    }
}
```

---

## Step 8 — Daftarkan semua seeder di `DatabaseSeeder`

Edit `database/seeders/DatabaseSeeder.php`, isi method `run()`:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            BookCategorySeeder::class,
            BookSeeder::class,
            PostCategorySeeder::class,
            PostSeeder::class,
            JournalSeeder::class,
            PageSeeder::class,
        ]);
    }
}
```

Urutan ini penting — kategori & user harus ada duluan sebelum seeder yang bergantung padanya (`BookSeeder` butuh `BookCategorySeeder` & `AdminUserSeeder` sudah jalan).

---

## Step 9 — Jalankan seeder

```bash
php artisan db:seed
```

Jika ingin reset database dan seed ulang dari nol (hati-hati, ini menghapus semua data):

```bash
php artisan migrate:fresh --seed
```

## Step 10 — Verifikasi

Cek lewat `php artisan tinker`:

```php
\App\Models\Book::count(); // harus 6
\App\Models\Post::count(); // harus 5
\App\Models\Journal::count(); // harus 1
\App\Models\User::where('role', 'admin')->exists(); // harus true
```

Login admin dummy untuk testing nanti:
- Email: `admin@pskunla.test` / Password: `password`
- Email: `editor@pskunla.test` / Password: `password`

## Selesai

Setelah seeder berhasil dan data terverifikasi, laporkan hasil sebelum lanjut ke fase berikutnya (routing & controller untuk modul buku dan berita, baik sisi admin CRUD maupun sisi publik).
