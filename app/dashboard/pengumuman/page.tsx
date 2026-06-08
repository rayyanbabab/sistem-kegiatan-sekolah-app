'use client'

import { announcements } from '@/lib/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MessageCircle, Trophy, Vote, School } from 'lucide-react'

export default function PengumumanPage() {
  // Sort by date (newest first)
  const sortedAnnouncements = [...announcements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sekolah':
        return <School className="w-5 h-5" />
      case 'lomba':
        return <Trophy className="w-5 h-5" />
      case 'pemilu':
        return <Vote className="w-5 h-5" />
      case 'juara':
        return <Trophy className="w-5 h-5" />
      default:
        return <MessageCircle className="w-5 h-5" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'sekolah':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sekolah' }
      case 'lomba':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Lomba' }
      case 'pemilu':
        return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Pemilu' }
      case 'juara':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Juara' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Pengumuman' }
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900">Pengumuman</h1>
        <p className="text-gray-600 mt-2 text-lg">Informasi penting tentang kegiatan sekolah</p>
      </div>

      {/* Filter Tags */}
      <div className="flex flex-wrap gap-3 mb-8">
        {['Semua', 'Sekolah', 'Lomba', 'Pemilu', 'Juara'].map((tag) => (
          <button key={tag} className="px-4 py-2 rounded-full font-semibold text-sm smooth-transition hover:scale-105 border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50">
            {tag}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {sortedAnnouncements.map((announcement, index) => {
          const typeBadge = getTypeBadge(announcement.type)
          const announcementDate = new Date(announcement.date)
          const isNew = (new Date().getTime() - announcementDate.getTime()) < (7 * 24 * 60 * 60 * 1000)

          return (
            <div key={announcement.id} className="rounded-2xl card-premium overflow-hidden group">
              <div className="flex gap-4 p-6">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${typeBadge.bg} ${typeBadge.text} group-hover:scale-110 smooth-transition`}>
                  {getTypeIcon(announcement.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{announcement.title}</h3>
                      {isNew && (
                        <span className="text-xs bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full font-bold mt-1 inline-block">
                          BARU
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {announcement.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                        announcement.type === 'sekolah' ? 'bg-blue-600' :
                        announcement.type === 'lomba' ? 'bg-green-600' :
                        announcement.type === 'pemilu' ? 'bg-purple-600' :
                        'bg-yellow-600'
                      }`}>
                        {typeBadge.label}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {announcementDate.toLocaleDateString('id-ID')}
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-bold smooth-transition">
                      Baca →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {sortedAnnouncements.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Tidak ada pengumuman</p>
              <p className="text-gray-400 text-sm">Cek kembali nanti untuk update terbaru</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 text-base">Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <p>• Baca semua pengumuman dengan cermat</p>
          <p>• Aktifkan notifikasi untuk mendapat update terbaru</p>
          <p>• Jika ada pertanyaan, hubungi panitia yang bersangkutan</p>
        </CardContent>
      </Card>
    </div>
  )
}
