# Analisis Kebutuhan Sistem — Portal Publikasi Pusat Studi Kepolisian Unla

## 1. Ruang Lingkup Sistem

Sistem terdiri dari **dua aplikasi terpisah** yang saling terintegrasi:

| Komponen | Peran | Teknologi |
|---|---|---|
| **OJS (Open Journal Systems)** | Mengelola submission, peer-review, editorial workflow, penerbitan artikel jurnal, metadata untuk akreditasi Sinta/Garuda/DOAJ | PHP native (PKP), tema dikustomisasi |
| **Portal Custom** | Landing page, katalog buku, berita/kegiatan riset, showcase artikel jurnal (ambil data dari OJS), profil pusat studi | Laravel 13 + React (Starter Kit) |

Prinsip penting: **skema database OJS tidak didesain ulang** — itu sudah given dari PKP dan wajib dijaga strukturnya agar tetap kompatibel dengan update resmi dan proses audit akreditasi. Yang kita desain dari nol adalah skema **Portal Custom**.

---

## 2. Kebutuhan Fungsional

### 2.1 OJS (kustomisasi, bukan redesign fungsi inti)

| ID | Kebutuhan | Keterangan |
|---|---|---|
| OJS-01 | Tema visual kustom yang modern | Custom child theme, tidak mengubah core OJS |
| OJS-02 | Branding sesuai identitas Pusat Studi Kepolisian Unla | Logo, warna, tipografi konsisten dengan Portal Custom |
| OJS-03 | Halaman wajib akreditasi lengkap | About, Author Guidelines, Publication Ethics, Editorial Team, Peer Review Process |
| OJS-04 | REST API / OAI-PMH aktif | Untuk diakses Portal Custom |
| OJS-05 | Alur editorial standar OJS tetap dipakai apa adanya | Submission → Review → Revisi → Keputusan → Copyediting → Publish |

### 2.2 Portal Custom — Modul Buku

| ID | Kebutuhan |
|---|---|
| PB-01 | Admin dapat CRUD data buku (judul, penulis, ISBN, kategori, cover, file/preview, tahun terbit) |
| PB-02 | Publik dapat melihat katalog buku dengan filter (kategori, tahun, penulis) dan pencarian |
| PB-03 | Publik dapat melihat halaman detail buku |
| PB-04 | Admin dapat mengelola kategori buku |

### 2.3 Portal Custom — Modul Berita & Kegiatan

| ID | Kebutuhan |
|---|---|
| PN-01 | Admin dapat CRUD berita/kegiatan (judul, konten, kategori, thumbnail, tanggal terbit) |
| PN-02 | Publik dapat melihat listing berita dengan filter kategori & pencarian |
| PN-03 | Publik dapat melihat halaman detail berita |
| PN-04 | Berita dapat berstatus draft/published dengan jadwal publish |

### 2.4 Portal Custom — Modul Jurnal (Feed dari OJS)

| ID | Kebutuhan |
|---|---|
| PJ-01 | Sistem menarik data artikel terbaru dari OJS secara berkala (scheduled job) via REST API/OAI-PMH |
| PJ-02 | Data artikel di-cache di database Portal (tidak fetch live tiap request) |
| PJ-03 | Publik dapat melihat daftar artikel jurnal terbaru di Portal |
| PJ-04 | Tombol "Baca Selengkapnya" / "Submit Naskah" mengarah (redirect) ke OJS asli |
| PJ-05 | Mendukung multi-jurnal (jika ke depan pusat studi punya lebih dari satu jurnal) |

### 2.5 Portal Custom — Umum

| ID | Kebutuhan |
|---|---|
| PU-01 | Landing page profil Pusat Studi Kepolisian (visi misi, struktur organisasi) |
| PU-02 | Manajemen halaman statis (About, Kontak, dll) oleh admin |
| PU-03 | Autentikasi admin dengan role (Admin, Editor Konten) |
| PU-04 | Desain responsif & SEO-friendly (server-rendered/SSR untuk konten publik) |

---

## 3. Proses Bisnis

### 3.1 Alur Editorial Jurnal (berjalan sepenuhnya di OJS — tidak disentuh Portal)

1. Penulis submit naskah lewat OJS
2. Editor melakukan penilaian awal & assign reviewer
3. Reviewer memberi penilaian (blind/double-blind review)
4. Editor membuat keputusan: Accept / Revisi / Reject
5. Jika revisi: penulis upload versi revisi, ulangi review jika perlu
6. Copyediting & layout oleh tim editorial
7. Artikel diterbitkan dalam Issue/Volume tertentu
8. Metadata otomatis tersedia untuk Google Scholar, siap didaftarkan ke Garuda/DOAJ

### 3.2 Alur Publikasi Konten di Portal Custom (Buku & Berita)

1. Admin/Editor Konten login ke Portal Custom
2. Membuat draft (buku atau berita) — isi field, upload gambar/file
3. Simpan sebagai draft atau langsung publish
4. Jika published, konten otomatis tampil di katalog/listing publik
5. Publik mengakses via halaman katalog, bisa filter & search

### 3.3 Alur Sinkronisasi Artikel Jurnal (Portal ← OJS)

1. Scheduled job (Laravel Task Scheduling) berjalan berkala (misal tiap 1 jam)
2. Job memanggil REST API/OAI-PMH endpoint OJS untuk ambil artikel terbaru per jurnal
3. Data di-parse dan disimpan/diperbarui di tabel cache Portal (`journal_articles_cache`)
4. Halaman publik Portal menampilkan data dari cache ini, bukan fetch langsung ke OJS tiap request
5. Klik artikel → redirect ke URL asli di OJS

---

## 4. ERD — Portal Custom (Laravel)

Lihat diagram ERD terlampir di percakapan. Ringkasan entitas:

- **users** — admin & editor konten Portal (bukan user OJS, terpisah)
- **book_categories** — kategori buku
- **books** — data buku, relasi ke kategori dan user pembuat
- **post_categories** — kategori berita
- **posts** — berita/kegiatan riset, relasi ke kategori dan penulis
- **journals** — daftar jurnal yang dinaungi pusat studi (mendukung multi-jurnal), menyimpan base URL OJS
- **journal_articles_cache** — cache artikel hasil sinkronisasi dari OJS, relasi ke journals
- **pages** — halaman statis (profil, visi misi, kontak) yang dikelola admin

---

## 5. Kebutuhan Non-Fungsional

| Aspek | Kebutuhan |
|---|---|
| SEO | Konten publik (buku, berita, jurnal) harus server-rendered/SSR untuk terindeks mesin pencari |
| Performa | Data jurnal di-cache, tidak live-fetch ke OJS tiap request |
| Keamanan | File upload (cover buku, thumbnail) divalidasi tipe & ukuran; folder upload di luar direktori publik jika sensitif |
| Maintainability | OJS tidak dimodifikasi core-nya — kustomisasi lewat child theme agar mudah di-update |
| Skalabilitas | Struktur `journals` mendukung penambahan jurnal baru tanpa perubahan skema |

---

## 6. Pendekatan Kustomisasi Tampilan OJS

Karena OJS **tidak boleh dimodifikasi core-nya** (supaya tetap bisa update resmi dari PKP dan tetap dikenali asesor), kustomisasi visual dilakukan lewat:

1. **Child theme plugin** — OJS 3.4 mendukung sistem tema berbasis plugin (`plugins/themes/`). Buat plugin tema baru yang extend `ThemePlugin` bawaan, bukan edit tema default langsung.
2. Override file **LESS/CSS** dan template Smarty (`.tpl`) di dalam folder tema custom untuk styling modern (warna, tipografi, layout header/footer).
3. Logo, warna, dan font diselaraskan dengan branding Portal Custom supaya user merasakan pengalaman visual yang konsisten meski berpindah dari Portal ke OJS.
4. Struktur halaman OJS (About, Author Guidelines, dll) tetap dipertahankan — jangan dihapus/disembunyikan, karena ini yang dicek asesor akreditasi.

---

## 7. Langkah Selanjutnya

1. Review dokumen ini — konfirmasi ada modul yang kurang atau berlebih
2. Finalisasi ERD (tambah field jika ada kebutuhan spesifik, misal multi-bahasa)
3. Setup migration Laravel sesuai ERD final
4. Mulai development modul per modul (Buku → Berita → Integrasi Jurnal → Landing Page)
5. Paralel: mulai kustomisasi tema OJS
