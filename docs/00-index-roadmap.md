# Index — Roadmap Eksekusi Portal Publikasi Pusat Studi Kepolisian

## Untuk Agent (Antigravity)

Dokumen ini adalah ringkasan urutan eksekusi. Baca file detail tiap fase secara berurutan, jangan lompat fase kecuali fase sebelumnya sudah diverifikasi berhasil.

Ada 2 aplikasi terpisah dalam proyek ini:
- **OJS** (`C:\laragon\www\ojs`) — sudah terinstal, khusus menangani jurnal (submission, review, editorial workflow)
- **Portal Custom** (`C:\laragon\www\portal_psk`) — Laravel 13 + React Starter Kit, menangani katalog buku, berita/kegiatan, showcase artikel jurnal (data ditarik dari OJS), dan landing page

Prinsip yang harus selalu dipegang di semua fase:
- Jangan modifikasi struktur/kode inti OJS secara langsung — semua kustomisasi lewat plugin (lihat Fase 5)
- Setiap fase punya langkah verifikasi di akhir — jangan lanjut ke fase berikutnya sebelum verifikasi berhasil dan dilaporkan
- Kalau ada error yang tidak sesuai instruksi, cek log dulu (Apache error log untuk OJS, `storage/logs/laravel.log` untuk Portal) sebelum menebak solusi

---

## Urutan Fase

### Fase 1 — Database Schema (`01-database-schema.md`)
Target: Portal Laravel
Membuat migration & Eloquent model untuk seluruh tabel: `book_categories`, `books`, `post_categories`, `posts`, `journals`, `journal_articles_cache`, `pages`, plus kolom `role` di `users`.
Output: `php artisan migrate` berjalan sukses, seluruh tabel terverifikasi ada.

### Fase 2 — Seeder Data Dummy (`02-seeder-dummy-data.md`)
Target: Portal Laravel
Mengisi data contoh di setiap tabel supaya Portal tidak kosong saat development. Termasuk akun admin & editor dummy untuk testing login.
Output: `php artisan db:seed` berjalan sukses, data terverifikasi via tinker.

### Fase 3 — Routing & Controller (`03-routing-controller.md`)
Target: Portal Laravel
Membuat middleware role admin, controller admin (CRUD buku & berita), controller publik (katalog, showcase jurnal, landing), routing lengkap, dan halaman React (Inertia) untuk keduanya.
Output: Semua route bisa diakses tanpa error, CRUD admin berfungsi, katalog publik menampilkan data dari seeder.

### Fase 4 — Integrasi OJS (`04-integrasi-ojs.md`)
Target: Portal Laravel ↔ OJS
Membuat service untuk fetch artikel published dari REST API OJS, Artisan command sinkronisasi, dan penjadwalan otomatis (scheduled job).
Prasyarat: OJS harus sudah punya minimal 1 jurnal dengan beberapa artikel published untuk bisa ditest.
Output: Artikel dari OJS berhasil tersinkron ke tabel `journal_articles_cache` dan tampil di halaman publik Portal.

### Fase 5 — Custom Theme OJS (`05-tema-ojs-custom.md`)
Target: OJS
Membangun theme plugin dari nol (bukan modifikasi tema default, bukan edit core) untuk styling modern yang konsisten dengan branding Portal Custom.
Output: Tema aktif di OJS, tampilan terverifikasi sesuai desain yang diinginkan.

---

## Setelah Fase 5 Selesai

Beberapa hal yang belum tercakup di 5 fase ini dan bisa jadi fase lanjutan kalau dibutuhkan:
- Styling detail halaman submission wizard, dashboard reviewer/editor di OJS (di luar landing page publik)
- Halaman admin untuk mengelola data `journals` dan kategori (saat ini seeder manual, belum ada CRUD admin untuk itu)
- Deployment ke server produksi (hosting kampus) — konfigurasi berbeda dari local Laragon
- Pendaftaran domain resmi, SSL, dan konfigurasi production `.env`
- SEO lanjutan (sitemap, meta tags dinamis, structured data untuk artikel jurnal)

Laporkan progres di setiap akhir fase sebelum lanjut ke fase berikutnya.
