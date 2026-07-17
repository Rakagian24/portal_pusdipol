# Phase 4: Integrasi OJS — Sync Artikel Jurnal ke Portal

## Konteks untuk Agent

Fase ini menghubungkan Portal Laravel dengan OJS lewat **REST API** OJS (bukan OAI-PMH — REST API dipilih karena hasilnya JSON, lebih mudah diparsing di Laravel dibanding XML dari OAI-PMH).

Prasyarat sebelum mulai:
- OJS sudah terinstal dan minimal ada 1 jurnal dengan beberapa artikel published (dari Fase 1 instalasi OJS)
- Tabel `journals` di Portal sudah terisi via seeder Fase 2, dengan `ojs_base_url` yang benar

Alur singkat: Laravel akan memanggil endpoint REST API OJS secara berkala (scheduled job), ambil daftar artikel published, lalu simpan/update ke tabel `journal_articles_cache`.

---

## Step 1 — Aktifkan API secret key di OJS

REST API OJS butuh `api_secret_key` diaktifkan di file konfigurasi OJS.

1. Buka file `config.inc.php` di root instalasi OJS (`C:\laragon\www\ojs\config.inc.php`)
2. Cari baris (biasanya di section `[security]`):
   ```
   ; api_secret_key = ""
   ```
3. Isi dengan string acak yang aman, contoh:
   ```
   api_secret_key = "ganti-dengan-string-acak-panjang-dan-unik"
   ```
   Hilangkan tanda `;` di depan baris jika ada.
4. Restart Laragon (Stop All → Start All) supaya OJS baca ulang config.

---

## Step 2 — Generate API token per user di OJS

1. Login ke OJS sebagai admin/editor jurnal
2. Buka **User Profile** (klik nama user di pojok kanan atas) → tab **API Key**
3. Klik **Generate API Key** (atau tombol serupa)
4. Copy token yang muncul — ini akan dipakai di Laravel sebagai kredensial akses

**PENTING**: simpan token ini dengan aman. Jangan hardcode di kode — simpan di `.env`.

---

## Step 3 — Tambahkan kredensial OJS di `.env` Laravel

Tambahkan baris berikut di file `.env` project `portal_psk`:

```env
OJS_API_TOKEN=isi_dengan_token_dari_step_2
```

Tambahkan juga di `config/services.php`, di dalam array return:

```php
'ojs' => [
    'api_token' => env('OJS_API_TOKEN'),
],
```

Catatan: `ojs_base_url` **tidak** disimpan di `.env` karena berbeda per jurnal (sudah ada di kolom `journals.ojs_base_url` di database, karena Portal mendukung multi-jurnal).

---

## Step 4 — Buat service class `OjsClient`

Buat folder `app/Services/` jika belum ada.

```bash
php artisan make:class Services/OjsClient
```

(Jika command `make:class` tidak tersedia di versi Laravel ini, buat file manual di `app/Services/OjsClient.php`.)

Isi `app/Services/OjsClient.php`:

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OjsClient
{
    protected string $apiToken;

    public function __construct()
    {
        $this->apiToken = config('services.ojs.api_token');
    }

    /**
     * Ambil daftar submission yang sudah published dari satu jurnal OJS.
     *
     * @param string $baseUrl contoh: http://localhost/ojs/index.php/kepolisian
     * @return array
     */
    public function getPublishedSubmissions(string $baseUrl, int $count = 20): array
    {
        $url = rtrim($baseUrl, '/') . '/api/v1/submissions';

        $response = Http::withToken($this->apiToken)
            ->timeout(15)
            ->get($url, [
                'status' => 3, // STATUS_PUBLISHED di OJS
                'count' => $count,
                'orderBy' => 'datePublished',
                'orderDirection' => 'DESC',
            ]);

        if (! $response->successful()) {
            // Fallback: beberapa konfigurasi server (CGI/shared hosting) tidak meneruskan
            // header Authorization dengan benar, sehingga perlu fallback ke query param.
            $response = Http::timeout(15)->get($url, [
                'apiToken' => $this->apiToken,
                'status' => 3,
                'count' => $count,
                'orderBy' => 'datePublished',
                'orderDirection' => 'DESC',
            ]);
        }

        if (! $response->successful()) {
            Log::warning('Gagal fetch submissions dari OJS', [
                'url' => $url,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return [];
        }

        return $response->json('items') ?? [];
    }
}
```

---

## Step 5 — Buat Artisan command untuk sinkronisasi

```bash
php artisan make:command SyncJournalArticles
```

Isi `app/Console/Commands/SyncJournalArticles.php`:

```php
<?php

namespace App\Console\Commands;

use App\Models\Journal;
use App\Models\JournalArticleCache;
use App\Services\OjsClient;
use Illuminate\Console\Command;

class SyncJournalArticles extends Command
{
    protected $signature = 'journals:sync';
    protected $description = 'Sinkronisasi artikel published dari semua jurnal OJS ke cache Portal';

    public function handle(OjsClient $client): int
    {
        $journals = Journal::all();

        if ($journals->isEmpty()) {
            $this->warn('Tidak ada data jurnal di tabel journals. Jalankan seeder JournalSeeder dulu.');
            return self::FAILURE;
        }

        foreach ($journals as $journal) {
            $this->info("Sinkronisasi: {$journal->name} ({$journal->ojs_base_url})");

            $submissions = $client->getPublishedSubmissions($journal->ojs_base_url);

            if (empty($submissions)) {
                $this->warn("  Tidak ada data diterima dari OJS untuk jurnal ini.");
                continue;
            }

            $count = 0;
            foreach ($submissions as $submission) {
                $publication = $submission['publications'][array_key_last($submission['publications'] ?? [0])] ?? null;

                if (! $publication) {
                    continue;
                }

                $title = $this->extractLocalized($publication['fullTitle'] ?? $publication['title'] ?? []);
                $authors = collect($publication['authors'] ?? [])
                    ->map(fn ($a) => trim(($a['givenName']['en'] ?? $a['givenName'] ?? '') . ' ' . ($a['familyName']['en'] ?? $a['familyName'] ?? '')))
                    ->filter()
                    ->implode(', ');
                $abstract = $this->extractLocalized($publication['abstract'] ?? []);

                JournalArticleCache::updateOrCreate(
                    [
                        'journal_id' => $journal->id,
                        'ojs_article_id' => (string) $submission['id'],
                    ],
                    [
                        'title' => $title ?: 'Tanpa judul',
                        'authors' => $authors ?: '-',
                        'abstract' => $abstract,
                        'issue_volume' => $publication['issueId'] ?? null,
                        'doi' => $publication['pub-id::doi'] ?? null,
                        'pdf_url' => $journal->ojs_base_url . '/article/view/' . $submission['id'],
                        'published_date' => $publication['datePublished'] ?? null,
                        'synced_at' => now(),
                    ]
                );

                $count++;
            }

            $this->info("  Berhasil sync {$count} artikel.");
        }

        return self::SUCCESS;
    }

    /**
     * Field OJS sering berbentuk objek multi-bahasa, contoh: {"en_US": "Judul", "id_ID": "..."}.
     * Ambil locale pertama yang tersedia sebagai fallback sederhana.
     */
    protected function extractLocalized(array|string $field): ?string
    {
        if (is_string($field)) {
            return $field;
        }

        return $field['en_US'] ?? $field['id_ID'] ?? (is_array($field) ? array_values($field)[0] ?? null : null);
    }
}
```

**Catatan penting untuk agent**: struktur JSON response OJS REST API bisa sedikit berbeda tergantung versi OJS (3.4 vs 3.5) dan plugin yang aktif. Setelah fase ini dijalankan, **cek dulu response mentah** dengan menambahkan `dd($submissions)` sementara di command sebelum baris `foreach`, jalankan `php artisan journals:sync`, lihat struktur JSON asli, lalu sesuaikan path field (`fullTitle`, `authors`, `abstract`, dst) jika berbeda dari asumsi di atas.

---

## Step 6 — Jadwalkan command berjalan otomatis

Laravel 11+/13 menggunakan `routes/console.php` untuk scheduling (bukan lagi `app/Console/Kernel.php`).

Tambahkan di `routes/console.php`:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('journals:sync')->hourly();
```

Supaya scheduler benar-benar berjalan otomatis di background, dua opsi untuk local development di Windows:

**Opsi A — jalankan manual saat development** (paling gampang untuk testing):
```bash
php artisan journals:sync
```

**Opsi B — jalankan scheduler terus-menerus di terminal terpisah** (mensimulasikan cron):
```bash
php artisan schedule:work
```
Biarkan terminal ini tetap terbuka selama development; Laravel akan otomatis menjalankan `journals:sync` tiap jam sesuai jadwal.

(Untuk production nanti di server sungguhan, ini diganti dengan cron job asli yang memanggil `php artisan schedule:run` tiap menit — tapi itu di luar scope local development sekarang.)

---

## Step 7 — Testing manual endpoint OJS (opsional tapi disarankan)

Sebelum menjalankan command Laravel, agent bisa test dulu apakah endpoint OJS bisa diakses langsung, contoh pakai curl:

```bash
curl "http://localhost/ojs/index.php/kepolisian/api/v1/submissions?apiToken=ISI_TOKEN&status=3&count=5"
```

Ganti `kepolisian` dengan path jurnal asli dan `ISI_TOKEN` dengan token dari Step 2. Jika hasilnya JSON berisi data submission, lanjut ke Step 8. Jika error 403/404, cek kembali Step 1 (`api_secret_key`) dan pastikan path jurnal benar.

---

## Step 8 — Jalankan & verifikasi

```bash
php artisan journals:sync
```

Cek hasil:
```bash
php artisan tinker
```
```php
\App\Models\JournalArticleCache::count();
\App\Models\JournalArticleCache::first();
```

Jika data sudah masuk, buka halaman publik jurnal di browser (`http://localhost:8000/jurnal`) — artikel dari OJS harus sudah tampil di showcase Portal.

## Selesai

Setelah sinkronisasi berhasil dan artikel tampil di halaman publik, laporkan hasilnya (jumlah artikel yang tersinkron per jurnal) sebelum lanjut ke fase berikutnya (kustomisasi tema OJS, atau deployment).
