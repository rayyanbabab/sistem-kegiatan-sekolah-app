'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ui/ThemeToggle'
import {
  Trophy,
  Vote,
  Calendar,
  Megaphone,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  Globe,
  Clock,
  ArrowUpRight,
} from 'lucide-react'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'classmeeting' | 'pemilu' | 'agenda'>('classmeeting')

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* ─── Sticky Header / Navbar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
              SM
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-foreground block leading-tight">
                SMKS Digital
              </span>
              <span className="text-[11px] text-muted-foreground block leading-none">
                Sistem Kegiatan Sekolah
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <a href="#modul" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Modul Utama
            </a>
            <a href="#peran" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Hak Akses Peran
            </a>
            <a href="#alur" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Alur Kegiatan
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button size="sm" className="font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4">
                Masuk Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ──────────────────────────────────────────────────── */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-border/60">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-semibold mb-6 border border-border">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              <span>Portal Resmi Kesiswaan & Kegiatan Sekolah</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15] text-balance mb-6">
              Pengelolaan Kegiatan Sekolah yang Teratur, Terbuka, dan Akuntabel.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-balance mb-8">
              Pusat koordinasi kompetisi Classmeeting, pemungutan suara Pemilu OSIS berbasis NIS, publikasi jadwal tanding, serta pengumuman resmi kesiswaan dalam satu sistem terintegrasi.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/auth/login">
                <Button size="lg" className="h-11 px-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                  Masuk dengan NIS / Akun
                </Button>
              </Link>
              <a href="#modul">
                <Button size="lg" variant="outline" className="h-11 px-6 font-medium border-border text-foreground hover:bg-muted">
                  Lihat Modul & Fitur
                </Button>
              </a>
            </div>
          </div>

          {/* Interactive Live Activity Preview (C-3 Content-Driven Composition) */}
          <div className="surface-card p-6 rounded-xl border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-border gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Pratinjau Sistem Aktif
                </span>
                <h2 className="text-base font-bold text-foreground">
                  Alur Operasional di SMKS Digital
                </h2>
              </div>

              {/* Functional tabs */}
              <div className="flex items-center bg-muted p-1 rounded-lg border border-border/60 self-start sm:self-auto">
                <button
                  onClick={() => setActiveTab('classmeeting')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeTab === 'classmeeting'
                      ? 'bg-card text-foreground shadow-sm font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Classmeeting
                </button>
                <button
                  onClick={() => setActiveTab('pemilu')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeTab === 'pemilu'
                      ? 'bg-card text-foreground shadow-sm font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Pemilu OSIS
                </button>
                <button
                  onClick={() => setActiveTab('agenda')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeTab === 'agenda'
                      ? 'bg-card text-foreground shadow-sm font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Papan Agenda
                </button>
              </div>
            </div>

            {/* Tab 1: Classmeeting Preview */}
            {activeTab === 'classmeeting' && (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">Futsal Putra</span>
                    <span className="text-[10px] px-2 py-0.5 rounded chip-active font-medium">Selesai</span>
                  </div>
                  <p className="text-sm font-bold text-foreground">XII RPL 1 vs XI TKJ 2</p>
                  <p className="text-xs text-muted-foreground">Skor Akhir: 4 - 2 • Lapangan Utama</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">E-Sport Mobile Legends</span>
                    <span className="text-[10px] px-2 py-0.5 rounded chip-upcoming font-medium">Hari Ini 14:00</span>
                  </div>
                  <p className="text-sm font-bold text-foreground">X DKV 1 vs XII TKJ 1</p>
                  <p className="text-xs text-muted-foreground">Babak Semifinal • Lab Komputer 2</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">Leaderboard Kelas</span>
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <p className="text-sm font-bold text-foreground">1. XII RPL 1 (180 Poin)</p>
                  <p className="text-xs text-muted-foreground">2. XI TKJ 2 (145 Poin) • 3. X DKV 1 (120 Poin)</p>
                </div>
              </div>
            )}

            {/* Tab 2: Pemilu OSIS Preview */}
            {activeTab === 'pemilu' && (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border/70 space-y-2">
                  <span className="text-xs font-semibold text-primary">Otentikasi Aman</span>
                  <p className="text-sm font-bold text-foreground">1 Siswa = 1 Suara Sah</p>
                  <p className="text-xs text-muted-foreground">Verifikasi langsung menggunakan NIS terdaftar, mencegah duplikasi suara.</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/70 space-y-2">
                  <span className="text-xs font-semibold text-primary">Kandidat Terverifikasi</span>
                  <p className="text-sm font-bold text-foreground">Profil, Visi, & Misi Lengkap</p>
                  <p className="text-xs text-muted-foreground">Siswa dapat mempelajari program kerja paslon sebelum menentukan pilihan di bilik suara digital.</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/70 space-y-2">
                  <span className="text-xs font-semibold text-primary">Real Count Transparan</span>
                  <p className="text-sm font-bold text-foreground">Rekap Suara Real-Time</p>
                  <p className="text-xs text-muted-foreground">Persentase suara masuk dapat dipantau langsung oleh seluruh warga sekolah setelah sesi dibuka.</p>
                </div>
              </div>
            )}

            {/* Tab 3: Agenda & Pengumuman Preview */}
            {activeTab === 'agenda' && (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border/70 space-y-2">
                  <span className="text-xs font-semibold text-primary">Pengumuman Terkini</span>
                  <p className="text-sm font-bold text-foreground">Petunjuk Teknis Classmeeting 2026</p>
                  <p className="text-xs text-muted-foreground">Diterbitkan oleh Pembina OSIS • Wajib dipahami seluruh delegasi kelas.</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/70 space-y-2">
                  <span className="text-xs font-semibold text-primary">Pendaftaran Lomba</span>
                  <p className="text-sm font-bold text-foreground">Batas Waktu Pengumpulan Tim</p>
                  <p className="text-xs text-muted-foreground">Ketua Kelas mendaftarkan anggota regu secara online melalui dashboard kelas.</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/70 space-y-2">
                  <span className="text-xs font-semibold text-primary">Kalender Kesiswaan</span>
                  <p className="text-sm font-bold text-foreground">Agenda Semester Genap</p>
                  <p className="text-xs text-muted-foreground">Jadwal Classmeeting, Orasi Kandidat OSIS, dan Hari Pemungutan Suara.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Modul Utama Section ───────────────────────────────────────────── */}
      <section id="modul" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-border/60">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
              Struktur Modul
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Tiga Pilar Utama Sistem Kesiswaan
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Dibangun khusus untuk menjawab kebutuhan operasional kesiswaan di sekolah, dari pendaftaran tim hingga rekapitulasi data.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Modul 1: Classmeeting */}
            <div className="surface-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-secondary text-foreground/80 flex items-center justify-center mb-4 border border-border">
                  <Trophy className="w-4 h-4 text-foreground/80" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Classmeeting & Kompetisi</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  Manajemen turnamen antarkelas mencakup pendaftaran tim peserta, pengaturan bagan, jadwal tanding, dan pembaruan klasemen poin kelas secara real-time.
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-border text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />
                  <span>Pendaftaran delegasi oleh Ketua Kelas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />
                  <span>Verifikasi peserta oleh Panitia Lomba</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />
                  <span>Input skor & penentuan otomatis juara</span>
                </li>
              </ul>
            </div>

            {/* Modul 2: Pemilu OSIS */}
            <div className="surface-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-secondary text-foreground/80 flex items-center justify-center mb-4 border border-border">
                  <Vote className="w-4 h-4 text-foreground/80" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Pemilu Raya OSIS</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  Sistem e-voting demokrasi sekolah yang jujur dan transparan. Akses pemungutan suara dibatasi satu kali per siswa terdaftar dengan pengamanan database.
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-border text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />
                  <span>Katalog visi, misi, dan video paslon</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />
                  <span>Bilik suara digital one-time voting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />
                  <span>Layar Real Count untuk transparansi publik</span>
                </li>
              </ul>
            </div>

            {/* Modul 3: Manajemen Event & Pengumuman */}
            <div className="surface-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-secondary text-foreground/80 flex items-center justify-center mb-4 border border-border">
                  <Calendar className="w-4 h-4 text-foreground/80" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Agenda & Pengumuman</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  Pusat komunikasi resmi sekolah. Publikasikan surat keputusan, perubahan jadwal pertandingan, tata tertib, dan pengumuman pemenang secara terpusat.
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-border text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />
                  <span>Kategori pengumuman terstruktur</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />
                  <span>Kalender kegiatan kesiswaan terintegrasi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" strokeWidth={1.75} />
                  <span>Akses informasi langsung ke ponsel siswa</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Hak Akses Peran Section (Matriks Akses) ────────────────────────── */}
      <section id="peran" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-border/60 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
              Keamanan & Hak Akses
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Matriks Peran Pengguna
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Sistem membatasi akses fitur secara ketat sesuai dengan tugas dan tanggung jawab masing-masing civitas akademika.
            </p>
          </div>

          <div className="surface-card rounded-xl overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-muted/60 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-4">Peran (Role)</th>
                    <th className="px-6 py-4">Tanggung Jawab Utama</th>
                    <th className="px-6 py-4">Akses Modul</th>
                    <th className="px-6 py-4">Batas Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Super Admin / Pembina
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      Mengelola seluruh event, sesi voting, master data kelas, dan akun pengguna.
                    </td>
                    <td className="px-6 py-4">
                      <span className="academic-badge">Semua Modul</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      Akses penuh konfigurasi sistem
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                        Panitia Event / OSIS
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      Verifikasi pendaftar lomba, susun jadwal pertandingan, dan input skor hasil lomba.
                    </td>
                    <td className="px-6 py-4">
                      <span className="academic-badge">Classmeeting & Pemilu</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      Input hasil & kelola peserta
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Ketua Kelas
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      Mendaftarkan delegasi siswa kelas untuk cabang lomba dan memantau status verifikasi.
                    </td>
                    <td className="px-6 py-4">
                      <span className="academic-badge">Tim Kelas & Jadwal</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      Hanya kelola anggota tim kelasnya
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Siswa
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      Memberikan suara sah pada bilik voting OSIS, mengecek jadwal tanding, dan membaca pengumuman.
                    </td>
                    <td className="px-6 py-4">
                      <span className="academic-badge">Voting, Jadwal, Leaderboard</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      Hak suara 1 kali per pemilu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Alur Kegiatan Section ─────────────────────────────────────────── */}
      <section id="alur" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-border/60">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
              Tahapan Operasional
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Alur Pelaksanaan Kegiatan Sekolah
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Proses berkesinambungan dari inisiasi kegiatan hingga penerbitan rekapitulasi nilai akhir.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="surface-card p-5 relative">
              <span className="text-xs font-bold text-primary block mb-2">Langkah 01</span>
              <h3 className="font-bold text-base text-foreground mb-1">Pengumuman & Registrasi</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pembina merilis daftar cabang lomba atau jadwal pemilu. Ketua kelas mendaftarkan nama delegasi siswa.
              </p>
            </div>

            <div className="surface-card p-5 relative">
              <span className="text-xs font-bold text-primary block mb-2">Langkah 02</span>
              <h3 className="font-bold text-base text-foreground mb-1">Verifikasi & Jadwal</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Panitia memvalidasi keabsahan peserta, mengundi bagan turnamen, dan menerbitkan jadwal pertandingan resmi.
              </p>
            </div>

            <div className="surface-card p-5 relative">
              <span className="text-xs font-bold text-primary block mb-2">Langkah 03</span>
              <h3 className="font-bold text-base text-foreground mb-1">Pelaksanaan & Voting</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pertandingan berlangsung dengan pembaruan skor langsung. Siswa menyalurkan hak suara pada bilik OSIS.
              </p>
            </div>

            <div className="surface-card p-5 relative">
              <span className="text-xs font-bold text-primary block mb-2">Langkah 04</span>
              <h3 className="font-bold text-base text-foreground mb-1">Rekapitulasi & Penganugerahan</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sistem menghitung akumulasi poin kelas untuk piala bergilir dan menampilkan penetapan ketua OSIS terpilih.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Callout Section ───────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40">
        <div className="max-w-4xl mx-auto surface-card p-8 sm:p-12 text-center rounded-2xl border border-border">
          <div className="w-10 h-10 rounded-lg bg-secondary text-primary flex items-center justify-center mx-auto mb-4 border border-border">
            <ShieldCheck className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Akses Akun Siswa & Panitia
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Gunakan Nomor Induk Siswa (NIS) atau akun resmi yang diterbitkan sekolah untuk masuk ke dashboard kegiatan.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/auth/login">
              <Button size="lg" className="h-11 px-8 font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                Masuk ke Halaman Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Clean Academic Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                  SM
                </div>
                <span className="font-bold text-foreground text-base">SMKS Digital</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Portal informasi dan koordinasi kesiswaan resmi untuk mewujudkan kegiatan sekolah yang transparan dan tertib.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Tautan Langsung</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><a href="#modul" className="hover:text-foreground transition-colors">Modul Classmeeting</a></li>
                <li><a href="#modul" className="hover:text-foreground transition-colors">Modul Pemilu OSIS</a></li>
                <li><a href="#peran" className="hover:text-foreground transition-colors">Panduan Hak Akses</a></li>
                <li><a href="#alur" className="hover:text-foreground transition-colors">Alur Pelaksanaan</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Akses Sistem</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/auth/login" className="hover:text-foreground transition-colors">Login Siswa</Link></li>
                <li><Link href="/auth/login" className="hover:text-foreground transition-colors">Login Panitia & Admin</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Pusat Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Sekretariat Kesiswaan</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Gedung Kesiswaan Lt. 2</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>kesiswaan@smks.sch.id</span>
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  <span>smks.sch.id</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2026 SMKS Digital. Hak cipta dilindungi.</p>
            <p>Sistem Manajemen Kegiatan Sekolah v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
