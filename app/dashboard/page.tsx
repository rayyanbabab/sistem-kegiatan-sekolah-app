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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Kelola semua aspek sistem manajemen kegiatan sekolah</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">450</p>
                <p className="text-sm text-gray-600">Total Siswa</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{events.length}</p>
                <p className="text-sm text-gray-600">Total Event</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Peserta Lomba</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Vote className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{votingSession.votedCount}</p>
                <p className="text-sm text-gray-600">Sudah Vote</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Event Aktif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.filter(e => e.status === 'active').map(event => (
                  <div key={event.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{event.name}</p>
                      <p className="text-xs text-gray-600">{new Date(event.date).toLocaleDateString('id-ID')}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Aktif</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/events">
                <Button variant="outline" className="w-full mt-4">Kelola Event</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Statistik Voting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Pemilih</span>
                  <span className="font-bold text-gray-900">{votingSession.totalVoters}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sudah Memilih</span>
                  <span className="font-bold text-green-600">{votingSession.votedCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(votingSession.votedCount / votingSession.totalVoters) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  {Math.round((votingSession.votedCount / votingSession.totalVoters) * 100)}% partisipasi
                </p>
              </div>
              <Link href="/dashboard/pemilu/real-count">
                <Button variant="outline" className="w-full mt-4">Lihat Real Count</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Siswa Dashboard
  if (currentUser?.role === 'siswa') {
    const activeVoting = votingSession.status === 'open'

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Halo, {currentUser.name}!</h1>
          <p className="text-gray-600 mt-2">Selamat datang di sistem manajemen kegiatan sekolah</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {activeVoting && (
            <Link href="/dashboard/pemilu/voting">
              <Card className="bg-purple-50 border-purple-200 cursor-pointer hover:shadow-lg transition">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Vote className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Voting Aktif</p>
                      <p className="text-sm text-gray-600">Pilih kandidat OSIS</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          <Link href="/dashboard/classmeeting/schedule">
            <Card className="bg-blue-50 border-blue-200 cursor-pointer hover:shadow-lg transition">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Jadwal Hari Ini</p>
                    <p className="text-sm text-gray-600">Lihat lomba mendatang</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/pengumuman">
            <Card className="bg-orange-50 border-orange-200 cursor-pointer hover:shadow-lg transition">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Megaphone className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Pengumuman</p>
                    <p className="text-sm text-gray-600">{announcements.length} pengumuman</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
