'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Trophy, BarChart3, Calendar, Users, Lock, Zap } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Trophy,
      title: 'Manajemen Kompetisi',
      description: 'Kelola Classmeeting dengan pendaftaran, jadwal, bracket, dan leaderboard real-time'
    },
    {
      icon: Lock,
      title: 'Voting Aman',
      description: 'Sistem voting OSIS dengan one-time voting, konfirmasi, dan keamanan berbasis NIS'
    },
    {
      icon: BarChart3,
      title: 'Real Count Voting',
      description: 'Monitoring hasil voting real-time dengan grafik dan persentase suara'
    },
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Buat dan kelola berbagai event sekolah dalam satu dashboard'
    },
    {
      icon: Users,
      title: 'Kolaborasi Tim',
      description: 'Koordinasi tim, pembagian peran, dan verifikasi peserta otomatis'
    },
    {
      icon: Zap,
      title: 'Pengumuman Instan',
      description: 'Broadcast pengumuman ke seluruh siswa dengan kategori yang terorganisir'
    }
  ]

  const stats = [
    { label: 'Modul Utama', value: '4' },
    { label: 'Role System', value: '5' },
    { label: 'Fitur Lengkap', value: '20+' }
  ]

  const roles = [
    { name: 'Super Admin', color: 'from-blue-600 to-blue-400' },
    { name: 'Panitia Event', color: 'from-purple-600 to-purple-400' },
    { name: 'Ketua Kelas', color: 'from-cyan-600 to-cyan-400' },
    { name: 'Kandidat OSIS', color: 'from-pink-600 to-pink-400' },
    { name: 'Siswa', color: 'from-green-600 to-green-400' }
  ]

  return (
    <>
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-sm">SM</span>
            </div>
            <span className="font-bold text-lg text-gray-900">SMKS Digital</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 smooth-transition text-sm font-medium">Fitur</a>
            <a href="#roles" className="text-gray-700 hover:text-blue-600 smooth-transition text-sm font-medium">Role System</a>
            <a href="#stats" className="text-gray-700 hover:text-blue-600 smooth-transition text-sm font-medium">Modul</a>
          </div>
          <Link href="/auth/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl smooth-transition">
              Masuk Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200 to-blue-100 rounded-full opacity-40 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-100 rounded-full opacity-40 blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-72 h-72 bg-gradient-to-br from-indigo-200 to-blue-100 rounded-full opacity-30 blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 backdrop-blur-sm border border-blue-200 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-sm font-semibold text-blue-700">Platform Manajemen Kegiatan Sekolah</span>
          </div>

          <h1 className="text-6xl sm:text-7xl font-black text-gray-900 mb-6 text-balance leading-tight">
            Kelola Semua Kegiatan Sekolah <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dalam Satu Tempat</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto text-balance leading-relaxed">
            Platform digital terpadu untuk Classmeeting, Pemilu OSIS, Event Management, dan Pengumuman dengan sistem keamanan berbasis NIS dan role-based access control.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/login">
              <Button size="lg" className="gradient-primary text-white gap-2 shadow-xl hover:shadow-2xl smooth-transition">
                Mulai Sekarang <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="gap-2 smooth-transition hover:border-blue-600 hover:text-blue-600">
                Pelajari Fitur
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div id="stats" className="grid grid-cols-3 gap-4 sm:gap-8 mt-16">
            {stats.map((stat) => (
              <div key={stat.label} className="p-6 rounded-2xl card-premium group">
                <div className="text-4xl font-black bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-600 smooth-transition">{stat.value}</div>
                <div className="text-sm font-semibold text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">Fitur Lengkap dan Terintegrasi</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Semua yang Anda butuhkan untuk mengelola kegiatan sekolah dengan mudah dan efisien</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="group p-6 rounded-2xl card-premium">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Modules Showcase */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">4 Modul Utama</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Sistem terintegrasi untuk berbagai kebutuhan sekolah dengan fitur lengkap</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Trophy, title: 'Classmeeting', color: 'from-orange-500 to-red-500', items: ['Pendaftaran & verifikasi peserta', 'Jadwal pertandingan otomatis', 'Bracket tournament visualization', 'Leaderboard real-time'] },
              { icon: Lock, title: 'Pemilu OSIS', color: 'from-blue-500 to-cyan-500', items: ['Profil kandidat dengan visi misi', 'Voting aman berbasis NIS', 'One-time voting protection', 'Real-time vote counting'] },
              { icon: Calendar, title: 'Event Management', color: 'from-purple-500 to-pink-500', items: ['Buat event sekolah dinamis', 'Kelola status event', 'Verifikasi peserta', 'Tracking peserta & hasil'] },
              { icon: Users, title: 'Pengumuman', color: 'from-green-500 to-emerald-500', items: ['Broadcast instan ke siswa', 'Kategori pengumuman', 'Notifikasi real-time', 'Archive & search'] }
            ].map((module, idx) => {
              const Icon = module.icon
              return (
                <div key={idx} className="overflow-hidden rounded-2xl card-premium group">
                  <div className={`h-32 bg-gradient-to-br ${module.color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 smooth-transition">
                      <Icon className="w-32 h-32" />
                    </div>
                    <Icon className="w-20 h-20 text-white opacity-80 relative z-10" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{module.title}</h3>
                    <ul className="space-y-2">
                      {module.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                          <span className="text-sm">{item}</span>
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

      {/* Role System */}
      <section id="roles" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">Sistem Role Fleksibel</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Setiap pengguna memiliki akses dan fitur sesuai perannya di sekolah</p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 mb-12">
            {roles.map((role) => (
              <div key={role.name} className={`group overflow-hidden rounded-2xl bg-gradient-to-br ${role.color} shadow-lg hover:shadow-2xl smooth-transition cursor-pointer transform hover:scale-105`}>
                <div className="h-32 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 smooth-transition">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="px-4 py-6 bg-gradient-to-t from-black/30 to-transparent">
                  <p className="text-center font-bold text-white">{role.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-2xl card-premium bg-gradient-to-br from-white to-blue-50/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Akses Role-Based</h3>
            <div className="grid md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <p className="font-semibold mb-2">Super Admin</p>
                <p className="text-sm">Kelola semua event, user, kelas, dan backup data</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Panitia Event</p>
                <p className="text-sm">Kelola event tertentu, input hasil, verifikasi peserta</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Kandidat OSIS</p>
                <p className="text-sm">Edit profil kampanye, upload visi misi, monitor suara</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Ketua Kelas</p>
                <p className="text-sm">Daftar lomba, kelola tim, input data anggota</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Siswa</p>
                <p className="text-sm">Voting, lihat jadwal, lihat pengumuman, ranking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Siap Mengelola Kegiatan Sekolah?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Mulai gunakan SMKS Digital sekarang juga tanpa perlu setup rumit
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 gap-2">
              Masuk ke Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">SMKS Digital</h3>
              <p className="text-sm text-gray-600">Platform manajemen kegiatan sekolah modern</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Modul</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Classmeeting</a></li>
                <li><a href="#" className="hover:text-blue-600">Pemilu OSIS</a></li>
                <li><a href="#" className="hover:text-blue-600">Event Management</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Fitur</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#features" className="hover:text-blue-600">Fitur Lengkap</a></li>
                <li><a href="#roles" className="hover:text-blue-600">Role System</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Bantuan</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Dokumentasi</a></li>
                <li><a href="#" className="hover:text-blue-600">Kontak</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 SMKS Digital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
