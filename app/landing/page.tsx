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
      <nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SM</span>
            </div>
            <span className="font-bold text-gray-900">SMKS Digital</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Fitur</a>
            <a href="#roles" className="text-gray-700 hover:text-blue-600 transition">Role System</a>
            <a href="#stats" className="text-gray-700 hover:text-blue-600 transition">Modul</a>
          </div>
          <Link href="/auth/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Masuk Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-blue-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-purple-100 rounded-full opacity-30 blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
            Platform Manajemen Kegiatan Sekolah Modern
          </Badge>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Kelola Semua Kegiatan Sekolah Dalam Satu Tempat
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
            Platform digital terpadu untuk Classmeeting, Pemilu OSIS, Event Management, dan Pengumuman Sekolah dengan sistem keamanan berbasis NIS dan role-based access control.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                Mulai Sekarang <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="gap-2">
                Pelajari Fitur
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div id="stats" className="grid grid-cols-3 gap-4 sm:gap-8 mt-16">
            {stats.map((stat) => (
              <div key={stat.label} className="p-4 rounded-lg bg-white/60 backdrop-blur border border-gray-200">
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fitur Lengkap dan Terintegrasi</h2>
            <p className="text-xl text-gray-600">Semua yang Anda butuhkan untuk mengelola kegiatan sekolah</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className="border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Modules Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">4 Modul Utama</h2>
            <p className="text-xl text-gray-600">Sistem terintegrasi untuk berbagai kebutuhan sekolah</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-48 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Trophy className="w-24 h-24 text-white opacity-20" />
              </div>
              <CardHeader>
                <h3 className="text-2xl font-bold text-gray-900">Classmeeting</h3>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-600">
                <p>• Pendaftaran & verifikasi peserta</p>
                <p>• Jadwal pertandingan otomatis</p>
                <p>• Bracket tournament visualization</p>
                <p>• Leaderboard real-time</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Lock className="w-24 h-24 text-white opacity-20" />
              </div>
              <CardHeader>
                <h3 className="text-2xl font-bold text-gray-900">Pemilu OSIS</h3>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-600">
                <p>• Profil kandidat dengan visi misi</p>
                <p>• Voting aman berbasis NIS</p>
                <p>• One-time voting protection</p>
                <p>• Real-time vote counting</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Calendar className="w-24 h-24 text-white opacity-20" />
              </div>
              <CardHeader>
                <h3 className="text-2xl font-bold text-gray-900">Event Management</h3>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-600">
                <p>• Buat event sekolah dinamis</p>
                <p>• Kelola status event</p>
                <p>• Verifikasi peserta</p>
                <p>• Tracking peserta & hasil</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Users className="w-24 h-24 text-white opacity-20" />
              </div>
              <CardHeader>
                <h3 className="text-2xl font-bold text-gray-900">Pengumuman</h3>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-600">
                <p>• Broadcast instan ke siswa</p>
                <p>• Kategori pengumuman</p>
                <p>• Notifikasi real-time</p>
                <p>• Archive & search</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Role System */}
      <section id="roles" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sistem Role Fleksibel</h2>
            <p className="text-xl text-gray-600">Setiap pengguna memiliki akses sesuai perannya</p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {roles.map((role) => (
              <Card key={role.name} className={`border-0 shadow-md hover:shadow-lg transition overflow-hidden bg-gradient-to-br ${role.color}`}>
                <div className="h-24 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <CardContent className="pt-4 pb-6">
                  <p className="text-center font-semibold text-white text-sm">{role.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-8 bg-blue-50 rounded-xl border border-blue-200">
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
