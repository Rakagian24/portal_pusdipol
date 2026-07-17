# Phase 1: Database Schema — Portal Publikasi Pusat Studi Kepolisian

## Konteks untuk Agent

Project ini adalah **Portal Custom** (Laravel 13 + React Starter Kit) yang berdiri terpisah dari OJS. Portal ini menangani: katalog buku, berita/kegiatan, cache artikel jurnal (ditarik dari OJS), dan halaman statis.

Project sudah ada di direktori `C:\laragon\www\portal_psk` menggunakan **Laravel 13 + React Starter Kit** (sudah include migration `users` bawaan Breeze/Starter Kit).

Tugas fase ini: buat seluruh migration dan Eloquent model sesuai skema di bawah, lalu jalankan migration.

Jangan modifikasi struktur folder default Laravel. Jangan menambahkan package baru kecuali disebutkan eksplisit di sini.

---

## Step 1 — Tambahkan kolom `role` ke tabel `users`

Starter kit Laravel sudah punya migration `users`. Jangan edit file migration lama itu — buat migration baru untuk menambah kolom.

Jalankan:
```bash
php artisan make:migration add_role_to_users_table --table=users
```

Isi file migration yang baru dibuat dengan:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('editor')->after('email');
            // role: 'admin' | 'editor'
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
```

---

## Step 2 — Buat migration & model `BookCategory`

```bash
php artisan make:model BookCategory -m
```

Isi migration (`*_create_book_categories_table.php`):

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('book_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('book_categories');
    }
};
```

Isi model `app/Models/BookCategory.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookCategory extends Model
{
    protected $fillable = ['name', 'slug'];

    public function books()
    {
        return $this->hasMany(Book::class, 'category_id');
    }
}
```

---

## Step 3 — Buat migration & model `Book`

```bash
php artisan make:model Book -m
```

Isi migration (`*_create_books_table.php`):

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('book_categories')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('author');
            $table->string('isbn')->nullable();
            $table->text('description')->nullable();
            $table->string('cover_path')->nullable();
            $table->string('file_path')->nullable();
            $table->unsignedSmallInteger('published_year')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
```

Isi model `app/Models/Book.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'category_id', 'created_by', 'title', 'slug', 'author',
        'isbn', 'description', 'cover_path', 'file_path', 'published_year',
    ];

    public function category()
    {
        return $this->belongsTo(BookCategory::class, 'category_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
```

---

## Step 4 — Buat migration & model `PostCategory`

```bash
php artisan make:model PostCategory -m
```

Isi migration (`*_create_post_categories_table.php`):

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_categories');
    }
};
```

Isi model `app/Models/PostCategory.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostCategory extends Model
{
    protected $fillable = ['name', 'slug'];

    public function posts()
    {
        return $this->hasMany(Post::class, 'category_id');
    }
}
```

---

## Step 5 — Buat migration & model `Post`

```bash
php artisan make:model Post -m
```

Isi migration (`*_create_posts_table.php`):

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('post_categories')->nullOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->string('thumbnail')->nullable();
            $table->string('status')->default('draft'); // draft | published
            $table->dateTime('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

Isi model `app/Models/Post.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'category_id', 'author_id', 'title', 'slug', 'content',
        'thumbnail', 'status', 'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function category()
    {
        return $this->belongsTo(PostCategory::class, 'category_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
```

---

## Step 6 — Buat migration & model `Journal`

```bash
php artisan make:model Journal -m
```

Isi migration (`*_create_journals_table.php`):

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journals', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('ojs_base_url');
            $table->string('logo')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journals');
    }
};
```

Isi model `app/Models/Journal.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    protected $fillable = ['name', 'ojs_base_url', 'logo', 'description'];

    public function articles()
    {
        return $this->hasMany(JournalArticleCache::class, 'journal_id');
    }
}
```

---

## Step 7 — Buat migration & model `JournalArticleCache`

```bash
php artisan make:model JournalArticleCache -m
```

Isi migration (`*_create_journal_articles_cache_table.php`):

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journal_articles_cache', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_id')->constrained('journals')->cascadeOnDelete();
            $table->string('ojs_article_id');
            $table->string('title');
            $table->string('authors');
            $table->text('abstract')->nullable();
            $table->string('issue_volume')->nullable();
            $table->string('doi')->nullable();
            $table->string('pdf_url')->nullable();
            $table->date('published_date')->nullable();
            $table->dateTime('synced_at')->nullable();
            $table->timestamps();

            $table->unique(['journal_id', 'ojs_article_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_articles_cache');
    }
};
```

Isi model `app/Models/JournalArticleCache.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalArticleCache extends Model
{
    protected $table = 'journal_articles_cache';

    protected $fillable = [
        'journal_id', 'ojs_article_id', 'title', 'authors', 'abstract',
        'issue_volume', 'doi', 'pdf_url', 'published_date', 'synced_at',
    ];

    protected $casts = [
        'published_date' => 'date',
        'synced_at' => 'datetime',
    ];

    public function journal()
    {
        return $this->belongsTo(Journal::class, 'journal_id');
    }
}
```

---

## Step 8 — Buat migration & model `Page`

```bash
php artisan make:model Page -m
```

Isi migration (`*_create_pages_table.php`):

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('managed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('title');
            $table->longText('content');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
```

Isi model `app/Models/Page.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = ['managed_by', 'slug', 'title', 'content'];

    public function manager()
    {
        return $this->belongsTo(User::class, 'managed_by');
    }
}
```

---

## Step 9 — Jalankan migration

```bash
php artisan migrate
```

## Step 10 — Verifikasi

Pastikan tabel berikut sudah ada di database (cek via `php artisan tinker` lalu `Schema::hasTable('books')` atau langsung cek di phpMyAdmin):

- `users` (dengan kolom `role` baru)
- `book_categories`
- `books`
- `post_categories`
- `posts`
- `journals`
- `journal_articles_cache`
- `pages`

Jika ada error saat migrate (misal foreign key constraint gagal), pastikan urutan migration berjalan sesuai urutan file timestamp (Laravel otomatis urut berdasarkan nama file), karena tabel `books` bergantung pada `book_categories` dan `users` sudah ada duluan.

## Selesai

Setelah semua tabel berhasil dibuat, laporkan hasil `php artisan migrate` (daftar migration yang berhasil dijalankan) sebelum lanjut ke fase berikutnya (seeder data dummy & routing modul).
