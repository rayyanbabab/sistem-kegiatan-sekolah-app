'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { ArrowRight, Trophy, BarChart3, Calendar, Users, Lock, Zap, Shield, Star, CheckCircle, Building2, Mail, Phone, Globe } from 'lucide-react'

export default function LandingPage() {
  const features = [
    { icon: Trophy, title: 'Manajemen Kompetisi', description: 'Kelola Classmeeting dengan pendaftaran, jadwal, dan leaderboard real-time antar kelas.', color: 'from-orange-500 to-amber-500' },
    { icon: Lock, title: 'Voting Aman', description: 'Sistem voting OSIS dengan one-time voting dan keamanan berbasis NIS.', color: 'from-blue-500 to-cyan-500' },
    { icon: BarChart3, title: 'Real Count Voting', description: 'Monitoring hasil voting real-time dengan grafik dan persentase suara kandidat.', color: 'from-violet-500 to-purple-500' },
    { icon: Calendar, title: 'Event Management', description: 'Buat dan kelola berbagai event sekolah dalam satu dashboard terpadu.', color: 'from-green-500 to-emerald-500' },
    { icon: Users, title: 'Kolaborasi Tim', description: 'Koordinasi tim, pembagian peran, dan verifikasi peserta secara otomatis.', color: 'from-pink-500 to-rose-500' },
    { icon: Zap, title: 'Pengumuman Instan', description: 'Broadcast pengumuman ke seluruh siswa dengan kategori yang terorganisir.', color: 'from-yellow-500 to-orange-500' },
  ]

  const roles = [
    { name: 'Super Admin', desc: 'Kelola semua event & user', icon: Shield, color: 'from-blue-600 to-blue-400' },
    { name: 'Panitia Event', desc: 'Verifikasi & input hasil', icon: CheckCircle, color: 'from-violet-600 to-violet-400' },
    { name: 'Ketua Kelas', desc: 'Daftar & kelola tim', icon: Star, color: 'from-cyan-600 to-cyan-400' },
    { name: 'Kandidat OSIS', desc: 'Edit profil kampanye', icon: Trophy, color: 'from-pink-600 to-pink-400' },
    { name: 'Siswa', desc: 'Vote & lihat jadwal', icon: Users, color: 'from-green-600 to-green-400' },
  ]

  const modules = [
    { title: 'Classmeeting', icon: Trophy, color: 'from-orange-500 to-red-500', items: ['Pendaftaran & verifikasi peserta', 'Jadwal pertandingan otomatis', 'Bracket tournament', 'Leaderboard real-time'] },
    { title: 'Pemilu OSIS', icon: Lock, color: 'from-blue-500 to-cyan-500', items: ['Profil kandidat dengan visi misi', 'Voting aman berbasis NIS', 'One-time voting protection', 'Real-time vote counting'] },
    { title: 'Event Management', icon: Calendar, color: 'from-purple-500 to-pink-500', items: ['Buat event sekolah dinamis', 'Kelola status event', 'Verifikasi peserta', 'Tracking hasil'] },
    { title: 'Pengumuman', icon: Zap, color: 'from-green-500 to-emerald-500', items: ['Broadcast instan ke siswa', 'Kategori pengumuman', 'Archive & search', 'Notifikasi real-time'] },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-sm">SM</span>
            </div>
            <span className="font-bold text-white text-lg">SMKS Digital</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['#features', '#modules', '#roles'].map((href, i) => (
              <a key={href} href={href} className="text-sm text-white/60 hover:text-white transition-colors">
                {['Fitur', 'Modul', 'Role'][i]}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 shadow-lg shadow-blue-500/25 font-medium">
                Masuk Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-8">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-sm text-blue-400 font-medium">Platform Manajemen Kegiatan Sekolah</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance">
            Kelola Semua Kegiatan
            <br />
            <span className="gradient-text">Sekolah Digital</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 mb-10 max-w-2xl mx-auto text-balance leading-relaxed">
            Platform terpadu untuk Classmeeting, Pemilu OSIS, Event Management, dan Pengumuman Sekolah dengan sistem keamanan role-based berbasis NIS.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/auth/login">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 shadow-2xl shadow-blue-500/30 gap-2 px-8 font-semibold text-base">
                Mulai Sekarang <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 bg-transparent gap-2 px-8 text-base">
                Lihat Fitur
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { value: '4', label: 'Modul Utama' },
              { value: '5', label: 'Role System' },
              { value: '20+', label: 'Fitur' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Fitur Lengkap & Terintegrasi</h2>
            <p className="text-white/50 text-lg">Semua yang dibutuhkan untuk mengelola kegiatan sekolah</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="glass-card rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">4 Modul Utama</h2>
            <p className="text-white/50 text-lg">Sistem terintegrasi untuk berbagai kebutuhan sekolah</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((mod, idx) => {
              const Icon = mod.icon
              return (
                <div key={idx} className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300">
                  <div className={`h-36 bg-gradient-to-br ${mod.color} relative flex items-center justify-center`}>
                    <Icon className="w-20 h-20 text-white/20" />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">{mod.title}</h3>
                    <ul className="space-y-2">
                      {mod.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Sistem Role Fleksibel</h2>
            <p className="text-white/50 text-lg">Setiap pengguna memiliki akses sesuai perannya</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <div key={role.name} className="glass-card rounded-2xl p-6 text-center hover:border-white/20 transition-all hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="font-semibold text-white text-sm">{role.name}</p>
                  <p className="text-xs text-white/40 mt-1">{role.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/10 pointer-events-none" />
            <h2 className="text-4xl font-bold text-white mb-4 relative">Siap Mengelola Kegiatan Sekolah?</h2>
            <p className="text-white/50 text-lg mb-8 relative">Mulai gunakan SMKS Digital sekarang juga</p>
            <Link href="/auth/login">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 shadow-2xl shadow-blue-500/30 gap-2 px-10 font-semibold text-base relative">
                Masuk ke Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Top grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-white font-bold text-sm">SM</span>
                </div>
                <span className="font-bold text-white text-lg">SMKS Digital</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed mb-5">
                Platform manajemen kegiatan sekolah yang modern, aman, dan mudah digunakan untuk seluruh civitas akademika.
              </p>
              {/* Social */}
              <div className="flex items-center gap-3">
                {[
                  { label: 'IG', href: '#', emoji: '📸' },
                  { label: 'YT', href: '#', emoji: '▶️' },
                  { label: 'TW', href: '#', emoji: '🐦' },
                ].map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="w-9 h-9 rounded-xl border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all text-xs font-bold"
                    aria-label={s.label}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigasi */}
            <div>
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Navigasi</p>
              <ul className="space-y-3">
                {[
                  { label: 'Beranda', href: '#' },
                  { label: 'Fitur', href: '#features' },
                  { label: 'Modul', href: '#modules' },
                  { label: 'Role Pengguna', href: '#roles' },
                  { label: 'Masuk', href: '/auth/login' },
                ].map(l => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-white/40 hover:text-white transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modul */}
            <div>
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Modul</p>
              <ul className="space-y-3">
                {[
                  { label: 'Classmeeting', href: '#modules' },
                  { label: 'Pemilu OSIS', href: '#modules' },
                  { label: 'Event Management', href: '#modules' },
                  { label: 'Pengumuman', href: '#modules' },
                  { label: 'Real Count', href: '#modules' },
                ].map(l => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-white/40 hover:text-white transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Kontak</p>
              <ul className="space-y-3">
                {[
                  { icon: Building2, text: 'SMK Negeri 1 Kota' },
                  { icon: Mail,      text: 'osis@smks.sch.id' },
                  { icon: Phone,     text: '(021) 1234-5678' },
                  { icon: Globe,     text: 'www.smks.sch.id' },
                ].map(c => (
                  <li key={c.text} className="flex items-center gap-2 text-sm text-white/40">
                    <c.icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.06] mb-8" />

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/25">
              © 2026 <span className="text-white/40 font-medium">SMKS Digital</span>. Hak cipta dilindungi undang-undang.
            </p>
            <div className="flex items-center gap-6">
              {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Bantuan'].map(l => (
                <a key={l} href="#" className="text-xs text-white/25 hover:text-white/50 transition-colors">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

