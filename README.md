<div align="center">

# 🏫 Sistem Informasi Kegiatan Sekolah & E-Voting Terpadu
**Platform Modern Berbasis Web untuk Pengelolaan Kegiatan Kesiswaan, Classmeeting, dan Pemilihan Ketua OSIS**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

</div>

---

## 📖 Tentang Aplikasi

**Sistem Kegiatan Sekolah** adalah solusi digital terpadu yang dirancang khusus untuk memodernisasi dan mengotomatiskan seluruh agenda kesiswaan di lingkungan sekolah. Mulai dari perhelatan **Classmeeting**, pemilihan umum Ketua OSIS (**E-Voting**), hingga publikasi agenda sekolah dan pengumuman resmi.

Dengan sistem ini, proses manual yang rentan terhadap kekeliruan (seperti pencatatan skor lomba di kertas, penghitungan suara fisik pemilu, atau pendaftaran tim lomba yang tercecer) digantikan oleh platform web interaktif, transparan, dan dapat diakses secara *real-time* oleh seluruh warga sekolah.

---

## ✨ Fitur-Fitur Utama

### 🏆 1. Modul Classmeeting
- **Katalog & Cabang Lomba**: Menampilkan daftar perlombaan dalam berbagai kategori (Olahraga, E-Sport, Seni, Akademik, dll) beserta jadwal, waktu, dan lokasi perlombaan.
- **Pendaftaran Tim Mandiri**: Ketua Kelas dapat mendaftarkan tim perwakilan kelas beserta daftar anggota pemain secara online.
- **Verifikasi Tim oleh Panitia**: Panitia lomba dapat meninjau, menyetujui (*Approve*), atau menolak (*Reject*) pendaftaran tim.
- **Jadwal & Hasil Pertandingan**: Jadwal pertandingan terstruktur rapi dan panitia dapat memasukkan hasil juara (Juara 1, 2, dan 3).
- **Leaderboard & Klasemen Medali Real-Time**: Perhitungan otomatis perolehan medali Emas (Gold), Perak (Silver), Perunggu (Bronze) serta total poin untuk menentukan kelas Juara Umum.

### 🗳️ 2. Modul E-Voting (Pemilihan Ketua OSIS)
- **Profil Calon / Kandidat**: Halaman kandidat interaktif lengkap dengan foto, nomor urut, visi & misi, serta tautan video kampanye.
- **Sistem Pemilihan Terverifikasi**: Menjamin asas LUBER JURDIL (Langsung, Umum, Bebas, Rahasia, Jujur, dan Adil). Setiap siswa yang terotentikasi NIS hanya memiliki hak **1 suara** (mencegah *double-voting*).
- **Manajemen Sesi Pemilihan**: Panitia/Admin dapat membuka (*OPEN*) dan menutup (*CLOSED*) sesi pemungutan suara sesuai jadwal.
- **Real-Count Interaktif**: Grafik perolehan suara *real-time* yang transparan dan dapat disaksikan langsung oleh siswa maupun panitia.

### 📅 3. Manajemen Event & Agenda Sekolah
- **Multi-Event Support**: Mendukung berbagai jenis kegiatan sekolah seperti Classmeeting, Pemilu OSIS, MPLS, Pentas Seni, dan Lomba Hari Kemerdekaan.
- **Status Kegiatan Dinamis**: Pemilahan otomatis status kegiatan (*Upcoming*, *Active*, *Ended*) dengan banner gambar dan deskripsi lengkap.

### 📢 4. Papan Pengumuman Digital
- **Pusat Informasi Terpusat**: Publikasi berita dan pengumuman resmi dari panitia atau pihak sekolah.
- **Filter Berdasarkan Kategori**: Memudahkan pencarian informasi berdasarkan kategori Pengumuman Sekolah, Informasi Lomba, Pemilu OSIS, dan Pengumuman Juara.

### 👥 5. Role-Based Access Control (RBAC)
Sistem memiliki 5 tingkatan hak akses yang terisolasi dengan aman:
| Peran (Role) | Hak Akses & Kemampuan Utama |
|---|---|
| **Super Admin** | Akses penuh: manajemen pengguna, konfigurasi profil sekolah, master kelas, kategori lomba, dan reset data. |
| **Panitia** | Mengelola event, cabang lomba, verifikasi pendaftaran tim, input hasil lomba & medali, serta kontrol sesi voting pemilu. |
| **Ketua Kelas** | Mendaftarkan tim kelas untuk cabang lomba, mengelola daftar anggota tim, dan memantau status persetujuan panitia. |
| **Siswa** | Melihat agenda, jadwal pertandingan, klasemen medali, profil kandidat, dan memberikan suara saat sesi voting dibuka. |
| **Kandidat** | Memiliki halaman profil kandidat, melihat statistik kampanye dan perolehan suara. |

### ⚙️ 6. Master Data & Kustomisasi
- **Master Data Kelas**: Pengelolaan tingkat (X, XI, XII) dan jurusan (IPA, IPS, RPL, dll).
- **Kategori Lomba Kustom**: Tambah/edit kategori lomba dengan pilihan ikon emoji dan tema warna label.
- **Pengaturan Profil Sekolah**: Personalisasi nama sekolah dan logo sekolah terpusat.
- **Dark Mode & Light Mode**: Desain responsif dengan dukungan tema terang dan gelap yang nyaman di mata.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**:
  - [Next.js 15](https://nextjs.org/) (App Router Architecture)
  - [React 19](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Radix UI](https://www.radix-ui.com/)
  - [Lucide React Icons](https://lucide.dev/)
  - [Recharts](https://recharts.org/) (Data Visualization)
  - [Sonner](https://sonner.emilkowal.ski/) (Toast Notifications)
- **Backend & Database**:
  - Next.js Route Handlers (RESTful API)
  - [Prisma ORM v7](https://www.prisma.io/)
  - [PostgreSQL](https://www.postgresql.org/) (Kompatibel dengan Neon Database, Supabase, atau PostgreSQL lokal)
- **Autentikasi & Keamanan**:
  - JSON Web Tokens (JWT) & HTTP-only Cookies
  - Enkripsi password menggunakan `bcryptjs`

---

## 📂 Struktur Direktori

```text
sistem-kegiatan-sekolah-app/
├── app/
│   ├── api/                      # REST API Endpoints (Auth, Events, Teams, Voting, dll)
│   ├── auth/
│   │   └── login/                # Halaman Autentikasi Siswa & Petugas
│   ├── dashboard/
│   │   ├── classmeeting/         # Modul Lomba, Tim, Jadwal, Hasil & Klasemen
│   │   ├── events/               # Manajemen Event Sekolah
│   │   ├── pemilu/               # Modul E-Voting, Kandidat, Real-Count & Panel Admin
│   │   ├── pengumuman/           # Modul Pengumuman
│   │   ├── settings/             # Konfigurasi Sekolah, Kelas & Kategori Lomba
│   │   ├── users/                # Manajemen Data Pengguna & Role
│   │   ├── layout.tsx            # Shell Dashboard dengan Sidebar & Header Dinamis
│   │   └── page.tsx              # Ringkasan Dashboard & Statistik
│   ├── landing/                  # Landing Page Publik
│   ├── globals.css               # Desain Sistem & Variabel Tema
│   ├── layout.tsx                # Root Layout
│   └── page.tsx                  # Home Redirection
├── components/
│   ├── dashboard/                # Komponen Sidebar & Navigasi Dashboard
│   └── ui/                       # Komponen Antarmuka Reusable (Button, Dialog, Card, dll)
├── context/
│   ├── AuthContext.tsx           # State Manajemen Autentikasi & Sesi User
│   └── ThemeContext.tsx          # State Manajemen Tema Gelap/Terang
├── lib/
│   ├── auth.ts                   # Helper JWT & Verifikasi Cookie
│   └── prisma.ts                 # Inisialisasi Prisma Client Database
├── prisma/
│   ├── schema.prisma             # Skema Database & Relasi Model
│   └── seed.ts                   # Data Seeder Awal (Users, Events, Lomba, Kandidat)
├── .env.example                  # Template Konfigurasi Environment Variable
└── package.json                  # Dependensi & Script Proyek
```

---

## 🚀 Panduan Memulai (Getting Started)

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18.18 atau lebih baru.
- Database [PostgreSQL](https://www.postgresql.org/) (dapat menggunakan [Neon.tech](https://neon.tech/), [Supabase](https://supabase.com/), atau instance lokal).

### 1. Kloning Repository
```bash
git clone https://github.com/rayyanbabab/sistem-kegiatan-sekolah-app.git
cd sistem-kegiatan-sekolah-app
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file template `.env.example` ke `.env`:
```bash
cp .env.example .env
```
Sesuaikan nilai `DATABASE_URL` dan `JWT_SECRET` pada file `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/sistem_kegiatan_db?schema=public"
JWT_SECRET="masukkan-kunci-rahasia-jwt-yang-panjang-dan-aman"
```

### 4. Sinkronisasi & Seeding Database
Jalankan migrasi skema database dan masukkan data bawaan (seeder):
```bash
# Sinkronkan skema ke database
npm run db:push

# Generate client Prisma
npm run db:generate

# Masukkan data demo awal
npm run db:seed
```

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses aplikasi di: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Akun Uji Coba Bawaan (Demo Credentials)

Setelah menjalankan `npm run db:seed`, Anda dapat langsung masuk menggunakan akun pengujian berikut:

| Peran (Role) | NIS | Password Default | Keterangan |
|---|---|---|---|
| **Super Admin** | `00000001` | `password123` | Akses penuh ke seluruh menu & konfigurasi |
| **Panitia OSIS** | `00000002` | `password123` | Manajemen lomba, jadwal, hasil, dan voting |
| **Ketua Kelas** | `20240001` | `password123` | Ketua Kelas XI IPA 2 (pendaftaran tim lomba) |
| **Siswa** | `20240002` | `password123` | Siswa XI IPA 2 (voting & pantau hasil) |
| **Siswa** | `20240003` | `password123` | Siswa XI IPS 1 |
| **Kandidat 1** | `20230001` | `password123` | Kandidat Ketua OSIS No. Urut 1 (Siti Nurhaliza) |
| **Kandidat 2** | `20230002` | `password123` | Kandidat Ketua OSIS No. Urut 2 (Budi Santoso) |

---

## 📜 Daftar Script NPM

| Command | Fungsi |
|---|---|
| `npm run dev` | Menjalankan local development server Next.js |
| `npm run build` | Melakukan build produksi aplikasi |
| `npm run start` | Menjalankan server aplikasi versi produksi |
| `npm run db:push` | Melakukan sinkronisasi langsung skema Prisma ke database |
| `npm run db:generate` | Memperbarui kode Prisma Client dari schema.prisma |
| `npm run db:seed` | Menjalankan skrip seeder data awal (`prisma/seed.ts`) |
| `npm run db:studio` | Membuka antarmuka GUI Prisma Studio di browser untuk melihat isi database |

---

## 📄 Lisensi & Pembuat

Dikembangkan oleh **[rayyanbabab](https://github.com/rayyanbabab)**.  
Dipersilakan untuk dikembangkan dan diadaptasi untuk kebutuhan kegiatan kesiswaan di sekolah Anda.
