'use client'

import { useAuth } from '@/context/AuthContext'
import { events, candidates, announcements, leaderboard, votingSession } from '@/lib/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Trophy, Vote, Calendar, Megaphone, Users, BarChart3, CheckCircle, Clock } from 'lucide-react'

export default function DashboardPage() {
  const { currentUser } = useAuth()

  // Super Admin Dashboard
  if (currentUser?.role === 'super-admin') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">Kelola semua aspek sistem manajemen kegiatan sekolah</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: 'Total Siswa', value: '450', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
            { icon: Calendar, label: 'Total Event', value: events.length.toString(), color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
            { icon: Trophy, label: 'Peserta Lomba', value: '12', color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-50' },
            { icon: Vote, label: 'Sudah Vote', value: votingSession.votedCount.toString(), color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' }
          ].map((metric, idx) => {
            const Icon = metric.icon
            return (
              <div key={idx} className="rounded-2xl card-premium overflow-hidden group">
                <div className={`h-2 w-full bg-gradient-to-r ${metric.color}`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">{metric.label}</p>
                      <p className="text-4xl font-black text-gray-900">{metric.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${metric.bgColor} group-hover:scale-110 smooth-transition`}>
                      <Icon className={`w-6 h-6 bg-gradient-to-br ${metric.color} bg-clip-text text-transparent`} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl card-premium overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Event Aktif
              </h3>
              <div className="space-y-3">
                {events.filter(e => e.status === 'active').map(event => (
                  <div key={event.id} className="flex items-start justify-between p-4 bg-blue-50/50 rounded-xl hover:bg-blue-100/50 smooth-transition">
                    <div>
                      <p className="font-semibold text-gray-900">{event.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{new Date(event.date).toLocaleDateString('id-ID')}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Aktif</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/events">
                <Button className="w-full mt-4 gradient-primary text-white smooth-transition">Kelola Event</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl card-premium overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-1"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Statistik Voting
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Pemilih</span>
                  <span className="text-2xl font-bold text-gray-900">{votingSession.totalVoters}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Sudah Memilih</span>
                  <span className="text-2xl font-bold text-green-600">{votingSession.votedCount}</span>
                </div>
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full smooth-transition"
                      style={{ width: `${(votingSession.votedCount / votingSession.totalVoters) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-600">
                    {Math.round((votingSession.votedCount / votingSession.totalVoters) * 100)}% partisipasi
                  </p>
                </div>
              </div>
              <Link href="/dashboard/pemilu/real-count">
                <Button className="w-full mt-4 gradient-primary text-white smooth-transition">Lihat Real Count</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Siswa Dashboard
  if (currentUser?.role === 'siswa') {
    const activeVoting = votingSession.status === 'open'

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900">Halo, {currentUser.name}!</h1>
          <p className="text-gray-600 mt-2 text-lg">Selamat datang di sistem manajemen kegiatan sekolah</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {activeVoting && (
            <Link href="/dashboard/pemilu/voting">
              <div className="rounded-2xl card-premium overflow-hidden group cursor-pointer">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-1"></div>
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg group-hover:scale-110 smooth-transition">
                      <Vote className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Voting Aktif</p>
                      <p className="text-sm text-gray-600">Pilih kandidat OSIS</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          <Link href="/dashboard/classmeeting/schedule">
            <div className="rounded-2xl card-premium overflow-hidden group cursor-pointer">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:scale-110 smooth-transition">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Jadwal Hari Ini</p>
                    <p className="text-sm text-gray-600">Lihat lomba mendatang</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/pengumuman">
            <div className="rounded-2xl card-premium overflow-hidden group cursor-pointer">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-1"></div>
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg group-hover:scale-110 smooth-transition">
                    <Megaphone className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Pengumuman</p>
                    <p className="text-sm text-gray-600">{announcements.length} pengumuman</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Classmeeting 2026
              </CardTitle>
              <CardDescription>Kompetisi antar kelas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Ikuti kompetisi Classmeeting dan tunjukkan potensi kelas Anda!
              </p>
              <Link href="/dashboard/classmeeting/leaderboard">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Lihat Leaderboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="w-5 h-5" />
                Pemilu OSIS 2026
              </CardTitle>
              <CardDescription>Pilih ketua OSIS yang terbaik</CardDescription>
            </CardHeader>
            <CardContent>
              {activeVoting ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Voting sedang dibuka!</p>
                  <Link href="/dashboard/pemilu/voting">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Mulai Voting
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Voting akan dibuka segera</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Events */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Event Mendatang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.filter(e => e.status !== 'ended').slice(0, 4).map(event => (
                <div key={event.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{event.name}</p>
                    <p className="text-xs text-gray-600">{new Date(event.date).toLocaleDateString('id-ID')}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded font-medium ${
                    event.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {event.status === 'active' ? 'Aktif' : 'Segera'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Ketua Kelas Dashboard
  if (currentUser?.role === 'ketua-kelas') {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Ketua Kelas</h1>
          <p className="text-gray-600 mt-2">Kelola tim dan pendaftaran kelas Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">25</p>
                <p className="text-sm text-gray-600">Anggota Kelas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-600">Tim Terdaftar</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">2</p>
                <p className="text-sm text-gray-600">Tim Disetujui</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Lomba</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">Daftarkan tim kelas untuk berbagai kategori lomba</p>
              <Link href="/dashboard/classmeeting/competitions">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Lihat Kompetisi</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tim Kelas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">Kelola anggota dan data tim</p>
              <Link href="/dashboard/classmeeting/my-teams">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Kelola Tim</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Kandidat Dashboard
  if (currentUser?.role === 'kandidat') {
    const myCandidacy = candidates[0] // Mock data

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Kandidat</h1>
          <p className="text-gray-600 mt-2">Kelola profil kampanye Anda</p>
        </div>

        <Card className="mb-6 border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Nomor Urut: {myCandidacy.number}</p>
                <p className="text-sm text-gray-600 mt-1">{myCandidacy.visiMisi}</p>
              </div>
              <Vote className="w-12 h-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{myCandidacy.votes}</p>
                <p className="text-sm text-gray-600">Perolehan Suara</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{votingSession.votedCount}</p>
                <p className="text-sm text-gray-600">Total Pemilih</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round((myCandidacy.votes / votingSession.votedCount) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Persentase</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Profil Kampanye</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">Update visi misi dan video kampanye Anda</p>
            <Link href="/dashboard/pemilu/profile">
              <Button className="bg-indigo-600 hover:bg-indigo-700">Edit Profil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Panitia Dashboard
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Panitia</h1>
        <p className="text-gray-600 mt-2">Kelola event dan verifikasi peserta</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">{events.length}</p>
              <p className="text-sm text-gray-600">Event Aktif</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Peserta Terdaftar</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-600">Terverifikasi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Verifikasi Tim</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">Verifikasi data pendaftaran tim</p>
            <Link href="/dashboard/classmeeting/teams">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Lihat Pendaftaran</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Input Hasil</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">Input hasil pertandingan</p>
            <Link href="/dashboard/classmeeting/results">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Input Hasil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
