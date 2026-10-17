# DESIGN.md — Arah Desain SMKS Digital

## 1. Identitas & Karakter Desain
- **Konsep:** *Akademia Modern* — Portal kesiswaan dan kegiatan sekolah yang berwibawa, bersih, terstruktur, dan hangat. Menghindari klise template AI (gradien ungu-biru neon, orbs berdenyut, bento grid acak, kapsul pill berlebihan).
- **Target Pengguna:** Siswa, Ketua Kelas, Panitia Event, Kandidat OSIS, dan Guru/Super Admin.
- **Nilai Utama:** Kejelasan informasi, kemudahan akses jadwal/voting, kontras teks tinggi, dan navigasi ramah di perangkat mobile maupun desktop.

## 2. Palet Warna (Aturan R-29: 2-3 Warna Inti + 1 Aksen Terarah)
- **Warna Inti 1 (Deep Academic Navy):**
  - Light mode: `hsl(218, 48%, 18%)` — melambangkan integritas institusi pendidikan.
  - Dark mode: `hsl(218, 32%, 14%)` — latar panel yang teduh dan nyaman di mata.
- **Warna Inti 2 (Neutral Slate & Clean Paper):**
  - Light mode: Background `hsl(210, 20%, 98%)`, Card `hsl(0, 0%, 100%)`, Border `hsl(214, 20%, 88%)`.
  - Dark mode: Background `hsl(222, 47%, 7%)`, Card `hsl(222, 35%, 11%)`, Border `hsl(222, 28%, 18%)`.
- **Aksen Terarah (Warm Amber / Ochre Gold):**
  - `hsl(38, 92%, 50%)` (Dark: `hsl(40, 96%, 53%)`).
  - Digunakan **secara selektif** untuk penanda prestasi/lomba (Classmeeting), indikator sesi voting aktif, dan CTA utama.
- **Warna Status Semantik:**
  - Sukses / Terverifikasi: Hijau Emerald `hsl(158, 64%, 40%)`
  - Info / Terjadwal: Biru Cerulean `hsl(214, 78%, 52%)`
  - Perhatian / Dibatalkan: Merah Crimson `hsl(354, 70%, 54%)`
  *(Tidak menggunakan efek glow neon pada status)*.

## 3. Tipografi & Kontras (R-06, R-25)
- **Typeface:** Inter / Sans-serif sistem dengan bobot tegas (Normal 400, Medium 500, Semibold 600, Bold 700).
- **Hirarki:**
  - H1 Hero / Judul Halaman: 28px - 36px, teks solid berbobot tegas, tanpa gradien pelangi.
  - H2 Judul Seksi: 20px - 24px semibold.
  - Body & Deskripsi: 14px - 15px dengan kontras minimal 4.5:1 terhadap latar belakang di kedua mode (Light & Dark).
  - Label Form & Metadata: 12px - 13px medium, teks jelas (bukan faint/buram).
- **Gaya Teks:** Bahasa natural bahasa Indonesia tanpa buzzwords klise AI ("Revolutionary", "AI Powered", "Seamless").

## 4. Bentuk, Elevasi & Batasan Dekorasi (R-10, R-11, R-12, R-13)
- **Border Radius:** Konsisten 8px (`rounded-lg`) untuk input & tombol kecil; 12px (`rounded-xl`) untuk kartu & panel. Hindari bentuk kapsul/pill pada semua kontainer.
- **Elevasi & Shadow:** Kartu menggunakan surface solid dengan 1px border halus dan shadow halus (`shadow-sm` hingga `shadow-md`).
- **Glassmorphism:** Dibatasi maksimal 1 elemen (navbar sticky saat di-scroll). Tidak diterapkan secara massal pada kartu atau isi tabel.
- **Ikon:** Ikon fungsional relevan dari Lucide (Trophy untuk lomba, Vote untuk pemilu, Megaphone untuk pengumuman, Calendar untuk jadwal).

## 5. Dials Desain (Core Part 3)
- **ENERGY: 2** — Tenang, profesional, terstruktur, fokus pada produktivitas tugas sekolah.
- **RHYTHM: 3** — Komposisi variatif yang disesuaikan dengan tipe konten:
  - Landing: Headline sekolah tegas, ringkasan 4 pilar modul fungsional, linimasa alur kegiatan, dan panduan akses peran.
  - Dashboard: Ringkasan ringkas kegiatan aktif hari ini, pintasan aksi cepat berdasarkan peran pengguna, dan daftar kegiatan terkini.
- **MOTION: 1** — Transisi mikro yang halus (hover tombol 150ms, pembukaan modal instan/halus), tanpa animasi berulang (tanpa bouncing atau pulsing orbs).
