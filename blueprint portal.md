# Blueprint Web Portal Sekolah (TKIT, SDIT, MTs, MA) — Panduan Vibe Coding



Dokumen ini adalah *sumber kebenaran* (source of truth) untuk membangun portal sekolah dengan bantuan agen coding (vibe coding). Tempelkan bagian yang relevan ke agen Anda (Cursor, Claude Code, v0, Lovable, dsb.) secara bertahap — jangan sekaligus.

</aside>

## 1. Ringkasan Proyek

Membangun web portal untuk satu yayasan pendidikan Islam terpadu yang menaungi **4 jenjang**: TKIT, SDIT, MTs, dan MA. Portal berfungsi sebagai pusat informasi lembaga, promosi, dan gerbang PPDB, dengan identitas yang menyatu namun tetap memberi karakter khas tiap jenjang.

**Tujuan utama:**

- Profil & informasi tiap jenjang
- Berita, agenda, dan galeri kegiatan
- Gerbang PPDB (pendaftaran calon siswa)
- Membangun kepercayaan orang tua (prestasi, kurikulum, akreditasi)

## 2. Tech Stack (ramah agen AI)

| Lapisan | Teknologi | Alasan |
| --- | --- | --- |
| Frontend | Next.js (App Router) + TypeScript | Paling dikenal agen, SEO baik |
| Styling | Tailwind CSS + shadcn/ui | Komponen cepat, konsisten |
| Database & Konten | Firebase Firestore | Satu backend untuk konten & PPDB, tanpa auto-pause |
| Autentikasi | Firebase Auth (role/custom claims) | Multi-admin: admin yayasan + admin per jenjang |
| Media & Berkas | Firebase Storage | Foto, dokumen, berkas PPDB |
| Admin | Dashboard custom di web (Next.js) | CRUD konten + verifikasi PPDB, role-based |
| Deploy | Vercel | Deploy sekali klik, gratis untuk mulai |
| PPDB | Form Next.js → Firestore + Storage | Data pendaftar, berkas, status seleksi |

<aside>
🗂️

**Satu backend (Firebase):** Semua data — konten (jenjang, berita, guru, siswa, pengurus, program, galeri) maupun PPDB — disimpan di **Firestore** dan dikelola lewat **dashboard admin custom di web**. Akses diatur per peran: **admin yayasan** (semua jenjang) dan **admin jenjang** (hanya jenjangnya) via Firebase Auth + Security Rules. Foto & berkas di Firebase Storage. Simpan hanya data yang memang untuk ditampilkan; lindungi data pribadi sensitif (NIK/NISN, alamat, kontak) dengan Security Rules yang ketat.

</aside>

## 3. Peta Situs (Information Architecture)

```
Beranda Yayasan
├── Tentang (sejarah, visi-misi, struktur, akreditasi)
├── Jenjang
│   ├── TKIT  → profil, kurikulum, program unggulan, galeri, PPDB
│   ├── SDIT  → profil, kurikulum, program unggulan, galeri, PPDB
│   ├── MTs   → profil, kurikulum, ekstrakurikuler, galeri, PPDB
│   └── MA    → profil, kurikulum, jurusan/peminatan, galeri, PPDB
├── Berita & Agenda
├── Galeri
├── Prestasi
├── PPDB Online (terpusat, filter per jenjang)
└── Kontak
```

> Gunakan **warna/ikon aksen berbeda per jenjang** agar tetap terasa karakternya dalam satu portal.
**Galeri:** tiap jenjang punya galeri sendiri; beranda portal menampilkan **foto terbaru agregat** dari semua jenjang, dengan **tombol menuju galeri tiap jenjang**.
> 

## 4. Model Data Firestore (fondasi — kerjakan lebih dulu)

Semua data disimpan sebagai **koleksi/dokumen Firestore** dan dikelola lewat dashboard admin web. `jenjang` menjadi acuan; dokumen lain menyimpan `jenjangId` untuk filter per tingkat. Sertakan `status` (draft/published) dan audit (`createdBy`, `updatedAt`) pada konten. Gunakan interface berikut sebagai tipe TypeScript bersama di `types/`.

```tsx
import type { Timestamp } from 'firebase/firestore'

interface Jenjang {
  id: string          // 'tkit' | 'sdit' | 'mts' | 'ma'
  nama: string
  slug: string
  deskripsi: string
  visiMisi: string    // rich text (HTML/markdown)
  warnaAksen: string
  logoUrl: string
  kepalaSekolah: string
  akreditasi: string
}

interface Berita {
  id: string
  judul: string
  slug: string
  jenjangId?: string  // kosong = berita yayasan
  tanggal: Timestamp
  gambarUtamaUrl: string
  ringkasan: string
  isi: string         // rich text (HTML/markdown)
  status: 'draft' | 'published'
  createdBy: string   // uid admin
  updatedAt: Timestamp
}

interface Guru { id: string; nama: string; fotoUrl: string; jabatan: string; jenjangId: string; mataPelajaran: string }
interface Siswa { id: string; nama: string; fotoUrl: string; jenjangId: string; kelas: string; tahunAjaran: string }
interface Pengurus { id: string; nama: string; fotoUrl: string; organisasi: string; jabatan: string; jenjangId: string; periode: string }
interface Program { id: string; nama: string; jenjangId: string; kategori: 'kurikulum' | 'unggulan' | 'jurusan' | 'ekskul'; deskripsi: string; ikonUrl: string }
// agenda, galeri, prestasi: pola serupa, selalu sertakan jenjangId

// Data PPDB (transaksional)
interface PendaftaranPPDB {
  id: string
  jenjangId: string
  namaCalon: string
  dataOrangTua: Record<string, string>
  berkasUrls: string[]
  status: 'baru' | 'diverifikasi' | 'diterima' | 'ditolak'
  createdAt: Timestamp
}

// Akun admin & peran (untuk multi-admin)
interface UserProfile {
  uid: string
  nama: string
  email: string
  role: 'admin_yayasan' | 'admin_jenjang'
  jenjangId?: string  // WAJIB untuk admin_jenjang; menentukan cakupan akses
}
```

**Model peran (role-based access):**

- `admin_yayasan` → akses penuh semua jenjang & PPDB.
- `admin_jenjang` → hanya boleh membaca/menulis dokumen yang `jenjangId`-nya cocok.

Set peran sebagai **Firebase Auth custom claims**, lalu **tegakkan di Firestore Security Rules** (bukan sekadar disembunyikan di UI):

```jsx
// contoh Firestore Security Rules (disederhanakan)
function isYayasan() {
  return request.auth.token.role == 'admin_yayasan';
}
function isJenjangAdmin(jenjangId) {
  return request.auth.token.role == 'admin_jenjang'
    && request.auth.token.jenjangId == jenjangId;
}

match /berita/{id} {
  allow read: if true; // konten publik
  allow write: if isYayasan() || isJenjangAdmin(request.resource.data.jenjangId);
}
// pola serupa untuk guru, siswa, pengurus, program, galeri, agenda, prestasi

match /pendaftaranPPDB/{id} {
  allow create: if true; // calon pendaftar boleh mengirim
  allow read, update: if isYayasan() || isJenjangAdmin(resource.data.jenjangId);
}
```

### Matriks Hak Akses per Peran

Pembeda utama: **konten jenjang** memiliki `jenjangId`, sedangkan **konten yayasan/portal utama** tidak (`jenjangId` kosong). Security Rules otomatis mengunci konten tanpa `jenjangId` sehingga hanya bisa dikelola admin yayasan.

| Data / Konten | admin_jenjang (hanya jenjangnya) | admin_yayasan |
| --- | --- | --- |
| Artikel/berita jenjang | ✅ | ✅ (semua) |
| Artikel/berita portal utama | ❌ | ✅ |
| Guru | ✅ | ✅ (semua) |
| Siswa | ✅ | ✅ (semua) |
| Struktur organisasi jenjang (OSIS, dll) | ✅ | ✅ (semua) |
| Struktur/pengurus yayasan | ❌ | ✅ |
| Program & kurikulum jenjang | ✅ | ✅ (semua) |
| Galeri jenjang | ✅ | ✅ (semua) |
| Galeri portal utama (agregat otomatis + galeri acara yayasan) | ❌ (foto jenjangnya tampil otomatis via agregat) | ✅ |
| Profil jenjang (visi-misi, kepala sekolah) | ✅* | ✅ (semua) |
| PPDB pendaftar | ✅ (verifikasi/seleksi jenjangnya) | ✅ (semua) |
| Kelola akun admin | ❌ | ✅ |
| Pengaturan situs global (menu, tema, kontak) | ❌ | ✅ |

*Untuk tahap pengembangan ini, **admin jenjang boleh mengedit profil jenjang & data kepala sekolah** miliknya masing-masing. Admin yayasan tetap dapat mengedit semuanya.

## 5. Daftar Fitur (PRD ringkas)

| Prioritas | Fitur | Keterangan |
| --- | --- | --- |
| P0 | Beranda yayasan | Hero, sekilas 4 jenjang, berita terbaru, foto galeri terbaru (agregat) + tombol ke galeri jenjang, CTA PPDB |
| P0 | Halaman jenjang dinamis | `/jenjang/[slug]` dari data Firestore |
| P0 | Berita & detail berita | List + filter jenjang, halaman detail |
| P0 | Halaman Tentang & Kontak | Profil yayasan, peta, form kontak |
| P1 | Galeri & Prestasi | Galeri per jenjang; beranda menampilkan foto terbaru agregat semua jenjang + tombol ke galeri jenjang |
| P1 | Profil guru | Per jenjang |
| P0 | Dashboard admin (role-based) | Login + CRUD konten; admin yayasan & admin per jenjang |
| P1 | PPDB (landing + form) | Modul terpisah; lihat bagian 7 |
| P2 | Portal siswa/orang tua | Nilai, absensi, SPP (fase lanjutan) |
| P2 | Multibahasa / mode gelap | Opsional |

## 6. Roadmap Vibe Coding (bertahap)

Kerjakan **satu fase per sesi**, uji, lalu commit sebelum lanjut.

1. **Setup** — Inisialisasi Next.js + TypeScript + Tailwind + shadcn/ui; koneksikan Firebase SDK (Firestore, Auth, Storage).
2. **Model data & Auth** — Buat koleksi Firestore sesuai bagian 4; siapkan Firebase Auth + custom claims (role) + Security Rules; isi data contoh 4 jenjang.
3. **Layout global** — Header (navigasi + dropdown jenjang), footer, tema warna, responsif.
4. **Beranda** — Hero, kartu 4 jenjang, berita terbaru, galeri foto terbaru (agregat semua jenjang + tombol ke galeri jenjang), CTA PPDB.
5. **Halaman jenjang dinamis** — Route `/jenjang/[slug]`, tampilkan profil, program, guru, galeri per jenjang.
6. **Berita & agenda** — List + filter + halaman detail (rich text).
7. **Galeri, prestasi, tentang, kontak.**
8. **Dashboard admin (role-based)** — Login (Firebase Auth), CRUD konten dengan pembatasan per jenjang, editor rich text, kelola akun admin.
9. **PPDB** — Landing + form pendaftaran → Firestore/Storage; verifikasi & seleksi di dashboard admin.
10. **SEO & polish** — Metadata, sitemap, Open Graph, optimasi gambar.
11. **Deploy** — Vercel + Firebase; domain `.sch.id`.

## 7. Catatan Penting: PPDB

PPDB melibatkan **logika aplikasi** (pendaftaran, unggah berkas, status seleksi, pembayaran) — ini **bukan** ranah CMS. Perlakukan sebagai modul terpisah:

- **Form + database:** Next.js form → Firebase Firestore (data pendaftar), berkas via Firebase Storage, akses admin via Firebase Auth. Dipilih karena free tier Firebase tidak *auto-pause* seperti Supabase.
- **Notifikasi:** email otomatis status pendaftaran.
- **Dashboard admin:** halaman terlindungi untuk memverifikasi & menyeleksi.
- **Alternatif cepat:** layanan form pihak ketiga di fase awal, lalu ditingkatkan.

## 8. Prinsip Arsitektur Kode (hindari file monolitik)

Instruksikan agen untuk **menghindari file monolitik** sejak awal agar mudah dikembangkan tanpa refactor besar di kemudian hari.

- **Struktur berbasis fitur (feature-based):** kelompokkan kode per domain (mis. `features/jenjang`, `features/berita`, `features/ppdb`), bukan menumpuk dalam satu file besar.
- **Komponen kecil & reusable:** satu komponen satu tanggung jawab; pecah UI berulang (Card, Section, Hero) ke `components/ui`.
- **Pisahkan lapisan:** data-fetching (Firestore) di `lib/`, tipe di `types/`, komponen presentasi terpisah dari logika.
- **Batasi ukuran file:** targetkan < ~200 baris; jika lebih, pecah menjadi modul lebih kecil.
- **Satu sumber tipe:** turunkan tipe TypeScript dari model data Firestore, lalu dipakai ulang di seluruh aplikasi.
- **Konfigurasi terpusat:** warna, font, dan konstanta di satu tempat (design tokens / config), tidak di-hardcode tersebar.
- **Service terisolasi:** bungkus query/mutation Firestore dalam fungsi service (mis. `lib/ppdb.ts`) agar mudah diuji & diganti.

Contoh struktur folder yang disarankan:

```
src/
├── app/                 # routing Next.js (App Router)
│   ├── (site)/          # halaman publik
│   └── ppdb/            # modul PPDB
├── components/
│   ├── ui/              # komponen dasar reusable (Button, Card, ...)
│   └── layout/          # Header, Footer, Nav
├── features/
│   ├── jenjang/
│   ├── berita/
│   ├── galeri/
│   └── ppdb/
├── lib/                 # sanity client, firebase client, service fns
├── types/               # tipe TypeScript bersama
└── styles/              # tema & design tokens
```

## 9. Panduan Desain (Modern, Elegan, Islami)

Gaya visual: **modern, elegan, dan bernuansa Islami** — bersih, berkelas, dan tidak ramai.

**Palet warna (contoh):**

- Hijau zamrud / hijau tua sebagai warna utama (nuansa Islami, menenangkan)
- Emas / kuning lembut sebagai aksen (kesan elegan)
- Krem / off-white sebagai latar (bersih & lapang)
- Abu-abu gelap untuk teks (kontras nyaman dibaca)
- Aksen berbeda per jenjang, tetap dalam keluarga palet yang sama

**Tipografi:**

- Judul: serif elegan atau sans modern berkarakter (mis. Playfair Display / Fraunces, atau Poppins / Plus Jakarta Sans)
- Isi: sans-serif bersih & mudah dibaca (Inter / Plus Jakarta Sans)
- Dukung tampilan teks Arab yang rapi bila menampilkan kaligrafi/ayat (gunakan font Arab yang sesuai)

**Elemen visual Islami (halus, tidak berlebihan):**

- Ornamen geometris / arabesque tipis sebagai pembatas atau latar
- Lengkungan (arch) lembut pada kartu atau gambar sebagai sentuhan khas
- White space lapang untuk kesan tenang & elegan

**Prinsip UI:**

- Mobile-first & responsif
- Konsisten melalui design tokens (warna, spacing, radius, shadow)
- Aksesibilitas: kontras cukup, ukuran teks nyaman
- Animasi halus & secukupnya (transisi lembut, bukan mencolok)

## 10. Contoh Master Prompt untuk Agen

<aside>
🤖

Tempelkan ini di awal sesi, lalu berikan instruksi per fase dari roadmap.

</aside>

```
Kamu adalah senior full-stack engineer. Kita membangun web portal sekolah untuk
satu yayasan Islam terpadu dengan 4 jenjang: TKIT, SDIT, MTs, MA.

Stack WAJIB: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui,
Firebase (Firestore + Auth + Storage) sebagai SATU backend untuk konten & PPDB, deploy Vercel.
Semua konten (jenjang, berita, guru, siswa, pengurus, program, galeri) & PPDB disimpan di Firestore.
Dashboard admin dibangun custom di web dengan role: admin_yayasan (semua jenjang) & admin_jenjang (hanya jenjangnya) via Firebase Auth custom claims + Security Rules.

Aturan:
- Ikuti content model, peta situs, prinsip arsitektur, dan panduan desain yang saya berikan sebagai sumber kebenaran.
- HINDARI file monolitik: struktur berbasis fitur, komponen kecil & reusable, pisahkan data/logika/tampilan, file < ~200 baris, design tokens terpusat. Kode harus mudah dikembangkan tanpa refactor besar.
- Desain harus modern, elegan, dan bernuansa Islami: palet hijau/emas/krem, tipografi elegan, ornamen geometris halus, white space lapang.
- Konten & PPDB disimpan di Firestore dan dikelola via dashboard admin web. Terapkan role-based access (admin_yayasan vs admin_jenjang) dan WAJIB tegakkan di Firestore Security Rules, bukan hanya di UI.
- Kerjakan hanya fase yang saya minta; jangan menambah fitur di luar instruksi.
- Tulis kode bersih, modular, dan responsif (mobile-first).
- Setelah selesai satu fase, jelaskan cara mengujinya, lalu berhenti dan tunggu.

Tunggu instruksi fase pertama dari saya.
```

## 11. Langkah Selanjutnya

- [ ]  Buat project Firebase (aktifkan Firestore, Auth, Storage) serta repo Git
- [ ]  Jalankan Fase 1 (setup) dengan agen
- [ ]  Bangun model data Firestore + role (custom claims) & Security Rules (Fase 2)
- [ ]  Iterasi per fase mengikuti roadmap

